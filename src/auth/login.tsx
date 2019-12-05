import React, {FC, useEffect, useState} from "react"
import {RouteComponentProps} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {animated, useSpring, useTransition} from "react-spring"
import {toast} from "react-toastify"

import Loader from "../async/loader"
import useAsync from "../async/context"
import Link from "../shared/link"
import useAuth from "./context"
import $auth from "./service"

import classes from "./auth.module.scss"

type Step = "get-email" | "get-password"

type LoginFormProps = {
  step: Step
  nextStep: (field: string) => Promise<void>
}

const transitionConf = {
  from: {transform: "translateX(100px)", opacity: 0},
  enter: {transform: "translateX(0)", opacity: 1},
  leave: {transform: "translateX(-500px)", opacity: 0},
  config: {
    mass: 1,
    tension: 130,
    friction: 25,
  },
}

const Login: FC<RouteComponentProps> = props => {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<Step>("get-email")
  const auth = useAuth()

  const [style, updateSpring] = useSpring(() => ({
    xy: [0, 0],
    config: {mass: 5, tension: 350, friction: 40},
  }))

  useEffect(() => {
    if (auth.state.authenticated) {
      props.history.push("/")
    }
  }, [auth, props.history])

  if (!auth.state.initialized) {
    return null
  }

  const trans = (x: number, y: number) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg)`
  const calc = (x: number, y: number) => [
    -(y - window.innerHeight / 2) / 300,
    (x - window.innerWidth / 2) / 500,
  ]

  return (
    <div
      onMouseMove={({clientX: x, clientY: y}) => updateSpring({xy: calc(x, y)})}
      className={classes.container}
    >
      <img className={classes.logo} src="/images/logo.svg" alt="" />
      <animated.div
        className={classes.content}
        style={{transform: style.xy.interpolate(trans as any)}}
      >
        <EmailStep
          step={step}
          nextStep={async data => {
            setEmail(data)
            setStep("get-password")
          }}
        />

        <PasswordStep
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
  const transitions = useTransition(step === "get-email", null, transitionConf)
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

          <button className={classes.continue} type="submit" disabled={!email || loading}>
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
            <button className={classes.continueWithGoogle} type="button" onClick={loginWithGoogle}>
              {t("continue-with-google")}
            </button>
            <button
              className={classes.continueWithFacebook}
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

const PasswordStep: FC<LoginFormProps> = ({step, nextStep}) => {
  const [password, setPassword] = useState("")
  const {loading, setLoading} = useAsync()
  const transitions = useTransition(step === "get-password", null, transitionConf)
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

          <button className={classes.continue} type="submit" disabled={!password || loading}>
            <span>{t("continue")}</span>
            <Loader className={classes.loader} />
          </button>

          <div>
            <Link className={classes.link} to="/forgotten-password">
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
