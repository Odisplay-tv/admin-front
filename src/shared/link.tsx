import React, {FC} from "react"
import {Link as RouterLink} from "react-router-dom"

type LinkProps = {
  className?: string
  to: string
}

const Link: FC<LinkProps> = ({className = "", to, children}) => {
  return to.startsWith("/") ? (
    <RouterLink className={className} to={to} tabIndex={-1}>
      {children}
    </RouterLink>
  ) : (
    <a className={className} href={to} target="_blank" rel="noopener noreferrer">
      {children || to}
    </a>
  )
}

export default Link
