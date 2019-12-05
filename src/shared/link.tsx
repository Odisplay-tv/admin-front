import React, {FC} from "react"
import {Link as RouterLink} from "react-router-dom"

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string
}

const Link: FC<LinkProps> = ({className = "", to, children, ...props}) => {
  return to.startsWith("/") ? (
    <RouterLink className={className} to={to} {...props}>
      {children}
    </RouterLink>
  ) : (
    <a className={className} href={to} target="_blank" rel="noopener noreferrer">
      {children || to}
    </a>
  )
}

export default Link
