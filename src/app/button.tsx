import React, {FC} from "react"
import classNames from "classnames"

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
      {Prefix && <Prefix className={classes.icon} />}
      {props.children}
    </button>
  )
}

export default Button
