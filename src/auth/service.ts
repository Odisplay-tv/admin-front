import firebase, {auth, firestore} from "../app/firebase"
import {AuthCredentials, User} from "./model"

function _register(user: firebase.User) {
  return firestore("users", user.uid).set({
    id: user.uid,
    email: user.email,
    uploads: [],
    createdAt: new Date(),
  })
}

type AuthStateChangedHandler = (auth: firebase.User | null, user: User | null) => void
export function onAuthStateChanged(handler: AuthStateChangedHandler) {
  return auth.onAuthStateChanged(async fbaseUser => {
    if (!fbaseUser) return handler(null, null)
    const ref = await firestore("users", fbaseUser.uid).get()
    const fstoreUser = ref.data() || null
    handler(fbaseUser, fstoreUser as User | null)
  })
}

type UserChangedHandler = (user: User | null) => void
export function onUserChanged(id: string, handler: UserChangedHandler) {
  return firestore("users", id).onSnapshot(ref => {
    const user = ref.data() || null
    handler(user as User | null)
  })
}

export function addUploads(userId: string, uploads: string[]) {
  return firestore("users", userId).set({uploads}, {merge: true})
}

export async function register({email, password}: AuthCredentials) {
  const {user} = await auth.createUserWithEmailAndPassword(email, password)
  if (!user) throw new Error("auth/user-not-found")
  await _register(user)
}

export function resetPassword(email: AuthCredentials["email"]) {
  return auth.sendPasswordResetEmail(email)
}

export async function loginWithCredentials({email, password}: AuthCredentials) {
  const creds = await auth.signInWithEmailAndPassword(email, password)
  return creds.user
}

export async function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider()
  const {user} = await auth.signInWithPopup(provider)
  if (!user) throw new Error("auth/user-not-found")
  const firestoreUser = await firestore("users", user.uid).get()
  if (!firestoreUser.exists) await _register(user)
}

export async function loginWithFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider()
  const {user} = await auth.signInWithPopup(provider)
  if (!user) throw new Error("auth/user-not-found")
  const firestoreUser = await firestore("users", user.uid).get()
  if (!firestoreUser.exists) await _register(user)
}

export function logout() {
  return auth.signOut()
}

export default {
  onAuthStateChanged,
  register,
  resetPassword,
  loginWithCredentials,
  loginWithGoogle,
  loginWithFacebook,
  logout,
  onUserChanged,
  addUploads,
}
