import React, {FC, Reducer, Dispatch, createContext, useContext, useEffect, useReducer} from "react"

import firebase, {auth} from "../shared/firebase"

export type AuthCredentials = {
  email: string
  password: string
}

type AuthAction =
  | {
      type: "init"
    }
  | {
      type: "auth"
      user: firebase.auth.Auth["currentUser"]
    }

type AuthState = {
  initialized: Boolean
  authenticated: Boolean
  user: firebase.auth.Auth["currentUser"]
}

type AuthDispatch = Dispatch<AuthAction>

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
  console.debug("[auth] action received", action)

  switch (action.type) {
    case "init":
      return {...defaultState, initialized: true}

    case "auth":
      return {initialized: true, authenticated: Boolean(action.user), user: action.user}

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
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!state.initialized) {
        dispatch({type: "init"})
      }

      if (user) {
        dispatch({type: "auth", user})
      }
    })

    return () => unsubscribe()
  }, [dispatch, state.initialized])

  return (
    <AuthContextDispatch.Provider value={dispatch}>
      <AuthContextState.Provider value={state}>{children}</AuthContextState.Provider>
    </AuthContextDispatch.Provider>
  )
}

export default useAuth
