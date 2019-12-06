import React, {FC, ComponentType, useState} from "react"
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom"

import {AuthContextProvider} from "./auth/context"
import {AsyncContextProvider} from "./async/context"
import Register from "./auth/register"
import ResetPassword from "./auth/reset-password"
import Login from "./auth/login"
import Logout from "./auth/logout"
import PrivateRoute from "./auth/private-route"
import Nav from "./shared/nav"
import Aside from "./shared/aside"
import Main from "./shared/main"
import Home from "./home/home"

const App: FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/logout" component={Logout} />
        <PrivateRoute path="/" component={withLayout(Home)} />
        <Redirect to="/login" />
      </Switch>
    </Router>
  )
}

const withLayout = (Component: ComponentType): FC => props => {
  const [isNavVisible, setNavVisibility] = useState(false)

  return (
    <>
      <Nav isVisible={isNavVisible} close={() => setNavVisibility(false)} />
      <Aside openNav={() => setNavVisibility(true)} />
      <Main>
        <Component {...props} />
      </Main>
    </>
  )
}

const withContexts = (Component: ComponentType) => () => (
  <AuthContextProvider>
    <AsyncContextProvider>
      <Component />
    </AsyncContextProvider>
  </AuthContextProvider>
)

export default withContexts(App)
