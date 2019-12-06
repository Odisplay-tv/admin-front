import React, {FC} from "react"
import {useTranslation} from "react-i18next"

import Link from "../shared/link"

import classes from "./connect.module.scss"

const ConnectScreen: FC = () => {
  const {t} = useTranslation()

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>{t("connect-a-screen")}</h1>
      <div className={classes.content}>
        <div>left</div>
        <div>right</div>
      </div>
    </div>
  )
}

export default ConnectScreen
