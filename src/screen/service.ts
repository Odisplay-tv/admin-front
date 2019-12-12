import firebase, {functions, firestore} from "../app/firebase"

const requestPairingCode = functions.httpsCallable("requestPairingCode")
const linkScreenToUser = functions.httpsCallable("linkScreenToUser")

export async function generatePairingCode() {
  const {data} = await requestPairingCode()
  if (!data.ok) throw new Error(data.message)
  return {screenId: data.id, code: data.code}
}

export async function connectScreen(idToken: string, code: string) {
  const {data} = await linkScreenToUser({idToken, code})
  if (!data.ok) throw new Error(data.message)
}

type ChangeHandler = (doc: firebase.firestore.DocumentData) => void
export function onPairingChange(code: string, handler: ChangeHandler) {
  return firestore("screens", code).onSnapshot(doc => {
    const screen = doc.data()
    if (screen) handler(screen)
  })
}

export function onConfigChange(screenId: string, userId: string, handler: ChangeHandler) {
  return firestore(`users/${userId}/screens`, screenId).onSnapshot(async doc => {
    const screen = doc.data()
    console.debug("screen changed", screen)
    if (!screen || !screen.configId) {
      return handler({})
    }

    const configRef = await firestore(`users/${userId}/screens`, screen.configId).get()
    handler(configRef.data() || {})
  })
}

export default {generatePairingCode, connectScreen, onPairingChange, onConfigChange}
