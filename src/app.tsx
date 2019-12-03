import React, {FC, ComponentType} from "react"
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom"

import {AuthContextProvider} from "./auth/context"
import Login from "./auth/login"
import Logout from "./auth/logout"
import PrivateRoute from "./auth/private-route"
import Home from "./home/home"

const App: FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <PrivateRoute path="/" component={Home} />
        <Redirect to="/login" />
      </Switch>
    </Router>
  )
}

const withContexts = (Component: ComponentType) => () => (
  <AuthContextProvider>
    <Component />
  </AuthContextProvider>
)

export default withContexts(App)
