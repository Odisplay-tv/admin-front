import React, {FC, useCallback, useEffect, useState} from "react"
import {animated, useTransition} from "react-spring"
import {toast} from "react-toastify"

import Loader from "../async/loader"
import $api from "../shared/api"
import useAsync from "../async/context"

import classes from "./pairing.module.scss"

const ScreenPairing: FC = () => {
  const {loading, setLoading} = useAsync()
  const [code, setCode] = useState(null)
  const [ready, setReady] = useState(false)
  const transitions = useTransition(loading, null, {
    from: {opacity: 0},
    enter: {opacity: 1},
    leave: {opacity: 0},
  })

  const generatePairingCode = useCallback(async () => {
    setLoading(true)

    try {
      await $api.generatePairingCode().then(setCode)
    } catch (err) {
      toast.error(err.message)
    }

    setLoading(false)
  }, [setLoading])

  useEffect(() => {
    if (!ready) {
      setReady(true)
      generatePairingCode()
    }
  }, [generatePairingCode, ready])

  return (
    <div className={classes.container}>
      {transitions.map(({key, item, props: style}) => (
        <animated.div key={key} style={style}>
          {item ? <Loader className={classes.loader} /> : code}
        </animated.div>
      ))}
    </div>
  )
}

export default ScreenPairing
