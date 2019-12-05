import React, {FC} from "react"
import {useTranslation} from "react-i18next"

import Link from "./link"

import classes from "./aside.module.scss"

const Aside: FC = () => {
  const {t} = useTranslation(["translation", "auth"])

  return (
    <aside className={classes.aside}>
      <div className={classes.burger}>
        <a href="/">
          <img src="#" alt="" />
        </a>
      </div>
      <Link className={classes.account} to="/account">
        <div className={classes.accountIcon}>
          <img src="#" alt="" />
        </div>
        <div className={classes.accountLabel}>{t("my-account")}</div>
      </Link>
      <div className={classes.info}>
        <div className={classes.infoArrow} />
        <div
          className={classes.infoLabel}
          dangerouslySetInnerHTML={{__html: t("trial-days-left", {days: 14})}}
        />
      </div>
      <div />
      <Link className={classes.navItem} to="/help">
        <img src="#" alt="" />
        <div>{t("need-help")}</div>
      </Link>
      <Link className={classes.navItem} to="/logout">
        <img src="#" alt="" />
        <div>{t("auth:logout")}</div>
      </Link>
      <Link className={classes.navItem} to="/">
        <img src="#" alt="" />
      </Link>
    </aside>
  )
}

export default Aside
