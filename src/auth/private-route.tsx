import React, {FC} from "react"
import {RouteProps, Route, Redirect} from "react-router-dom"

import {useAuthState} from "./context"

const PrivateRoute: FC<RouteProps> = props => {
  const auth = useAuthState()

  if (!auth.initialized) {
    return null
  }

  if (!auth.authenticated) {
    return <Redirect to="/login" />
  }

  return <Route {...props} />
}

export default PrivateRoute
