import React, {FC, useCallback, useEffect, useRef, useState} from "react"
import uuid from "uuid/v4"

import classes from "./layout.module.scss"

type Layout = LeafLayout | VNodeLayout | HNodeLayout

type LeafLayout = {
  id: string
  type: "leaf"
}

type VNodeLayout = {
  id: string
  type: "v-node"
  val: number
  left: Layout
  right: Layout
}

type HNodeLayout = {
  id: string
  type: "h-node"
  val: number
  top: Layout
  bottom: Layout
}

type Position = "top" | "right" | "bottom" | "left"

type Msg =
  | {
      type: "grab-right-handle"
      layoutId: string
    }
  | {
      type: "grab-left-handle"
      layoutId: string
    }
  | {
      type: "resize-start"
      layoutId: string
    }
  | {
      type: "resize"
      val: number
    }
  | {
      type: "resize-stop"
    }
  | {
      type: "update-layout"
      layout: Layout
    }

const NoSplitView: FC<ViewProps> = props => {
  const {parentRef, layout, sendMsg, resizedLayoutId} = props
  const rightHandleRef = useRef<HTMLButtonElement>(null)
  const leftHandleRef = useRef<HTMLButtonElement>(null)

  const resize = useCallback(
    (evt: MouseEvent) => {
      if (resizedLayoutId && parentRef.current) {
        const {x: parentLeft, width: parentWidth} = parentRef.current.getBoundingClientRect()
        const delta = ((evt.clientX - parentLeft) * 100) / parentWidth
        sendMsg({type: "resize", val: Math.max(0, Math.min(100, delta))})
      }
    },
    [parentRef, resizedLayoutId, sendMsg],
  )

  function rightHandleGrabbed() {
    if (rightHandleRef.current) {
      sendMsg({type: "grab-right-handle", layoutId: layout.id})
    }
  }

  function leftHandleGrabbed() {
    if (rightHandleRef.current) {
      sendMsg({type: "grab-left-handle", layoutId: layout.id})
    }
  }

  useEffect(() => {
    const stopResizing = () => sendMsg({type: "resize-stop"})

    document.addEventListener("mouseup", stopResizing)
    document.addEventListener("mousemove", resize)

    return () => {
      document.removeEventListener("mouseup", stopResizing)
      document.removeEventListener("mousemove", resize)
    }
  }, [layout.id, resize, resizedLayoutId, sendMsg])

  return (
    <div className={classes.view}>
      <div>YOLO</div>
      <button type="button" className={classes.handleTop} />
      <button
        ref={rightHandleRef}
        type="button"
        onMouseDown={rightHandleGrabbed}
        className={classes.handleRight}
      />
      <button type="button" className={classes.handleBottom} />
      <button
        type="button"
        ref={leftHandleRef}
        className={classes.handleLeft}
        onMouseDown={leftHandleGrabbed}
      />
    </div>
  )
}

const VSplitView: FC<ViewProps<VNodeLayout>> = props => {
  const {sendMsg: propageMsg, layout, resizedLayoutId} = props
  const [val, setVal] = useState(0)

  const handleMsg = useCallback(
    (msg: Msg) => {
      console.log("node", msg)
      switch (msg.type) {
        case "grab-right-handle":
          if (layout.left.id === msg.layoutId) {
            propageMsg({type: "resize-start", layoutId: layout.id})
          } else {
            propageMsg({...msg, layoutId: layout.id})
          }
          break

        case "grab-left-handle":
          if (layout.right.id === msg.layoutId) {
            propageMsg({type: "resize-start", layoutId: layout.id})
          } else {
            propageMsg({...msg, layoutId: layout.id})
          }
          break

        case "resize-start":
          propageMsg(msg)
          break

        case "resize":
          if (resizedLayoutId === layout.id) {
            setVal(msg.val)
          }
          break

        case "resize-stop":
          if (resizedLayoutId === layout.id) {
            propageMsg({type: "update-layout", layout: {...layout, val}})
          }
          break

        case "update-layout":
          propageMsg({
            type: "update-layout",
            layout: {
              ...layout,
              [layout.right.id === msg.layout.id ? "right" : "left"]: msg.layout,
            },
          })
          break

        default:
          break
      }
    },
    [layout, propageMsg, resizedLayoutId, val],
  )

  useEffect(() => {
    setVal(layout.val)
  }, [layout])

  return (
    <>
      <div className={classes.leftView} style={{right: `${100 - val}%`}}>
        <View {...props} layout={layout.left} sendMsg={handleMsg} />
      </div>
      <div className={classes.rightView} style={{left: `${val}%`}}>
        <View {...props} layout={layout.right} sendMsg={handleMsg} />
      </div>
    </>
  )
}

const HSplitView: FC<ViewProps<HNodeLayout>> = props => {
  const {layout} = props
  const [val, setVal] = useState(layout.val)

  return (
    <>
      <div className={classes.topView} style={{bottom: `${100 - val}%`}}>
        <View {...props} layout={layout.top} />
      </div>
      <div className={classes.bottomView} style={{top: `${val}%`}}>
        <View {...props} layout={layout.bottom} />
      </div>
    </>
  )
}

type ViewProps<L = Layout> = {
  parentRef: React.RefObject<HTMLDivElement>
  layout: L
  resizedLayoutId: string | null
  sendMsg: (msg: Msg) => void
}

const View: FC<ViewProps> = props => {
  const {layout} = props
  const ref = useRef<HTMLDivElement>(null)

  const view = (() => {
    switch (layout.type) {
      case "leaf": {
        return <NoSplitView {...props} />
      }

      case "v-node": {
        return <VSplitView {...props} parentRef={ref} layout={layout} />
      }

      case "h-node": {
        return <HSplitView {...props} parentRef={ref} layout={layout} />
      }

      default:
        return null
    }
  })()

  return (
    <div ref={ref} className={classes.viewContainer}>
      {view}
    </div>
  )
}

const ScreenLayout: FC = () => {
  const frameRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<Layout>({id: uuid(), type: "leaf"})
  const [resizedLayoutId, setResizedLayoutId] = useState<string | null>(null)

  function sendMsg(msg: Msg) {
    console.log("root", msg)
    switch (msg.type) {
      case "grab-right-handle": {
        const id = uuid()
        setResizedLayoutId(id)
        setLayout({
          id,
          type: "v-node",
          val: 100,
          left: {...layout},
          right: {id: uuid(), type: "leaf"},
        })
        break
      }

      case "grab-left-handle": {
        const id = uuid()
        setResizedLayoutId(id)
        setLayout({
          id,
          type: "v-node",
          val: 0,
          left: {id: uuid(), type: "leaf"},
          right: {...layout},
        })
        break
      }

      case "resize-start":
        setResizedLayoutId(msg.layoutId)
        break

      case "update-layout": {
        setLayout({...layout, ...msg.layout})
        setResizedLayoutId(null)
        break
      }

      default:
        break
    }
  }

  console.log(layout)
  return (
    <div className={classes.container}>
      <div ref={frameRef} className={classes.content}>
        <View
          parentRef={frameRef}
          resizedLayoutId={resizedLayoutId}
          layout={layout}
          sendMsg={sendMsg}
        />
      </div>
    </div>
  )
}

export default ScreenLayout
