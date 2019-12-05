import React, {FC} from "react"
import {Link as RouterLink, LinkProps as RouterLinkProps, useLocation} from "react-router-dom"

const Link: FC<RouterLinkProps> = ({className = "", to, children, ...props}) => {
  const location = useLocation()
  const href: string = (() => {
    switch (typeof to) {
      case "string":
        return to || ""

      case "object":
        return to.pathname || ""

      case "function":
        return to(location).toString()

      default:
        return String(to) || ""
    }
  })()

  return href.startsWith("/") ? (
    <RouterLink className={className} to={to} {...props}>
      {children}
    </RouterLink>
  ) : (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children || href}
    </a>
  )
}

export default Link
