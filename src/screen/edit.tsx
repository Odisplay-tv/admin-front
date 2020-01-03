import React, {FC} from "react"
import {useTranslation} from "react-i18next"

import Layout from "./layout"

import classes from "./edit.module.scss"

const ScreenEdit: FC = () => {
  const {t} = useTranslation(["default", "screen"])

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>{t("screen:edit-title")}</h1>
      <Layout />
    </div>
  )
}

export default ScreenEdit
