import React, {FC, Reducer, Dispatch, createContext, useContext, useEffect, useReducer} from "react"

import firebase, {auth} from "../app/firebase"

export type AuthCredentials = {
  email: string
  password: string
}

type AuthAction =
  | {
      type: "login"
      user: firebase.auth.Auth["currentUser"]
    }
  | {
      type: "logout"
    }

type AuthState = {
  initialized: boolean
  authenticated: boolean
  user: firebase.User | null
}

type AuthDispatch = Dispatch<AuthAction>

export const defaultCredentials: AuthCredentials = {email: "", password: ""}

const defaultState: AuthState = {
  initialized: false,
  authenticated: false,
  user: null,
}

const defaultDispatch: AuthDispatch = () => {
  //
}

const AuthContextState = createContext<AuthState>(defaultState)
const AuthContextDispatch = createContext<AuthDispatch>(defaultDispatch)

const reducer: Reducer<AuthState, AuthAction> = (state, action) => {
  switch (action.type) {
    case "login":
      return {initialized: true, authenticated: Boolean(action.user), user: action.user}

    case "logout":
      return {...state, initialized: false, user: null}

    default:
      return state
  }
}

export const useAuthState = () => useContext(AuthContextState)
export const useAuthDispatch = () => useContext(AuthContextDispatch)
export const useAuth = () => {
  const state = useAuthState()
  const dispatch = useAuthDispatch()
  return {state, dispatch}
}

export const AuthContextProvider: FC = ({children}) => {
  const [state, dispatch] = useReducer(reducer, defaultState)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => dispatch({type: "login", user}))
    return () => unsubscribe()
  }, [dispatch, state.initialized])

  return (
    <AuthContextDispatch.Provider value={dispatch}>
      <AuthContextState.Provider value={state}>{children}</AuthContextState.Provider>
    </AuthContextDispatch.Provider>
  )
}

export default useAuth
