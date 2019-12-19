import React, {FC, useState} from "react"
import {useTranslation} from "react-i18next"
import classNames from "classnames"

import {Screen} from "./model"
import useScreens from "./context"

import classes from "./list-screen-item.module.scss"

type ScreenListItemProps = {
  screen: Screen
  preview: React.RefObject<HTMLDivElement>
  onDragStart: (screen: Screen) => void
  onDragEnd: () => void
}

const ScreenListItem: FC<ScreenListItemProps> = props => {
  const {screen, preview} = props
  const $screen = useScreens()
  const [dragging, setDragging] = useState(false)
  const {t} = useTranslation(["global", "screen"])

  async function deleteScreen() {
    if (window.confirm(t("screen:confirm-deletion"))) {
      await $screen.delete(screen.id)
    }
  }

  function handleDragStart(evt: React.DragEvent<HTMLTableRowElement>) {
    if (preview.current) {
      setDragging(true)
      evt.dataTransfer.setDragImage(preview.current, 13, 10)
      props.onDragStart(screen)
    }
  }

  function handleDragEnd() {
    setDragging(false)
    props.onDragEnd()
  }

  return (
    <tr
      key={screen.id}
      className={classNames(classes.row, {[classes.dragging]: dragging})}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <td className={classes.selectCol}>
        <input type="checkbox" />
      </td>
      <td className={classes.statusCol}>
        <svg className={classes.connected} viewBox="0 0 2 2" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1" cy="1" r="1" />
        </svg>
      </td>
      <td className={classes.nameCol}>{screen.name}</td>
      <td className={classes.layoutCol}>{null}</td>
      <td className={classes.settingsCol}>
        <button type="button">settings</button>
      </td>
      <td className={classes.deleteCol}>
        <button type="button" onClick={deleteScreen}>
          delete
        </button>
      </td>
    </tr>
  )
}

export default ScreenListItem
