import React, {FC, useState} from "react"
import {useTranslation} from "react-i18next"
import uuid from "uuid/v4"

import Layout, {emptyLayout} from "./layout"

import classes from "./edit.module.scss"

const ScreenEdit: FC = () => {
  const [layout, setLayout] = useState(emptyLayout())
  const {t} = useTranslation(["default", "screen"])

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>{t("screen:edit-title")}</h1>
      <div className={classes.resetContainer}>
        <button
          type="button"
          className={classes.reset}
          onClick={() => setLayout({id: uuid(), type: "leaf"})}
        >
          RESET
        </button>
      </div>
      <div className={classes.content}>
        <Layout layout={layout} onChange={setLayout} />
      </div>
    </div>
  )
}

export default ScreenEdit
