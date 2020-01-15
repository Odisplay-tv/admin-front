import React, {FC, useEffect, useState} from "react"
import {animated, useTransition} from "react-spring"
import {toast} from "react-toastify"
import qs from "query-string"

import Loader from "../async/loader"
import $screen from "./service"
import LayoutView from "./layout"
import {Layout} from "./model"

import classes from "./viewer.module.scss"

type Step = "loading" | "pairing" | "rendering"

const Viewer: FC = () => {
  const {query} = qs.parseUrl(window.location.href)
  const qsUserId = query.userId ? String(query.userId) : null
  const qsScreenId = query.screenId ? String(query.screenId) : null

  const code = localStorage.getItem("code") || null
  const userId = qsUserId || localStorage.getItem("userId") || null
  const screenId = qsScreenId || localStorage.getItem("screenId") || null

  const [step, setStep] = useState<Step>(userId && screenId ? "rendering" : "loading")
  const [layout, setLayout] = useState<Layout | null>(
    JSON.parse(localStorage.getItem("layout") || "null"),
  )

  const transitions = useTransition(step, s => s, {
    from: {opacity: 0},
    enter: {opacity: 1},
    leave: {opacity: 0},
  })

  function resetPairing() {
    localStorage.removeItem("code")
    localStorage.removeItem("userId")
    localStorage.removeItem("screenId")
    localStorage.removeItem("layout")
    setLayout(null)
    setStep("loading")
  }

  useEffect(() => {
    switch (step) {
      case "loading": {
        if (userId && screenId) {
          setStep("rendering")
        } else {
          $screen
            .generatePairingCode()
            .then(({code}) => {
              localStorage.setItem("code", code)
              setStep("pairing")
            })
            .catch(err => {
              toast.error(err.message)
            })
        }
        break
      }

      case "pairing": {
        if (userId && screenId) {
          setStep("rendering")
        } else if (code) {
          const unsubscribe = $screen.onPairingChange(code, pairing => {
            if (!pairing) return resetPairing()
            if (pairing.userId) {
              localStorage.setItem("userId", pairing.userId)
              localStorage.setItem("screenId", pairing.screenId)
              setStep("rendering")
            }
          })

          return () => unsubscribe()
        }
        break
      }

      case "rendering": {
        if (screenId && userId) {
          const unsubscribe = $screen.onConfigChange(userId, screenId, layout => {
            if (!layout) return resetPairing()
            localStorage.setItem("layout", JSON.stringify(layout))
            setLayout(layout as Layout)
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
        return layout ? <LayoutView layout={layout} readOnly /> : null

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
