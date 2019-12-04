import React, {FC, useEffect, useState} from "react"
import {RouteComponentProps} from "react-router-dom"
import {animated, useSpring, useTransition} from "react-spring"

import Link from "../shared/link"
import useAuth from "./context"
import $auth from "./service"

import classes from "./login.module.scss"

type Step = "get-email" | "get-password" | "login"

type LoginFormProps = {
  step: Step
  nextStep: (field: string) => void
}

const transitionConf = {
  from: {transform: "translateX(50px)", opacity: 0},
  enter: {transform: "translateX(0)", opacity: 1},
  leave: {transform: "translateX(-250px)", opacity: 0},
  config: {
    mass: 1,
    tension: 150,
    friction: 25,
  },
}

const Login: FC<RouteComponentProps> = props => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  useEffect(() => {
    if (step === "login") {
      $auth.loginWithCredentials({email, password}).catch(err => console.log(err))
    }
  }, [email, password, step])

  if (!auth.state.initialized) {
    return null
  }

  const calc = (x: number, y: number) => [
    -(y - window.innerHeight / 2) / 300,
    (x - window.innerWidth / 2) / 500,
  ]

  const trans = (x: number, y: number) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg)`

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
          nextStep={data => {
            setEmail(data)
            setStep("get-password")
          }}
        />

        <PasswordStep
          step={step}
          nextStep={data => {
            setPassword(data)
            setStep("login")
          }}
        />
      </animated.div>
    </div>
  )
}

const EmailStep: FC<LoginFormProps> = ({step, nextStep}) => {
  const [email, setEmail] = useState("")
  const transitions = useTransition(step === "get-email", null, transitionConf)

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

  const render = transitions.map(
    ({key, item, props}) =>
      item && (
        <animated.form key={key} className={classes.form} onSubmit={handleSubmit} style={props}>
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
            <button
              className={classes.continueWithFacebook}
              type="button"
              onClick={loginWithFacebook}
            >
              Continuer avec Facebook
            </button>
          </div>
        </animated.form>
      ),
  )

  // Wrap render inside fragments to please TypeScript
  return <>{render}</>
}

const PasswordStep: FC<LoginFormProps> = ({step, nextStep}) => {
  const [password, setPassword] = useState("")
  const transitions = useTransition(step === "get-password", null, transitionConf)

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setPassword(evt.target.value)
  }

  function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    nextStep(password)
  }

  const render = transitions.map(
    ({key, item, props}) =>
      item && (
        <animated.form key={key} className={classes.form} onSubmit={handleSubmit} style={props}>
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
        </animated.form>
      ),
  )

  // TypeScript doesn't like animated element
  return <>{render}</>
}

export default Login
