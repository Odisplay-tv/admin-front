import React, {FC} from "react"
import classNames from "classnames"

import {ReactComponent as IconStatus} from "./icon-status.svg"

import classes from "./status.module.scss"

type ScreenStatusProps = {
  connected?: boolean
}

const ScreenStatus: FC<ScreenStatusProps> = props => {
  const {connected} = props

  return (
    <IconStatus
      className={classNames(classes.status, {
        [classes.connected]: connected,
        [classes.disconnected]: !connected,
      })}
    />
  )
}

export default ScreenStatus
