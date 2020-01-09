import React, {FC, Reducer, Dispatch, createContext, useContext, useEffect, useReducer} from "react"
import isEqual from "lodash/fp/isEqual"
import noop from "lodash/fp/noop"

import {User} from "./model"
import $auth from "./service"

type AuthAction =
  | {
      type: "login"
      auth: firebase.User | null
      user: User | null
    }
  | {
      type: "set-user"
      user: User | null
    }
  | {
      type: "add-uploads"
      uploads: string[]
    }
  | {
      type: "logout"
    }

type AuthState = {
  initialized: boolean
  authenticated: boolean
  auth: firebase.User | null
  user: User | null
}

type AuthDispatch = Dispatch<AuthAction>

const defaultState: AuthState = {
  initialized: false,
  authenticated: false,
  auth: null,
  user: null,
}

const AuthContextState = createContext<AuthState>(defaultState)
const AuthContextDispatch = createContext<AuthDispatch>(noop)

const reducer: Reducer<AuthState, AuthAction> = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        initialized: true,
        authenticated: Boolean(action.user),
        auth: action.auth,
        user: action.user,
      }

    case "set-user": {
      return {
        ...state,
        user: action.user,
      }
    }

    case "add-uploads": {
      if (!state.user) return state
      return {
        ...state,
        user: {...state.user, uploads: state.user.uploads.concat(action.uploads)},
      }
    }

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
    const unsubscribe = $auth.onAuthStateChanged((auth, user) => {
      dispatch({type: "login", auth, user})
    })

    return () => unsubscribe()
  }, [dispatch, state.initialized])

  useEffect(() => {
    if (state.user) {
      const unsubscribe = $auth.onUserChanged(state.user.id, user => {
        if (!isEqual(user, state.user)) {
          dispatch({type: "set-user", user})
        }
      })

      return () => unsubscribe()
    }
  }, [state.user])

  return (
    <AuthContextDispatch.Provider value={dispatch}>
      <AuthContextState.Provider value={state}>{children}</AuthContextState.Provider>
    </AuthContextDispatch.Provider>
  )
}

export default useAuth
