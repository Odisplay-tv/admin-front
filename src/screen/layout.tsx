import React, {FC, useCallback, useEffect, useRef, useState} from "react"
import {useTranslation} from "react-i18next"
import noop from "lodash/fp/noop"

import classes from "./layout.module.scss"

type SplitLayout = VSplitLayout | HSplitLayout
type Layout = NoSplitLayout | SplitLayout

type NoSplitLayout = {
  id: number
  type: "no-split"
}

type VSplitLayout = {
  id: number
  type: "v-split"
  val: number
  left: Layout
  right: Layout
}

type HSplitLayout = {
  id: number
  type: "h-split"
  val: number
  top: Layout
  bottom: Layout
}

type Position = "top" | "right" | "bottom" | "left"

type NoSplitView = {
  parentRef: React.RefObject<HTMLDivElement>
  parentLayout: VSplitLayout | HSplitLayout
  onResize: (val: number) => void
  onResizeEnd: () => void
  onPropageSplit: (layout: Layout) => void
  onSplit: (pos: Position) => void
  pos: Position
}

const NoSplitView: FC<NoSplitView> = props => {
  const {parentRef, parentLayout, onResize: setVal, pos} = props
  const split = props.onSplit
  const propageResizeEnd = props.onResizeEnd
  const [resizing, setResizing] = useState(init)

  const resize = useCallback(
    (evt: MouseEvent) => {
      if (resizing && parentRef.current) {
        const {x: parentLeft, width: parentWidth} = parentRef.current.getBoundingClientRect()
        const delta = ((evt.clientX - parentLeft) * 100) / parentWidth
        setVal(Math.max(5, Math.min(95, delta)))
      }
    },
    [parentRef, resizing, setVal],
  )

  function rightHandleGrabbed() {
    console.log(parentLayout, pos)
    if (parentLayout.type === "v-split" && pos === "left") {
      setResizing(true)
    } else if (pos === "right") {
      console.log("split from leaf")
      setResizing(true)
      split("right")
    }
  }

  function leftHandleGrabbed() {
    if (parentLayout.type === "v-split" && pos === "right") {
      setResizing(true)
    } else if (pos === "left") {
      console.log("split from leaf")
      setResizing(true)
      split("left")
    }
  }

  useEffect(() => {
    const stopResizing = () => {
      setResizing(false)
      if (resizing) propageResizeEnd()
    }

    document.addEventListener("mouseup", stopResizing)
    document.addEventListener("mousemove", resize)

    return () => {
      document.removeEventListener("mouseup", stopResizing)
      document.removeEventListener("mousemove", resize)
    }
  }, [propageResizeEnd, resize, resizing])

  return (
    <div className={classes.view}>
      <div>YOLO</div>
      <button type="button" className={classes.handleTop} />
      <button type="button" onMouseDown={rightHandleGrabbed} className={classes.handleRight} />
      <button type="button" className={classes.handleBottom} />
      <button type="button" onMouseDown={leftHandleGrabbed} className={classes.handleLeft} />
    </div>
  )
}

type SplitViewProps<L> = {
  parentRef: React.RefObject<HTMLDivElement>
  onPropageSplit: (layout: Layout) => void
  layout: L
}

const VSplitView: FC<SplitViewProps<VSplitLayout>> = props => {
  const {parentRef, onPropageSplit: propageSplit, layout} = props
  const [val, setVal] = useState(layout.val)

  useEffect(() => {
    setVal(layout.val)
  }, [layout])

  function split(pos: Position) {
    return () => {
      console.log("split from v-node")
      propageSplit({
        ...layout,
        [pos]: {
          id: 99,
          type: "v-split",
          right: {id: 0, type: "no-split"},
          left: {id: 0, type: "no-split"},
          val: 100,
        },
      })
    }
  }

  return (
    <>
      <div className={classes.leftView} style={{right: `${100 - val}%`}}>
        <View
          parentRef={parentRef}
          onResize={setVal}
          onResizeEnd={() => propageSplit({...layout, val})}
          onSplit={split("left")}
          onPropageSplit={left => {
            console.log("propage from node", left)
            propageSplit({...layout, left})
          }}
          parentLayout={layout}
          layout={layout.left}
          pos="left"
        />
      </div>
      <div className={classes.rightView} style={{left: `${val}%`}}>
        <View
          parentRef={parentRef}
          onSplit={split("right")}
          onPropageSplit={right => {
            console.log("propage from node", right)
            propageSplit({...layout, right})
          }}
          onResize={setVal}
          onResizeEnd={() => propageSplit({...layout, val})}
          parentLayout={layout}
          layout={layout.right}
          pos="right"
        />
      </div>
    </>
  )
}

const HSplitView: FC<SplitViewProps<HSplitLayout>> = props => {
  const {parentRef, onPropageSplit: propageSplit, layout} = props
  const [val, setVal] = useState(layout.val)

  function split() {
    console.log("split from h-node")
    propageSplit({
      id: 0,
      type: "h-split",
      top: {id: 0, type: "no-split"},
      bottom: {id: 0, type: "no-split"},
      val,
    })
  }

  useEffect(() => {
    setVal(layout.val)
  }, [layout])

  return (
    <>
      <div className={classes.topView} style={{bottom: `${100 - val}%`}}>
        <View
          parentRef={parentRef}
          onResize={setVal}
          onResizeEnd={() => propageSplit({...layout, val})}
          onSplit={split}
          onPropageSplit={top => {
            console.log("propage from node", top)
            propageSplit({...layout, top})
          }}
          parentLayout={layout}
          layout={layout.top}
          pos="top"
        />
      </div>
      <div className={classes.bottomView} style={{top: `${val}%`}}>
        <View
          parentRef={parentRef}
          onResize={setVal}
          onResizeEnd={() => propageSplit({...layout, val})}
          onSplit={split}
          onPropageSplit={bottom => {
            console.log("propage from node", bottom)
            propageSplit({...layout, bottom})
          }}
          parentLayout={layout}
          layout={layout.bottom}
          pos="bottom"
        />
      </div>
    </>
  )
}

type ViewProps = {
  parentRef: React.RefObject<HTMLDivElement>
  onResize: (val: number) => void
  onResizeEnd: () => void
  onSplit: (pos: Position) => void
  onPropageSplit: (layout: Layout) => void
  parentLayout: SplitLayout
  layout: Layout
  pos: "top" | "right" | "bottom" | "left"
}

const View: FC<ViewProps> = props => {
  const {parentRef, onPropageSplit, onSplit, onResize, layout, parentLayout, pos} = props
  const {onResizeEnd} = props
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} className={classes.viewContainer}>
      {(() => {
        switch (layout.type) {
          case "no-split": {
            const props = {
              parentRef,
              onResizeEnd,
              onPropageSplit,
              onSplit,
              onResize,
              parentLayout,
              pos,
            }
            return <NoSplitView {...props} />
          }

          case "v-split": {
            const props = {parentRef: ref, onResizeEnd, onPropageSplit, layout, pos}
            return <VSplitView {...props} />
          }

          case "h-split": {
            const props = {parentRef: ref, onResizeEnd, onPropageSplit, layout, pos}
            return <HSplitView {...props} />
          }

          default:
            return null
        }
      })()}
    </div>
  )
}

let init = false

const ScreenLayout: FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const {t} = useTranslation(["default", "screen"])
  const [layout, setLayout] = useState<Layout>({
    id: 1,
    type: "h-split",
    val: 50,
    top: {
      id: 3,
      type: "v-split",
      val: 50,
      left: {
        id: 4,
        type: "no-split",
      },
      right: {
        id: 5,
        type: "no-split",
      },
    },
    bottom: {
      id: 2,
      type: "no-split",
    },
  })

  function propageSplit(patch: Layout) {
    const nextLayout: Layout = {...layout, ...patch}
    console.log("propage split from root", nextLayout)
    setLayout(nextLayout)
  }

  useEffect(() => {
    init = true
  }, [])

  return (
    <div className={classes.container}>
      <div ref={ref} className={classes.content}>
        <View
          parentRef={ref}
          onResizeEnd={noop}
          onResize={noop}
          onSplit={noop}
          onPropageSplit={propageSplit}
          parentLayout={layout as HSplitLayout}
          layout={layout}
          pos="top"
        />
      </div>
    </div>
  )
}

export default ScreenLayout
