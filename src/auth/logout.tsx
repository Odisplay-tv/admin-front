import {FC, useCallback, useEffect} from "react"
import {RouteComponentProps} from "react-router-dom"

import {useAuthDispatch} from "./context"
import $auth from "./service"

const Logout: FC<RouteComponentProps> = props => {
  const dispatch = useAuthDispatch()

  const logout = useCallback(async () => {
    await $auth.logout()
    dispatch({type: "auth", user: null})
    props.history.push("/login")
  }, [dispatch, props.history])

  useEffect(() => {
    logout()
  }, [logout])

  return null
}

export default Logout
