import firebase, {auth} from "../shared/firebase"
import {AuthCredentials} from "./context"

export function register({email, password}: AuthCredentials) {
  return auth.createUserWithEmailAndPassword(email, password)
}

export function resetPassword(email: AuthCredentials["email"]) {
  return auth.sendPasswordResetEmail(email)
}

export async function loginWithCredentials({email, password}: AuthCredentials) {
  const creds = await auth.signInWithEmailAndPassword(email, password)
  return creds.user
}

export function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider()
  return auth.signInWithPopup(provider)
}

export function loginWithFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider()
  return auth.signInWithPopup(provider)
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
