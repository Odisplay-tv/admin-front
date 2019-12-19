import React, {FC} from "react"
import {useTranslation} from "react-i18next"

import Link from "../app/link"
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
      <h1 className={classes.title}>{t("screen:list-title")}</h1>
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
            {screens.length === 0 && (
              <tr className={classes.emptyRow}>
                <td className={classes.emptyCol} colSpan={6}>
                  <div>{t("screen:list-empty")}</div>
                </td>
              </tr>
            )}
            {screens.map(s => (
              <tr key={s.id} className={classes.row}>
                <td className={classes.selectCol}>
                  <input type="checkbox" />
                </td>
                <td className={classes.statusCol}>
                  <svg
                    className={classes.connected}
                    viewBox="0 0 2 2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                </td>
                <td className={classes.nameCol}>{s.name}</td>
                <td className={classes.layoutCol}>{null}</td>
                <td className={classes.settingsCol}>
                  <button type="button">settings</button>
                </td>
                <td className={classes.deleteCol}>
                  <button type="button" onClick={handleDelete(s.id)}>
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <aside className={classes.aside}>
          <Link className={classes.connectScreen} to="/screens/connect">
            <img src="/images/screen.svg" alt="" />
            <span dangerouslySetInnerHTML={{__html: t("screen:list-connect-title")}} />
          </Link>
          <button className={classes.createGroup} type="button">
            <img src="/images/icon-folder.svg" alt="" />
            <span>{t("screen:list-create-group")}</span>
          </button>
        </aside>
      </div>
    </div>
  )
}

export default ScreenList
