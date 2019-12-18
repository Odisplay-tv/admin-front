import React, {FC, useState} from "react"
import {useHistory} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {toast} from "react-toastify"
import PinField from "react-pin-field"

import Link from "../app/link"
import useAsync from "../async/context"
import Loader from "../async/loader"
import {useAuthState} from "../auth/context"
import $screen from "./service"

import classes from "./connect.module.scss"

const ConnectScreen: FC = () => {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const {loading, setLoading} = useAsync()
  const {user} = useAuthState()
  const history = useHistory()
  const {t} = useTranslation(["connect-screen", "global"])

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    if (loading) return
    if (!user) return
    setLoading(true)

    try {
      await $screen.connectScreen(await user.getIdToken(), {code, name})
      toast.success(t("successfully-paired"))
      history.push("/screens")
    } catch (err) {
      toast.error(t(err.message))
    }

    setLoading(false)
  }

  return (
    <form className={classes.container} onSubmit={handleSubmit}>
      <h1 className={classes.title}>{t("title")}</h1>
      <div className={classes.content}>
        <div className={classes.help}>
          <h2>{t("help-title")}</h2>
          <p dangerouslySetInnerHTML={{__html: t("help-step-1")}} />
          <div>{t("available-on")}</div>
          <div className={classes.platforms}>
            <Link to="/">
              <img src="/images/icon-android.svg" alt="" />
            </Link>
            <Link to="/">
              <img src="/images/icon-samsung.svg" alt="" />
            </Link>
            <Link to="/">
              <img src="/images/icon-amazon.svg" alt="" />
            </Link>
            <Link to="/">
              <img src="/images/icon-amazon.svg" alt="" />
            </Link>
            <Link to="/">
              <img src="/images/icon-chrome.svg" alt="" />
            </Link>
          </div>
          <p dangerouslySetInnerHTML={{__html: t("help-step-2")}} />
          <img className={classes.pairingImg} src="/images/pairing.svg" alt="" />
          <p dangerouslySetInnerHTML={{__html: t("help-step-3")}} />
          <div>
            <Link className={classes.link} to="/">
              {t("help-link")}
            </Link>
          </div>
        </div>
        <div className={classes.code}>
          <h2>{t("code-title")}</h2>
          <div className={classes.pinFieldContainer}>
            <PinField
              className={classes.pinField}
              validate="abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ123456789"
              format={k => k.toUpperCase()}
              onChange={setCode}
            />
          </div>
          <div className={classes.screenNameLabel}>
            <h3>{t("code-screen-name")}</h3>
            <div>{t("code-screen-name-eg")}</div>
          </div>
          <div className={classes.screenNameInput}>
            <input type="text" onChange={evt => setName(evt.target.value.trim())} />
          </div>
          <div>
            <button className={classes.submit} type="submit" disabled={!code || !name || loading}>
              {loading ? <Loader /> : <img src="" alt="" />}
              {t("global:connect")}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default ConnectScreen
