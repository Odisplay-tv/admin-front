import React, {FC} from "react"
import classNames from "classnames"

import {useAsyncState} from "../async/context"
import Loader from "../async/loader"
import Fade from "./fade"

import classes from "./button.module.scss"

type HTMLButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "color" | "size" | "prefix"
>

export type ButtonProps = HTMLButtonProps & {
  className?: string
  color?: "green" | "gray" | "red" | "transparent"
  size?: "md"
  prefix?: FC<React.SVGProps<SVGSVGElement>>
}

const Button: FC<ButtonProps> = props => {
  const {className, color, size, prefix, type = "button", ...buttonProps} = props
  const Prefix = prefix || null
  const loading = useAsyncState()

  return (
    <button
      type={type}
      {...buttonProps}
      className={classNames(
        classes.button,
        classes[color || "green"],
        classes[size || "md"],
        props.className,
      )}
    >
      {Prefix && (
        <Fade watch={loading} onTrue={<Loader />} onFalse={<Prefix className={classes.icon} />} />
      )}
      {props.children}
    </button>
  )
}

export default Button
