import React, {FC, useEffect, useState} from "react"
import {RouteComponentProps} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {animated} from "react-spring"
import {toast} from "react-toastify"

import Loader from "../async/loader"
import useAsync from "../async/context"
import Link from "../shared/link"
import useAuth, {AuthCredentials, defaultCredentials} from "./context"
import $auth from "./service"
import {useStepTranslation, usePerspective} from "./animations"

import classes from "./auth.module.scss"

type Step = "email" | "password"

type StepFormProps = {
  step: Step
  prevStep: () => void
  nextStep: (field: string) => Promise<void>
  creds: AuthCredentials
}

const Login: FC<RouteComponentProps> = props => {
  const [creds, setCreds] = useState(defaultCredentials)
  const [step, setStep] = useState<Step>("email")
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

  function patchCreds(patch: Partial<AuthCredentials>) {
    const nextCreds = {...creds, ...patch}
    setCreds(nextCreds)
    return nextCreds
  }

  return (
    <div onMouseMove={perspective.handleMouseMove} className={classes.container}>
      <img className={classes.logo} src="/images/logo.svg" alt="" />
      <animated.div className={classes.content} style={perspective.style}>
        <EmailStep
          creds={creds}
          step={step}
          prevStep={() => setStep("email")}
          nextStep={async email => {
            patchCreds({email})
            setStep("password")
          }}
        />
        <PasswordStep
          creds={creds}
          step={step}
          prevStep={() => setStep("email")}
          nextStep={async password => {
            await $auth.loginWithCredentials(patchCreds({password}))
          }}
        />
      </animated.div>
    </div>
  )
}

const EmailStep: FC<StepFormProps> = ({creds, step, nextStep}) => {
  const [email, setEmail] = useState(creds.email)
  const {loading, setLoading} = useAsync()
  const {transitions} = useStepTranslation(step === "email")
  const {t} = useTranslation("auth")

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    if (loading) return
    setEmail(evt.target.value.trim())
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
      toast.error(t(err.code))
    }

    setLoading(false)
  }

  async function loginWithFacebook() {
    try {
      setLoading(true)
      await $auth.loginWithFacebook()
    } catch (err) {
      toast.error(t(err.code))
    }

    setLoading(false)
  }

  const view = transitions.map(
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
              autoFocus
              value={email}
              onChange={handleChange}
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
  return <>{view}</>
}

const PasswordStep: FC<StepFormProps> = ({creds, step, prevStep, nextStep}) => {
  const [password, setPassword] = useState(creds.password)
  const {loading, setLoading} = useAsync()
  const {transitions} = useStepTranslation(step === "password")
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
      if (err.code === "auth/user-not-found") {
        prevStep()
      }
    }

    setLoading(false)
  }

  const view = transitions.map(
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
              autoFocus
              onChange={handleChange}
              value={password}
            />
          </div>

          <button className={classes.buttonSuccess} type="submit" disabled={!password || loading}>
            <span>{t("continue")}</span>
            <Loader className={classes.loader} />
          </button>

          <div>
            <Link
              className={classes.link}
              to={{pathname: "/reset-password", state: {email: creds.email}}}
            >
              {t("forgotten-password")}
            </Link>
          </div>
        </animated.form>
      ),
  )

  // TypeScript doesn't like <animated> element
  return <>{view}</>
}

export default Login
