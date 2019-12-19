import React, {FC} from "react"
import {animated, useTransition} from "react-spring"

import classes from "./fade.module.scss"

type FadeProps = {
  watch?: boolean
  onTrue: JSX.Element
  onFalse: JSX.Element
}

const Fade: FC<FadeProps> = ({watch: value, onTrue: elemA, onFalse: elemB}) => {
  const transitions = useTransition(value, null, {
    from: {opacity: 0},
    enter: {opacity: 1},
    leave: {opacity: 0},
  })

  const view = transitions.map(({key, item: value, props: style}) => (
    <animated.div key={key} className={classes.fade} style={style}>
      {value ? elemA : elemB}
    </animated.div>
  ))

  return <div className={classes.container}>{view}</div>
}

export default Fade
