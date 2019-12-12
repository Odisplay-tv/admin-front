import React, {FC, useEffect, useState} from "react"
import {animated, useTransition} from "react-spring"
import {toast} from "react-toastify"

import Loader from "../async/loader"
import $screen from "./service"

import classes from "./viewer.module.scss"

type Step = "loading" | "pairing" | "rendering"

const Viewer: FC = () => {
  const code = localStorage.getItem("code") || null
  const userId = localStorage.getItem("userId") || null
  const screenId = localStorage.getItem("screenId") || null
  const layout = JSON.parse(localStorage.getItem("layout") || "{}")
  const [step, setStep] = useState<Step>("loading")
  const transitions = useTransition(step, s => s, {
    from: {opacity: 0},
    enter: {opacity: 1},
    leave: {opacity: 0},
  })

  useEffect(() => {
    switch (step) {
      case "loading": {
        $screen
          .generatePairingCode()
          .then(({screenId, code}) => {
            localStorage.setItem("code", code)
            localStorage.setItem("screenId", screenId)
            setStep("pairing")
          })
          .catch(err => {
            toast.error(err.message)
          })
        break
      }

      case "pairing": {
        if (screenId && userId) {
          setStep("rendering")
        } else if (code) {
          const unsubscribe = $screen.onPairingChange(code, screen => {
            if (screen.userId) {
              localStorage.setItem("userId", screen.userId)
              setStep("rendering")
            }
          })

          return () => unsubscribe()
        }
        break
      }

      case "rendering": {
        if (screenId && userId) {
          const unsubscribe = $screen.onConfigChange(screenId, userId, layout => {
            localStorage.setItem("layout", JSON.stringify(layout))
          })
          return () => unsubscribe()
        }
        break
      }

      default:
        break
    }
  }, [code, screenId, step, userId])

  function render(step: Step) {
    switch (step) {
      case "loading":
        return <Loader visible className={classes.loader} />

      case "pairing":
        return code

      case "rendering":
        return "rendering!" + JSON.stringify(layout)

      default:
        return null
    }
  }

  return (
    <div className={classes.container}>
      {transitions.map(({key, item: step, props: style}) => (
        <animated.div key={key} style={style}>
          {render(step)}
        </animated.div>
      ))}
    </div>
  )
}

export default Viewer
