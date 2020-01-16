import React, {FC, useEffect, useRef, useState} from "react"
import {animated, useTransition} from "react-spring"
import {toast} from "react-toastify"
import qs from "query-string"

import Loader from "../async/loader"
import $screen from "./service"
import LayoutView from "./layout"
import {Layout, Orientation, emptyLeaf} from "./model"

import classes from "./viewer.module.scss"

type Step = "loading" | "pairing" | "rendering"

const Viewer: FC = () => {
  const {query} = qs.parseUrl(window.location.href)
  const qsUserId = query.userId ? String(query.userId) : null
  const qsScreenId = query.screenId ? String(query.screenId) : null

  const code = localStorage.getItem("code") || null
  const userId = qsUserId || localStorage.getItem("userId") || null
  const screenId = qsScreenId || localStorage.getItem("screenId") || null

  const containerRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState<Step>(userId && screenId ? "rendering" : "loading")
  const [orientation, setOrientation] = useState<Orientation>("H")
  const [layout, setLayout] = useState<Layout | null>(
    JSON.parse(localStorage.getItem("layout") || "null"),
  )

  const transitions = useTransition(step, s => s, {
    from: {width: "100%", textAlign: "center", opacity: 0},
    enter: {width: "100%", textAlign: "center", opacity: 1},
    leave: {width: "100%", textAlign: "center", opacity: 0},
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
          const unsubscribe = $screen.onScreenChange(userId, screenId, screen => {
            if (!screen) return resetPairing()
            const layout: Layout = screen.layout || emptyLeaf()
            const orientation: Orientation = screen.orientation || "H"
            localStorage.setItem("layout", JSON.stringify(layout))
            localStorage.setItem("orientation", orientation)
            setLayout(layout)
            setOrientation(orientation)
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

      case "rendering": {
        if (!layout) return null
        if (orientation === "H") return <LayoutView layout={layout} readOnly />

        const {width: height, height: width} = containerRef.current
          ? containerRef.current.getBoundingClientRect()
          : {width: 0, height: 0}

        return (
          <div className={classes.verticalOrientation} style={{width, height}}>
            <LayoutView layout={layout} readOnly />
          </div>
        )
      }

      default:
        return null
    }
  }

  return (
    <div ref={containerRef} className={classes.container}>
      {transitions.map(({key, item: step, props: style}) => (
        <animated.div key={key} style={style}>
          {render(step)}
        </animated.div>
      ))}
    </div>
  )
}

export default Viewer
