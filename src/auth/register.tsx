import React, {FC, Dispatch, SetStateAction, useEffect, useState} from "react"
import {RouteComponentProps} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {animated} from "react-spring"
import {toast} from "react-toastify"

import Loader from "../async/loader"
import useAsync from "../async/context"
import Link from "../shared/link"
import useAuth from "./context"
import $auth from "./service"
import {useEnteringTranslation, usePerspective} from "./animations"

import classes from "./auth.module.scss"

const Register: FC<RouteComponentProps> = props => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const auth = useAuth()
  const {loading, setLoading} = useAsync()
  const enteringTrans = useEnteringTranslation()
  const perspective = usePerspective()
  const {t} = useTranslation("auth")

  useEffect(() => {
    if (auth.state.authenticated) {
      props.history.push("/")
    }
  }, [auth, props.history])

  if (!auth.state.initialized) {
    return null
  }

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    if (loading) return

    try {
      setLoading(true)
      await $auth.register({email, password})
    } catch (err) {
      setLoading(false)
      toast.error(t(err.code))
    }
  }

  function handleChange(set: Dispatch<SetStateAction<string>>) {
    return (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (loading) return
      set(evt.target.value)
    }
  }

  return (
    <div onMouseMove={perspective.handleMouseMove} className={classes.container}>
      <img className={classes.logo} src="/images/logo.svg" alt="" />
      <animated.div className={classes.content} style={perspective.style}>
        <animated.form className={classes.form} onSubmit={handleSubmit} style={enteringTrans.style}>
          <div className={classes.login}>
            <label className={classes.label}>{t("email")}</label>
            <input
              className={classes.input}
              type="email"
              name="email"
              autoComplete="email"
              onChange={handleChange(setEmail)}
              value={email}
              autoFocus
            />
          </div>

          <div className={classes.login}>
            <label className={classes.label}>{t("password")}</label>
            <input
              className={classes.input}
              type="password"
              name="password"
              autoComplete="new-password"
              onChange={handleChange(setPassword)}
              value={password}
            />
          </div>

          <button
            className={classes.continue}
            type="submit"
            disabled={!email || !password || loading}
          >
            <span>{t("continue")}</span>
            <Loader className={classes.loader} />
          </button>

          <div>
            <Link className={classes.link} to="/login">
              {t("login")}
            </Link>
          </div>
        </animated.form>
      </animated.div>
    </div>
  )
}

export default Register
