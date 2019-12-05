import firebase, {auth} from "../shared/firebase"
import {AuthCredentials} from "./context"

export function register({email, password}: AuthCredentials) {
  return auth.createUserWithEmailAndPassword(email, password)
}

export async function loginWithCredentials({email, password}: AuthCredentials) {
  return auth.signInWithEmailAndPassword(email, password).then(res => res.user)
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

export default {register, loginWithCredentials, loginWithGoogle, loginWithFacebook, logout}
