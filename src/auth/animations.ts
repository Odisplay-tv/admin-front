import {useTransition, useSpring} from "react-spring"

export function useStepTranslation(visible = true) {
  const transitions = useTransition(visible, null, {
    from: {transform: "translateX(100px)", opacity: 0},
    enter: {transform: "translateX(0)", opacity: 1},
    leave: {transform: "translateX(-500px)", opacity: 0},
    config: {
      mass: 1,
      tension: 130,
      friction: 25,
    },
  })

  return {transitions}
}

export function usePerspective() {
  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: {mass: 5, tension: 350, friction: 40},
  }))

  const trans = (x: number, y: number) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg)`
  const calc = (x: number, y: number) => [
    -(y - window.innerHeight / 2) / 300,
    (x - window.innerWidth / 2) / 500,
  ]

  const style: React.CSSProperties = {transform: props.xy.interpolate(trans as any)}
  function handleMouseMove(evt: React.MouseEvent) {
    return set({xy: calc(evt.clientX, evt.clientY)})
  }

  return {style, handleMouseMove}
}

export default {useStepTranslation, usePerspective}
