import React, {FC} from "react"
import {useTranslation} from "react-i18next"

import useScreens from "./context"

import classes from "./list.module.scss"

const ScreenList: FC = () => {
  const {screens, ...$screen} = useScreens()
  const {t} = useTranslation(["global", "screen"])

  const handleDelete = (screenId: string) => async () => {
    if (window.confirm(t("screen:confirm-deletion"))) {
      await $screen.delete(screenId)
    }
  }

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>{t("screen-list:title")}</h1>
      <div className={classes.content}>
        <table cellSpacing={0} className={classes.table}>
          <thead>
            <tr>
              <th className={classes.selectHead}>{t("select")}</th>
              <th className={classes.statusHead}>{t("connected")}</th>
              <th className={classes.nameHead}>{t("screen-name")}</th>
              <th className={classes.layoutHead}>{t("broadcasting")}</th>
              <th className={classes.settingsHead}>{t("settings")}</th>
              <th className={classes.deleteHead}>{t("delete")}</th>
            </tr>
          </thead>
          <tbody>
            {screens.map(s => (
              <tr key={s.id} className={classes.row}>
                <td className={classes.selectRow}>
                  <input type="checkbox" />
                </td>
                <td className={classes.statusRow}>
                  <svg
                    className={classes.connected}
                    viewBox="0 0 2 2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                </td>
                <td className={classes.nameRow}>{s.name}</td>
                <td className={classes.layoutRow}>{null}</td>
                <td className={classes.settingsRow}>
                  <button type="button">settings</button>
                </td>
                <td className={classes.deleteRow}>
                  <button type="button" onClick={handleDelete(s.id)}>
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ScreenList
