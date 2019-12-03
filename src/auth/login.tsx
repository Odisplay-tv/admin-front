import React, {FC, useEffect} from "react"
import {RouteComponentProps} from "react-router-dom"
import {Form, Field} from "react-final-form"

import useAuth, {AuthCredentials} from "./context"
import $auth from "./service"

/* import classes from "./login.module.scss" */

const Login: FC<RouteComponentProps> = props => {
  const auth = useAuth()

  async function onSubmit(credentials: AuthCredentials) {
    try {
      await $auth.login(credentials)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (auth.state.authenticated) {
      props.history.push("/")
    }
  }, [auth, props.history])

  if (!auth.state.initialized) {
    return null
  }

  return (
    <Form
      onSubmit={onSubmit}
      render={({handleSubmit}) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Login</label>
            <Field name="email" component="input" type="email" placeholder="Email" />
          </div>

          <div>
            <label>Password</label>
            <Field name="password" component="input" type="password" placeholder="Password" />
          </div>

          <button type="submit">Send</button>
        </form>
      )}
    />
  )
}

export default Login
