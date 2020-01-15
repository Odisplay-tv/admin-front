import React, {FC, useState} from "react"
import {useTranslation} from "react-i18next"
import classNames from "classnames"

import Link from "../app/link"
import Button from "../app/button"
import {ReactComponent as IconSettings} from "./icon-settings.svg"
import {ReactComponent as IconTrash} from "./icon-trash.svg"
import {ReactComponent as IconLink} from "./icon-link.svg"
import Status from "./status"
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
  const {groups, ...$screen} = useScreens()
  const [dragging, setDragging] = useState(false)
  const {t} = useTranslation(["default", "screen"])

  async function deleteScreen(evt: React.MouseEvent<HTMLButtonElement>) {
    evt.preventDefault()

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
      className={classNames(classes.row, {[classes.dragging]: dragging})}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <td className={classes.selectCol}>
        <input type="checkbox" />
      </td>
      <td className={classes.linkCol}>
        {groups.map(g => g.id).includes(screen.groupId || "") && (
          <div>
            <hr />
            <IconLink />
            <hr />
          </div>
        )}
      </td>
      <td className={classes.statusCol}>
        <div>
          <Status connected />
        </div>
      </td>
      <td className={classes.nameCol}>{screen.name}</td>
      <td className={classes.layoutCol}>
        <Button to={`/screens/${screen.id}`} size="sm">
          {t("screen:add-content")}
        </Button>
      </td>
      <td className={classes.actionsCol}>
        <div>
          <Link className={classes.icon} to={`/screens/${screen.id}`}>
            <IconSettings />
          </Link>
          <button type="button" onClick={deleteScreen}>
            <IconTrash />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ScreenListItem
