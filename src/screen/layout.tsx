import React, {FC, useCallback, useEffect, useRef, useState} from "react"
import classNames from "classnames"
import uuid from "uuid/v4"

import {ReactComponent as IconTrash} from "./icon-trash.svg"

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

type Msg =
  | {
      type: "grab-top-handle"
      layoutId: string
    }
  | {
      type: "grab-right-handle"
      layoutId: string
    }
  | {
      type: "grab-bottom-handle"
      layoutId: string
    }
  | {
      type: "grab-left-handle"
      layoutId: string
    }
  | {
      type: "split"
      layoutId: string
      layout: Layout
    }
  | {
      type: "resize-start"
      layoutId: string
    }
  | {
      type: "resize"
      x: number
      y: number
    }
  | {
      type: "resize-stop"
    }
  | {
      type: "update-layout"
      layout: Layout
    }
  | {
      type: "delete-view"
      layoutId: string
    }
  | {
      type: "delete-layout"
      prevLayoutId: string
      layout: Layout
    }

const NoSplitView: FC<ViewProps> = props => {
  const {parentRef, layout, sendMsg, resizedLayoutId} = props

  const resize = useCallback(
    (evt: MouseEvent) => {
      if (resizedLayoutId && parentRef.current) {
        const bounds = parentRef.current.getBoundingClientRect()
        const {x: parentLeft, y: parentTop, width: parentWidth, height: parentHeight} = bounds
        const deltaX = ((evt.clientX - parentLeft) * 100) / parentWidth
        const deltaY = ((evt.clientY - parentTop) * 100) / parentHeight
        sendMsg({
          type: "resize",
          x: Math.max(0, Math.min(100, deltaX)),
          y: Math.max(0, Math.min(100, deltaY)),
        })
      }
    },
    [parentRef, resizedLayoutId, sendMsg],
  )

  useEffect(() => {
    const stopResizing = () => sendMsg({type: "resize-stop"})

    document.addEventListener("mouseup", stopResizing)
    document.addEventListener("mousemove", resize)

    return () => {
      document.removeEventListener("mouseup", stopResizing)
      document.removeEventListener("mousemove", resize)
    }
  }, [layout.id, resize, resizedLayoutId, sendMsg])

  const topHandleGrabbed = () => sendMsg({type: "grab-top-handle", layoutId: layout.id})
  const rightHandleGrabbed = () => sendMsg({type: "grab-right-handle", layoutId: layout.id})
  const bottomHandleGrabbed = () => sendMsg({type: "grab-bottom-handle", layoutId: layout.id})
  const leftHandleGrabbed = () => sendMsg({type: "grab-left-handle", layoutId: layout.id})
  const deleteView = () => sendMsg({type: "delete-view", layoutId: layout.id})

  return (
    <div className={classes.view}>
      <div>{layout.id}</div>
      <button type="button" className={classes.handleTop} onMouseDown={topHandleGrabbed} />
      <button type="button" className={classes.handleRight} onMouseDown={rightHandleGrabbed} />
      <button type="button" className={classes.handleBottom} onMouseDown={bottomHandleGrabbed} />
      <button type="button" className={classes.handleLeft} onMouseDown={leftHandleGrabbed} />
      <button type="button" className={classes.deleteView} onMouseDown={deleteView}>
        <IconTrash />
      </button>
    </div>
  )
}

const VSplitView: FC<ViewProps<VNodeLayout>> = props => {
  const {sendMsg: propageMsg, layout, resizedLayoutId} = props
  const [val, setVal] = useState(0)

  const handleMsg = useCallback(
    (msg: Msg) => {
      console.log("v-node", msg)
      switch (msg.type) {
        case "grab-top-handle": {
          const id = uuid()
          const pos = layout.right.id === msg.layoutId ? "right" : "left"
          propageMsg({
            type: "split",
            layoutId: id,
            layout: {
              ...layout,
              [pos]: {
                id,
                type: "h-node",
                val: 0,
                top: {id: uuid(), type: "leaf"},
                bottom: layout[pos],
              },
            },
          })
          break
        }

        case "grab-right-handle":
          if (layout.left.id === msg.layoutId) {
            propageMsg({type: "resize-start", layoutId: layout.id})
          } else {
            propageMsg({...msg, layoutId: layout.id})
          }
          break

        case "grab-bottom-handle": {
          const id = uuid()
          const pos = layout.left.id === msg.layoutId ? "left" : "right"
          propageMsg({
            type: "split",
            layoutId: id,
            layout: {
              ...layout,
              [pos]: {
                id,
                type: "h-node",
                val: 100,
                top: layout[pos],
                bottom: {id: uuid(), type: "leaf"},
              },
            },
          })
          break
        }

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
            setVal(msg.x)
          }
          break

        case "resize-stop":
          if (resizedLayoutId === layout.id) {
            propageMsg({type: "update-layout", layout: {...layout, val}})
          }
          break

        case "split":
          propageMsg({
            ...msg,
            layout: {
              ...layout,
              [layout.right.id === msg.layout.id ? "right" : "left"]: msg.layout,
            },
          })
          break

        case "update-layout":
          propageMsg({
            type: "update-layout",
            layout: {
              ...layout,
              [layout.left.id === msg.layout.id ? "left" : "right"]: msg.layout,
            },
          })
          break

        case "delete-layout":
          propageMsg({
            type: "update-layout",
            layout: {
              ...layout,
              [layout.left.id === msg.prevLayoutId ? "left" : "right"]: msg.layout,
            },
          })
          break

        case "delete-view":
          propageMsg({
            type: "delete-layout",
            prevLayoutId: layout.id,
            layout: layout.left.id === msg.layoutId ? layout.right : layout.left,
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

  const active = {[classes.active]: resizedLayoutId === layout.id}

  return (
    <>
      <div className={classNames(classes.leftView, active)} style={{right: `${100 - val}%`}}>
        <View {...props} layout={layout.left} sendMsg={handleMsg} />
      </div>
      <div className={classNames(classes.rightView, active)} style={{left: `${val}%`}}>
        <View {...props} layout={layout.right} sendMsg={handleMsg} />
      </div>
    </>
  )
}

const HSplitView: FC<ViewProps<HNodeLayout>> = props => {
  const {sendMsg: propageMsg, layout, resizedLayoutId} = props
  const [val, setVal] = useState(0)

  const handleMsg = useCallback(
    (msg: Msg) => {
      console.log("h-node", msg)
      switch (msg.type) {
        case "grab-top-handle":
          if (layout.bottom.id === msg.layoutId) {
            propageMsg({type: "resize-start", layoutId: layout.id})
          } else {
            propageMsg({...msg, layoutId: layout.id})
          }
          break

        case "grab-right-handle": {
          const id = uuid()
          const pos = layout.top.id === msg.layoutId ? "top" : "bottom"
          propageMsg({
            type: "split",
            layoutId: id,
            layout: {
              ...layout,
              [pos]: {
                id,
                type: "v-node",
                val: 100,
                left: layout[pos],
                right: {id: uuid(), type: "leaf"},
              },
            },
          })
          break
        }

        case "grab-bottom-handle":
          if (layout.top.id === msg.layoutId) {
            propageMsg({type: "resize-start", layoutId: layout.id})
          } else {
            propageMsg({...msg, layoutId: layout.id})
          }
          break

        case "grab-left-handle": {
          const id = uuid()
          const pos = layout.top.id === msg.layoutId ? "top" : "bottom"
          propageMsg({
            type: "split",
            layoutId: id,
            layout: {
              ...layout,
              [pos]: {
                id,
                type: "v-node",
                val: 0,
                left: {id: uuid(), type: "leaf"},
                right: layout[pos],
              },
            },
          })
          break
        }

        case "resize-start":
          propageMsg(msg)
          break

        case "resize":
          if (resizedLayoutId === layout.id) {
            setVal(msg.y)
          }
          break

        case "resize-stop":
          if (resizedLayoutId === layout.id) {
            propageMsg({type: "update-layout", layout: {...layout, val}})
          }
          break

        case "split":
          propageMsg({
            ...msg,
            layout: {
              ...layout,
              [layout.top.id === msg.layout.id ? "top" : "bottom"]: msg.layout,
            },
          })
          break

        case "update-layout":
          propageMsg({
            type: "update-layout",
            layout: {
              ...layout,
              [layout.top.id === msg.layout.id ? "top" : "bottom"]: msg.layout,
            },
          })
          break

        case "delete-layout":
          propageMsg({
            type: "update-layout",
            layout: {
              ...layout,
              [layout.top.id === msg.prevLayoutId ? "top" : "bottom"]: msg.layout,
            },
          })
          break

        case "delete-view":
          propageMsg({
            type: "delete-layout",
            prevLayoutId: layout.id,
            layout: layout.top.id === msg.layoutId ? layout.bottom : layout.top,
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

  const active = {[classes.active]: resizedLayoutId === layout.id}

  return (
    <>
      <div className={classNames(classes.topView, active)} style={{bottom: `${100 - val}%`}}>
        <View {...props} layout={layout.top} sendMsg={handleMsg} />
      </div>
      <div className={classNames(classes.bottomView, active)} style={{top: `${val}%`}}>
        <View {...props} layout={layout.bottom} sendMsg={handleMsg} />
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
      case "grab-top-handle": {
        const id = uuid()
        setResizedLayoutId(id)
        setLayout({
          id,
          type: "h-node",
          val: 0,
          top: {id: uuid(), type: "leaf"},
          bottom: {...layout},
        })
        break
      }

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

      case "grab-bottom-handle": {
        const id = uuid()
        setResizedLayoutId(id)
        setLayout({
          id,
          type: "h-node",
          val: 100,
          top: {...layout},
          bottom: {id: uuid(), type: "leaf"},
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

      case "split": {
        setLayout({...layout, ...msg.layout})
        setResizedLayoutId(msg.layoutId)
        break
      }

      case "update-layout": {
        setLayout({...layout, ...msg.layout})
        setResizedLayoutId(null)
        break
      }

      case "delete-layout":
        if (layout.type === "v-node") {
          setLayout(layout.left.id === msg.prevLayoutId ? layout.right : layout.left)
        } else if (layout.type === "h-node") {
          setLayout(layout.top.id === msg.prevLayoutId ? layout.bottom : layout.top)
        }
        break

      default:
        break
    }
  }

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
