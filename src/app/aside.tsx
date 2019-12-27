import React, {FC, MouseEvent} from "react"
import {useTranslation} from "react-i18next"

import Link from "./link"

import classes from "./aside.module.scss"

type AsideProps = {
  openNav: () => void
}

const Aside: FC<AsideProps> = props => {
  const {t} = useTranslation(["default", "auth"])

  function handleBurgerClick(evt: MouseEvent) {
    evt.preventDefault()
    props.openNav()
  }

  return (
    <aside className={classes.aside}>
      <div className={classes.burger}>
        <button onClick={handleBurgerClick} type="button">
          <img src="/images/icon-burger.svg" alt="" />
        </button>
      </div>
      <Link className={classes.account} to="/account">
        <img src="/images/icon-account.svg" alt="" />
        <div className={classes.accountLabel}>{t("my-account")}</div>
      </Link>
      <div className={classes.info}>
        <div className={classes.infoArrow} />
        <div
          className={classes.infoLabel}
          dangerouslySetInnerHTML={{__html: t("auth:trial-days-left", {days: 14})}}
        />
      </div>
      <div />
      <Link className={classes.navItem} to="/help">
        <img src="/images/icon-help.svg" alt="" />
        <div>{t("need-help")}</div>
      </Link>
      <Link className={classes.navItem} to="/logout">
        <img src="/images/icon-logout.svg" alt="" />
        <div>{t("logout")}</div>
      </Link>
      <Link className={classes.navItem} to="/">
        <img src="/images/icon-fr.svg" alt="" />
      </Link>
    </aside>
  )
}

export default Aside
