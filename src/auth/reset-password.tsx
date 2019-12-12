import React, {FC, useEffect, useState} from "react"
import {useHistory, useLocation} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {animated} from "react-spring"
import {toast} from "react-toastify"

import Loader from "../async/loader"
import useAsync from "../async/context"
import Link from "../app/link"
import useAuth from "./context"
import $auth from "./service"
import {useStepTranslation, usePerspective} from "./animations"

import classes from "./auth.module.scss"

const ResetPassword: FC = () => {
  const history = useHistory()
  const {email: defaultEmail} = useLocation().state
  const [email, setEmail] = useState(defaultEmail)
  const auth = useAuth()
  const {loading, setLoading} = useAsync()
  const {transitions} = useStepTranslation()
  const perspective = usePerspective()
  const {t} = useTranslation("auth")

  useEffect(() => {
    if (auth.state.authenticated) {
      history.push("/")
    }
  }, [auth, history])

  if (!auth.state.initialized) {
    return null
  }

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    if (loading) return

    try {
      setLoading(true)
      await $auth.resetPassword(email)
      toast.success(t("auth/password-successfully-reset"))
      setLoading(false)
      history.push("/login")
    } catch (err) {
      setLoading(false)
      toast.error(t(err.code))
    }
  }

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    if (loading) return
    setEmail(evt.target.value)
  }

  return (
    <div onMouseMove={perspective.handleMouseMove} className={classes.container}>
      <img className={classes.logo} src="/images/logo.svg" alt="" />
      <animated.div className={classes.content} style={perspective.style}>
        {transitions.map(({key, props: style}) => (
          <animated.form key={key} className={classes.form} onSubmit={handleSubmit} style={style}>
            <div className={classes.login}>
              <label className={classes.label}>{t("email")}</label>
              <input
                className={classes.input}
                type="email"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                value={email}
                autoFocus
              />
            </div>

            <button className={classes.buttonDanger} type="submit" disabled={!email || loading}>
              <span>{t("reset")}</span>
              <Loader className={classes.loader} />
            </button>

            <div>
              <Link className={classes.link} to="/login">
                {t("back")}
              </Link>
            </div>
          </animated.form>
        ))}
      </animated.div>
    </div>
  )
}

export default ResetPassword
