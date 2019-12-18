import firebase, {functions, firestore} from "../app/firebase"
import {Screen} from "./model"

type ChangeHandler = (doc?: firebase.firestore.DocumentData) => void

const requestPairingCode = functions.httpsCallable("requestPairingCode")
const linkScreenToUser = functions.httpsCallable("linkScreenToUser")

export async function generatePairingCode() {
  const {data} = await requestPairingCode()
  if (!data.ok) throw new Error(data.message)
  return {pairingId: data.id, code: data.code}
}

export async function connectScreen(idToken: string, screen: Partial<Screen>) {
  const {data} = await linkScreenToUser({idToken, ...screen})
  if (!data.ok) throw new Error(data.message)
}

export function onPairingChange(code: string, handler: ChangeHandler) {
  return firestore("pairings", code).onSnapshot(doc => {
    const screen = doc.data()
    if (screen) handler(screen)
  })
}

export function onConfigChange(userId: string, screenId: string, handler: ChangeHandler) {
  return firestore(`users/${userId}/screens`, screenId).onSnapshot(async snap => {
    const screen = snap.data()
    if (!screen) return handler()
    if (!screen.layoutId) return handler({})
    const layoutRef = await firestore(`users/${userId}/layouts`, screen.layoutId).get()
    handler(layoutRef.data() || {})
  })
}

export function update(userId: string, screen: Screen) {
  return firestore(`users/${userId}/screens`, screen.id).set(screen, {merge: true})
}

export {_delete as delete}
function _delete(userId: string, screenId: string) {
  return firestore(`users/${userId}/screens`, screenId).delete()
}

export default {
  generatePairingCode,
  connectScreen,
  onPairingChange,
  onConfigChange,
  update,
  delete: _delete,
}
