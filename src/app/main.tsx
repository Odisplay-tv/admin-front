import React, {FC} from "react"

import classes from "./main.module.scss"

const Main: FC = ({children}) => {
  return <main className={classes.main}>{children}</main>
}

export default Main
