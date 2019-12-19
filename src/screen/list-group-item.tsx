import React, {FC, useState} from "react"
import {useTranslation} from "react-i18next"
import classNames from "classnames"

import {Group} from "./model"
import useScreens from "./context"

import classes from "./list-group-item.module.scss"

type GroupListItemProps = {
  group: Group
  onDrop: (group: Group) => Promise<void>
}

const GroupListItem: FC<GroupListItemProps> = props => {
  const {group} = props
  const $screen = useScreens()
  const [draggedOver, setDraggedOver] = useState(false)
  const {t} = useTranslation(["global", "screen"])

  async function deleteGroup() {
    if (window.confirm(t("screen:confirm-deletion"))) {
      await $screen.deleteGroup(group.id)
    }
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
    <tr
      key={group.id}
      className={classNames(classes.row, {[classes.draggedOver]: draggedOver})}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <td className={classes.selectCol}>
        <img src="/images/icon-arrow-down.svg" alt="" />
      </td>
      <td className={classes.statusCol}>
        <img src="/images/icon-folder.svg" alt="" />
      </td>
      <td className={classes.nameCol}>{group.name}</td>
      <td className={classes.layoutCol} />
      <td className={classes.settingsCol}>
        <button type="button">settings</button>
      </td>
      <td className={classes.deleteCol}>
        <button type="button" onClick={deleteGroup}>
          delete
        </button>
      </td>
    </tr>
  )
}

export default GroupListItem
