import React, {FC, useEffect, useState} from "react"
import {RouteComponentProps} from "react-router-dom"
import {Form, Field} from "react-final-form"

import Link from "../shared/link"
import useAuth, {AuthCredentials} from "./context"
import $auth from "./service"

import classes from "./login.module.scss"

type Step = "email" | "password"

const Login: FC<RouteComponentProps> = props => {
  const [step, setStep] = useState<Step>("email")
  const auth = useAuth()

  async function nextStep(credentials: AuthCredentials) {
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

  const renderFields = () => {
    switch (step) {
      case "email":
        return (
          <>
            <div className={classes.login}>
              <label className={classes.label}>Adresse email</label>
              <Field
                autoFocus
                className={classes.input}
                name="email"
                component="input"
                type="email"
              />
            </div>

            <button className={classes.continue} type="submit">
              Continuer
            </button>

            <div className={classes.separator}>
              <span>ou</span>
            </div>

            <div className={classes.otherContinues}>
              <button className={classes.continueWithGoogle} type="button">
                Continuer avec Google
              </button>
              <button className={classes.continueWithFacebook} type="button">
                Continuer avec Facebook
              </button>
            </div>

            <div>
              <Link className={classes.link} to="/forgotten-password">
                Créer un compte
              </Link>
            </div>
          </>
        )

      case "password":
        return (
          <>
            <div className={classes.formItem}>
              <label className={classes.label}>Login</label>
              <Field
                autoFocus
                className={classes.input}
                name="email"
                component="input"
                type="email"
              />
            </div>

            <div className={classes.formItem}>
              <label className={classes.label}>Password</label>
              <Field className={classes.input} name="password" component="input" type="password" />
              <div>
                <Link className={classes.link} to="/forgotten-password">
                  Mot de passe oublié
                </Link>
              </div>
            </div>

            <div>
              <button className={classes.submit} type="submit">
                Connecter
              </button>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className={classes.container}>
      <img className={classes.logo} src="/images/logo.svg" alt="" />
      <Form
        onSubmit={nextStep}
        render={({handleSubmit}) => (
          <form className={classes.form} onSubmit={handleSubmit}>
            {renderFields()}
          </form>
        )}
      />
    </div>
  )
}

export default Login
