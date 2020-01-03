import React, {FC, ComponentType, useState} from "react"
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom"

import {AuthContextProvider} from "../auth/context"
import {AsyncContextProvider} from "../async/context"
import {ScreenContextProvider} from "../screen/context"
import Register from "../auth/register"
import ResetPassword from "../auth/reset-password"
import Login from "../auth/login"
import Logout from "../auth/logout"
import PrivateRoute from "../auth/private-route"
import Home from "../home/home"
import Viewer from "../screen/viewer"
import ConnectScreen from "../screen/connect"
import ScreenList from "../screen/list"
import ScreenEdit from "../screen/edit"
import Nav from "./nav"
import Aside from "./aside"
import Main from "./main"

const App: FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/logout" component={Logout} />
        <Route path="/viewer" component={Viewer} />
        <PrivateRoute path="/screens/connect" component={withLayout(ConnectScreen)} />
        <PrivateRoute path="/screens/:id" component={withLayout(ScreenEdit)} />
        <PrivateRoute path="/screens" component={withLayout(ScreenList)} />
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
      <ScreenContextProvider>
        <Component />
      </ScreenContextProvider>
    </AsyncContextProvider>
  </AuthContextProvider>
)

export default withContexts(App)
