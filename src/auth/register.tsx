import React, {FC, Dispatch, SetStateAction, useEffect, useState} from "react"
import {RouteComponentProps} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {animated} from "react-spring"
import {toast} from "react-toastify"

import {ReactComponent as IconArrowRight} from "../app/icon-arrow-right.svg"
import useAsync from "../async/context"
import Button from "../app/button"
import Link from "../app/link"
import useAuth from "./context"
import $auth from "./service"
import {useStepTranslation, usePerspective} from "./animations"

import classes from "./auth.module.scss"

const Register: FC<RouteComponentProps> = props => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const auth = useAuth()
  const {loading, setLoading} = useAsync()
  const {transitions} = useStepTranslation()
  const perspective = usePerspective()
  const {t} = useTranslation()

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
      toast.success(t("auth/successfully-registered"))
    } catch (err) {
      setLoading(false)
      toast.error(t("auth:" + err.code || err.message))
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
        {transitions.map(({key, props: style}) => (
          <animated.form key={key} className={classes.form} onSubmit={handleSubmit} style={style}>
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

            <Button
              type="submit"
              sufix={IconArrowRight}
              size="lg"
              disabled={!email || !password || loading}
            >
              {t("continue")}
            </Button>

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

export default Register
