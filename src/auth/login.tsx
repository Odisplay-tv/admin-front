import React, {FC, useEffect, useState} from "react"
import {RouteComponentProps} from "react-router-dom"

import Link from "../shared/link"
import useAuth from "./context"
import $auth from "./service"

import classes from "./login.module.scss"

type Step = "email" | "password" | "connect"

type LoginFormProps = {
  nextStep: (field: string) => void
}

const Login: FC<RouteComponentProps> = props => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState<Step>("email")
  const auth = useAuth()

  useEffect(() => {
    if (auth.state.authenticated) {
      props.history.push("/")
    }
  }, [auth, props.history])

  if (!auth.state.initialized) {
    return null
  }

  const renderForm = () => {
    switch (step) {
      case "email":
        return (
          <EmailStep
            nextStep={nextEmail => {
              setEmail(nextEmail)
              setStep("password")
            }}
          />
        )

      case "password":
        return (
          <PasswordStep
            nextStep={nextPassword => {
              setPassword(nextPassword)
              setStep("connect")
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={classes.container}>
      <img className={classes.logo} src="/images/logo.svg" alt="" />
      {renderForm()}
    </div>
  )
}

const EmailStep: FC<LoginFormProps> = ({nextStep}) => {
  const [email, setEmail] = useState("")

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setEmail(evt.target.value)
  }

  function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    nextStep(email)
  }

  async function loginWithGoogle() {
    try {
      await $auth.loginWithGoogle()
    } catch (err) {
      console.log(err)
    }
  }

  async function loginWithFacebook() {
    try {
      await $auth.loginWithFacebook()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <div className={classes.login}>
        <label className={classes.label}>Adresse email</label>
        <input
          className={classes.input}
          type="email"
          name="email"
          autoFocus
          onChange={handleChange}
        />
      </div>

      <button className={classes.continue} type="submit">
        Continuer
      </button>

      <div>
        <Link className={classes.link} to="/register">
          Créer un compte
        </Link>
      </div>

      <div className={classes.separator}>
        <span>ou</span>
      </div>

      <div className={classes.otherContinues}>
        <button className={classes.continueWithGoogle} type="button" onClick={loginWithGoogle}>
          Continuer avec Google
        </button>
        <button className={classes.continueWithFacebook} type="button" onClick={loginWithFacebook}>
          Continuer avec Facebook
        </button>
      </div>
    </form>
  )
}

const PasswordStep: FC<LoginFormProps> = ({nextStep}) => {
  const [password, setPassword] = useState("")

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setPassword(evt.target.value)
  }

  function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    nextStep(password)
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <div className={classes.login}>
        <label className={classes.label}>Mot de passe</label>
        <input
          className={classes.input}
          type="password"
          name="password"
          autoFocus
          onChange={handleChange}
        />
      </div>

      <button className={classes.continue} type="submit">
        Continuer
      </button>

      <div>
        <Link className={classes.link} to="/forgotten-password">
          Mot de passe oublié
        </Link>
      </div>
    </form>
  )
}

export default Login
