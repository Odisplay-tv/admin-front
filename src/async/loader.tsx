import React, {FC} from "react"
import {animated, useSpring, config} from "react-spring"
import classNames from "classnames"

import {useAsyncState} from "./context"
import classes from "./loader.module.scss"

type LoaderProps = {
  className?: string
}

const Loader: FC<LoaderProps> = ({className}) => {
  const loading = useAsyncState()
  const style = useSpring({opacity: loading ? 1 : 0, config: config.gentle})

  return (
    <animated.img
      className={classNames(classes.loader, className)}
      src="/images/loader.svg"
      alt="Loading..."
      style={style}
    />
  )
}

export default Loader
