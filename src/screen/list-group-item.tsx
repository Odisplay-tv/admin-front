import React, {FC, useState} from "react"
import {useTranslation} from "react-i18next"
import classNames from "classnames"

import {ReactComponent as IconSettings} from "./icon-settings.svg"
import {ReactComponent as IconTrash} from "./icon-trash.svg"
import {Group} from "./model"
import useScreens from "./context"

import classes from "./list-group-item.module.scss"

type GroupListItemProps = {
  group: Group
  onDrop: (group: Group) => Promise<void>
}

const GroupListItem: FC<GroupListItemProps> = props => {
  const {group, children} = props
  const {screens, ...$screen} = useScreens()
  const [draggedOver, setDraggedOver] = useState(false)
  const [open, setOpen] = useState(true)
  const {t} = useTranslation(["default", "screen"])

  async function deleteGroup(evt: React.MouseEvent<HTMLButtonElement>) {
    evt.stopPropagation()

    if (window.confirm(t("screen:confirm-deletion"))) {
      await $screen.deleteGroup(group.id)
    }
  }

  function handleClick() {
    setOpen(!open)
  }

  function handleDragOver(evt: React.DragEvent<HTMLTableRowElement>) {
    evt.preventDefault()
    setDraggedOver(true)
  }

  function handleDragLeave() {
    setDraggedOver(false)
  }

  async function handleDrop() {
    setDraggedOver(false)
    await props.onDrop(group)
  }

  return (
    <>
      <tr
        key={group.id}
        className={classNames(classes.row, {[classes.draggedOver]: draggedOver})}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <td className={classes.selectCol}>
          <img
            className={classNames({[classes.open]: open})}
            src="/images/icon-arrow-down.svg"
            alt=""
          />
        </td>
        <td className={classes.linkCol}>
          ({t("screen:n-screens", {n: screens.filter(s => s.groupId === group.id).length})})
        </td>
        <td className={classes.statusCol}>
          <img src="/images/icon-folder.svg" alt="" />
        </td>
        <td className={classes.nameCol}>{group.name}</td>
        <td className={classes.layoutCol} />
        <td className={classes.actionsCol}>
          <div>
            <button type="button">
              <IconSettings className={classes.icon} />
            </button>
            <button type="button" onClick={deleteGroup}>
              <IconTrash className={classes.icon} />
            </button>
          </div>
        </td>
      </tr>
      {open && children}
    </>
  )
}

export default GroupListItem
