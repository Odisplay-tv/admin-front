import React, {FC, useEffect, useState} from "react"
import {useRouteMatch} from "react-router-dom"
import {useTranslation} from "react-i18next"
import find from "lodash/fp/find"
import getOr from "lodash/fp/getOr"

import {ReactComponent as IconPreview} from "../app/icon-preview.svg"
import {ReactComponent as IconSave} from "../app/icon-save.svg"
import {ReactComponent as IconTrash} from "../app/icon-trash.svg"
import Button from "../app/button"
import {emptyLeaf} from "./model"
import LayoutView from "./layout"
import useScreens from "./context"

import classes from "./edit.module.scss"

const ScreenEdit: FC = () => {
  const {id} = useRouteMatch<{id: string}>().params
  const {screens, ...$screen} = useScreens()
  const screen = find({id}, screens)
  const defaultLayout = getOr(undefined, "layout", screen)
  const [layout, setLayout] = useState(defaultLayout)
  const {t} = useTranslation(["default", "screen"])

  function save(evt: React.FormEvent) {
    evt.preventDefault()

    if (screen && layout) {
      $screen.update({...screen, layout})
    }
  }

  useEffect(() => {
    if (defaultLayout) {
      setLayout(defaultLayout)
    }
  }, [defaultLayout])

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>{t("screen:edit-title")}</h1>
      <div className={classes.layout}>
        <LayoutView layout={layout} onChange={setLayout} />
      </div>
      <form className={classes.config} onSubmit={save}>
        <div className={classes.left}>
          <div>
            {t("screen:name")} <input type="text" className={classes.nameInput} />
          </div>
          <div>
            {t("screen:status")} <input type="text" className={classes.statusInput} />
          </div>
          <div>
            {t("screen:orientation")} <input type="text" className={classes.orientationInput} />
          </div>
          <div>
            {t("screen:layout")} <input type="text" className={classes.layoutInput} />
          </div>
        </div>
        <div className={classes.right}>
          <div className={classes.actions}>
            <Button className={classes.button} prefix={IconPreview} color="gray">
              {t("preview")}
            </Button>
            <Button
              className={classes.button}
              prefix={IconSave}
              color="red"
              onClick={() => setLayout(emptyLeaf())}
            >
              {t("reset")}
            </Button>
            <Button type="submit" className={classes.button} prefix={IconSave} color="green">
              {t("save")}
            </Button>
          </div>
          <div className={classes.desc}>{t("screen:platform-type")} Android</div>
          <div className={classes.desc}>{t("screen:connected-at")} 16 octobre 2019</div>
          <Button className={classes.delete} prefix={IconTrash} color="transparent">
            {t("screen:delete")}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ScreenEdit
