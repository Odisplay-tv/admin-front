import React, {FC, useState} from "react"
import {useTranslation} from "react-i18next"
import {toast} from "react-toastify"

import useApi from "../shared/api"
import useAsync from "../async/context"
import {useAuthState} from "../auth/context"

import classes from "./connect.module.scss"

const ConnectScreen: FC = () => {
  const $api = useApi()
  const [code, setCode] = useState("")
  const {loading} = useAsync()
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
    try {
      const screens = await $api.findScreensByCode(code)
      if (screens.length === 0) throw new Error("pairing-failed")
      await $api.pairScreen(screens[0].id, user.uid)
    } catch (err) {
      toast.error(t(err.message))
    }
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
