import React, {FC, useRef, useState} from "react"
import {useTranslation} from "react-i18next"

import Link from "../app/link"
import {Screen, Group} from "./model"
import useScreens from "./context"
import ScreenListItem from "./list-screen-item"
import GroupListItem from "./list-group-item"
import Status from "./status"

import classes from "./list.module.scss"

const ScreenList: FC = () => {
  const {screens, groups, ...$screen} = useScreens()
  const dragPreviewRef = useRef<HTMLDivElement>(null)
  const [draggedScreen, setDraggedScreen] = useState<Screen | null>(null)
  const {t} = useTranslation(["default", "screen"])

  async function addGroup() {
    const name = window.prompt(t("screen:prompt-add-group"))
    if (name) await $screen.addGroup(name)
  }

  function handleDragStart(screen: Screen) {
    setDraggedScreen(screen)
  }

  function handleDragEnd() {
    setDraggedScreen(null)
  }

  async function handleDrop(group: Group) {
    if (draggedScreen) {
      await $screen.update({...draggedScreen, groupId: group.id})
      setDraggedScreen(null)
    }
  }

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>{t("screen:list-title")}</h1>
      <div ref={dragPreviewRef} className={classes.dragPreview}>
        <img src="/images/screen.svg" alt="" />
        <div>{draggedScreen && draggedScreen.name}</div>
      </div>
      <div className={classes.content}>
        <table cellSpacing={0} className={classes.table}>
          <thead>
            <tr>
              <th className={classes.selectHead}>{t("select")}</th>
              <th className={classes.linkHead}>{null}</th>
              <th className={classes.statusHead}>{t("connected")}</th>
              <th className={classes.nameHead}>{t("screen-name")}</th>
              <th className={classes.layoutHead}>{t("broadcasting")}</th>
              <th className={classes.settingsHead}>{t("settings")}</th>
              <th className={classes.deleteHead}>{t("delete")}</th>
            </tr>
          </thead>
          <tbody>
            {screens
              .filter(s => !groups.map(g => g.id).includes(s.groupId || ""))
              .map(screen => (
                <ScreenListItem
                  key={screen.id}
                  screen={screen}
                  preview={dragPreviewRef}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              ))}
            {groups.map(group => (
              <GroupListItem key={group.id} group={group} onDrop={handleDrop}>
                {screens
                  .filter(s => s.groupId === group.id)
                  .map(screen => (
                    <ScreenListItem
                      key={screen.id}
                      screen={screen}
                      preview={dragPreviewRef}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
              </GroupListItem>
            ))}
            {screens.length === 0 && (
              <tr className={classes.emptyRow}>
                <td className={classes.emptyCol} colSpan={7}>
                  <div>{t("screen:list-empty")}</div>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td className={classes.legend} colSpan={7}>
                <div>
                  <Status connected />
                  <span>{t("connected")}</span>
                  <Status />
                  {t("disconnected")}
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
        <aside className={classes.aside}>
          <Link className={classes.connectScreen} to="/screens/connect">
            <img src="/images/screen.svg" alt="" />
            <span dangerouslySetInnerHTML={{__html: t("screen:list-connect-title")}} />
          </Link>
          <button className={classes.createGroup} type="button" onClick={addGroup}>
            <img src="/images/icon-folder.svg" alt="" />
            <span>{t("screen:list-create-group")}</span>
          </button>
        </aside>
      </div>
    </div>
  )
}

export default ScreenList
