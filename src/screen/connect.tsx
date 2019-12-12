import React, {FC, useState} from "react"
import {useTranslation} from "react-i18next"
import {toast} from "react-toastify"

import useAsync from "../async/context"
import {useAuthState} from "../auth/context"
import $screen from "./service"

import classes from "./connect.module.scss"

const ConnectScreen: FC = () => {
  const [code, setCode] = useState("")
  const {loading, setLoading} = useAsync()
  const {user} = useAuthState()
  const {t} = useTranslation()

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    if (loading) return
    setCode(evt.target.value.trim())
  }

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    if (loading) return
    if (!user) return
    setLoading(true)

    try {
      await $screen.connectScreen(await user.getIdToken(), code)
    } catch (err) {
      toast.error(t(err.message))
    }

    setLoading(false)
  }

  return (
    <form className={classes.container} onSubmit={handleSubmit}>
      <h1 className={classes.title}>{t("connect-a-screen")}</h1>
      <input type="text" onChange={handleChange} value={code} />
      <button type="submit">pair</button>
      <div className={classes.content}>
        <div>left</div>
        <div>right</div>
      </div>
    </form>
  )
}

export default ConnectScreen
