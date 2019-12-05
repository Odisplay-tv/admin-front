import React, {FC, useEffect, useState} from "react"
import {RouteComponentProps} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {animated} from "react-spring"
import {toast} from "react-toastify"

import Loader from "../async/loader"
import useAsync from "../async/context"
import Link from "../shared/link"
import useAuth from "./context"
import $auth from "./service"
import {useStepTranslation, usePerspective} from "./animations"

import classes from "./auth.module.scss"

type Step = "get-email" | "get-password"

type LoginFormProps = {
  email: string
  step: Step
  nextStep: (field: string) => Promise<void>
}

const Login: FC<RouteComponentProps> = props => {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<Step>("get-email")
  const auth = useAuth()
  const perspective = usePerspective()

  useEffect(() => {
    if (auth.state.authenticated) {
      props.history.push("/")
    }
  }, [auth, props.history])

  if (!auth.state.initialized) {
    return null
  }

  return (
    <div onMouseMove={perspective.handleMouseMove} className={classes.container}>
      <img className={classes.logo} src="/images/logo.svg" alt="" />
      <animated.div className={classes.content} style={perspective.style}>
        <EmailStep
          email={email}
          step={step}
          nextStep={async data => {
            setEmail(data)
            setStep("get-password")
          }}
        />

        <PasswordStep
          email={email}
          step={step}
          nextStep={async password => {
            await $auth.loginWithCredentials({email, password})
          }}
        />
      </animated.div>
    </div>
  )
}

const EmailStep: FC<LoginFormProps> = ({step, nextStep}) => {
  const [email, setEmail] = useState("")
  const {loading, setLoading} = useAsync()
  const {transitions} = useStepTranslation(step === "get-email")
  const {t} = useTranslation("auth")

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    if (loading) return
    setEmail(evt.target.value)
  }

  function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    if (loading) return
    nextStep(email)
  }

  async function loginWithGoogle() {
    try {
      setLoading(true)
      await $auth.loginWithGoogle()
    } catch (err) {
      setLoading(false)
      toast.error(t(err.code))
    }
  }

  async function loginWithFacebook() {
    try {
      setLoading(true)
      await $auth.loginWithFacebook()
    } catch (err) {
      setLoading(false)
      toast.error(t(err.code))
    }
  }

  const render = transitions.map(
    ({key, item, props}) =>
      item && (
        <animated.form key={key} className={classes.form} onSubmit={handleSubmit} style={props}>
          <div className={classes.login}>
            <label className={classes.label}>{t("email")}</label>
            <input
              className={classes.input}
              type="email"
              name="email"
              autoComplete="email"
              onChange={handleChange}
              autoFocus
            />
          </div>

          <button className={classes.buttonSuccess} type="submit" disabled={!email || loading}>
            <span>{t("continue")}</span>
            <Loader className={classes.loader} />
          </button>

          <div>
            <Link className={classes.link} to="/register">
              {t("register")}
            </Link>
          </div>

          <div className={classes.separator}>
            <span>{t("or")}</span>
          </div>

          <div className={classes.otherContinues}>
            <button className={classes.buttonSuccessGoogle} type="button" onClick={loginWithGoogle}>
              {t("continue-with-google")}
            </button>
            <button
              className={classes.buttonSuccessFacebook}
              type="button"
              onClick={loginWithFacebook}
            >
              {t("continue-with-facebook")}
            </button>
          </div>
        </animated.form>
      ),
  )

  // TypeScript doesn't like <animated> element
  return <>{render}</>
}

const PasswordStep: FC<LoginFormProps> = ({email, step, nextStep}) => {
  const [password, setPassword] = useState("")
  const {loading, setLoading} = useAsync()
  const {transitions} = useStepTranslation(step === "get-password")
  const {t} = useTranslation("auth")

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    if (loading) return
    setPassword(evt.target.value)
  }

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    if (loading) return

    try {
      setLoading(true)
      await nextStep(password)
    } catch (err) {
      toast.error(t(err.code))
      setLoading(false)
    }
  }

  const render = transitions.map(
    ({key, item, props}) =>
      item && (
        <animated.form key={key} className={classes.form} onSubmit={handleSubmit} style={props}>
          <div className={classes.login}>
            <label className={classes.label}>{t("password")}</label>
            <input
              className={classes.input}
              type="password"
              name="password"
              autoComplete="current-password"
              onChange={handleChange}
              autoFocus
            />
          </div>

          <button className={classes.buttonSuccess} type="submit" disabled={!password || loading}>
            <span>{t("continue")}</span>
            <Loader className={classes.loader} />
          </button>

          <div>
            <Link className={classes.link} to={{pathname: "/reset-password", state: {email}}}>
              {t("forgotten-password")}
            </Link>
          </div>
        </animated.form>
      ),
  )

  // TypeScript doesn't like <animated> element
  return <>{render}</>
}

export default Login
