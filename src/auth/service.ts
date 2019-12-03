import {auth} from "../shared/firebase"
import {AuthCredentials} from "./context"

export async function login({email, password}: AuthCredentials) {
  return auth.signInWithEmailAndPassword(email, password).then(res => res.user)
}

export async function logout() {
  await auth.signOut()
}

export default {login, logout}
