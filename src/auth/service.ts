import firebase, {auth, firestore} from "../app/firebase"
import {AuthCredentials} from "./context"

function _register(user: firebase.User) {
  return firestore("users", user.uid).set({
    id: user.uid,
    email: user.email,
    createdAt: new Date(),
  })
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
  register,
  resetPassword,
  loginWithCredentials,
  loginWithGoogle,
  loginWithFacebook,
  logout,
}
