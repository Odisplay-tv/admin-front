import React, {FC, useState} from "react"
import {useTranslation} from "react-i18next"
import classNames from "classnames"

import {ReactComponent as IconSettings} from "./icon-settings.svg"
import {ReactComponent as IconTrash} from "./icon-trash.svg"
import {ReactComponent as IconArrowDown} from "./icon-arrow-down.svg"
import {ReactComponent as IconFolder} from "./icon-folder.svg"
import {Group} from "./model"
import useScreens from "./context"

import classes from "./list-group-item.module.scss"

type GroupListItemProps = {
  group: Group | null
  onDrop: (group: Group | null) => Promise<void>
}

const GroupListItem: FC<GroupListItemProps> = props => {
  const {group, children} = props
  const {screens, ...$screen} = useScreens()
  const [draggedOver, setDraggedOver] = useState(false)
  const [open, setOpen] = useState(true)
  const {t} = useTranslation(["default", "screen"])

  async function deleteGroup(evt: React.MouseEvent<HTMLButtonElement>) {
    evt.stopPropagation()

    if (group && window.confirm(t("screen:confirm-deletion"))) {
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

  const filteredScreens = screens.filter(s => (group ? s.groupId === group.id : s.groupId === null))

  return (
    <>
      <tr
        key={(group && group.id) || "default"}
        className={classNames(classes.row, {
          [classes.defaultRow]: !group,
          [classes.draggedOver]: draggedOver,
        })}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <td className={classes.selectCol}>
          <IconArrowDown className={classNames({[classes.open]: open})} />
        </td>
        <td className={classes.linkCol}>
          ({t("screen:n-screens", {n: filteredScreens.length}).toLowerCase()})
        </td>
        <td className={classes.statusCol}>{group && <IconFolder />}</td>
        <td className={classes.nameCol}>{group && group.name}</td>
        <td className={classes.layoutCol} />
        <td className={classes.actionsCol}>
          {group && (
            <div>
              <button type="button">
                <IconSettings className={classes.icon} />
              </button>
              <button type="button" onClick={deleteGroup}>
                <IconTrash className={classes.icon} />
              </button>
            </div>
          )}
        </td>
      </tr>
      {open && children}
    </>
  )
}

export default GroupListItem
