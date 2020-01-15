import React, {FC, useState} from "react"
import {useHistory} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {toast} from "react-toastify"
import PinField from "react-pin-field"

import {ReactComponent as IconDowload} from "../app/icon-save.svg"
import Button from "../app/button"
import Link from "../app/link"
import useAsync from "../async/context"
import {useAuthState} from "../auth/context"
import $screen from "./service"

import classes from "./connect.module.scss"

const ConnectScreen: FC = () => {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const {loading, setLoading} = useAsync()
  const {auth} = useAuthState()
  const history = useHistory()
  const {t} = useTranslation(["default", "screen"])

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    if (loading) return
    if (!auth) return
    setLoading(true)

    try {
      await $screen.connectScreen(await auth.getIdToken(), {code, name})
      toast.success(t("screen:successfully-paired"))
      history.push("/screens")
    } catch (err) {
      toast.error(t("screen:" + err.message))
    }

    setLoading(false)
  }

  return (
    <form className={classes.container} onSubmit={handleSubmit}>
      <h1 className={classes.title}>{t("screen:connect-title")}</h1>
      <div className={classes.content}>
        <div className={classes.contentCode}>
          <h2>{t("screen:connect-code-title")}</h2>
          <div className={classes.pinFieldContainer}>
            <PinField
              className={classes.pinField}
              validate="abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ123456789"
              format={k => k.toUpperCase()}
              onChange={setCode}
            />
          </div>
          <div className={classes.screenNameLabel}>
            <h3>{t("screen:connect-code-screen-name")}</h3>
            <div>{t("screen:connect-code-screen-name-eg")}</div>
          </div>
          <div className={classes.screenNameInput}>
            <input type="text" onChange={evt => setName(evt.target.value.trim())} />
          </div>
          <div>
            <Button
              type="submit"
              size="lg"
              prefix={IconDowload}
              disabled={!code || !name || loading}
            >
              {t("connect")}
            </Button>
          </div>
        </div>
        <div className={classes.contentHelp}>
          <h2>{t("screen:connect-help-title")}</h2>
          <p dangerouslySetInnerHTML={{__html: t("screen:connect-help-step-1")}} />
          <div className={classes.platformsTitle}>{t("screen:connect-available-on")}</div>
          <div className={classes.platforms}>
            <Link to="/">
              <img src="/images/icon-android.svg" alt="" />
            </Link>
            <Link to="/">
              <img src="/images/icon-amazon.svg" alt="" />
            </Link>
            <Link to="/">
              <img src="/images/icon-chrome.svg" alt="" />
            </Link>
            <Link to="/">
              <img src="/images/icon-amazon.svg" alt="" />
            </Link>
            <Link to="/">
              <img src="/images/icon-samsung.svg" alt="" />
            </Link>
          </div>
          <p dangerouslySetInnerHTML={{__html: t("screen:connect-help-step-2")}} />
          <img className={classes.pairingImg} src="/images/pairing.svg" alt="" />
          <p dangerouslySetInnerHTML={{__html: t("screen:connect-help-step-3")}} />
          <div>
            <Link className={classes.link} to="/">
              {t("screen:connect-help-link")}
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}

export default ConnectScreen
