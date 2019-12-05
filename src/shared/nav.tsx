import React, {FC} from "react"
import {useTranslation} from "react-i18next"
import classNames from "classnames"

import Link from "./link"

import classes from "./nav.module.scss"

type NavProps = {
  visible: boolean
}

const Nav: FC<NavProps> = ({visible}) => {
  const {t} = useTranslation()
  const dataVisible = visible ? {"data-visible": ""} : {}

  return (
    <nav className={classes.nav} {...dataVisible}>
      <header className={classes.logo}>
        <img src="/images/logo.svg" alt="" />
      </header>

      <Link className={classNames(classes.item, {[classes.active]: true})} to="/screens">
        <img src="/images/icon-screen.svg" alt="" />
        <span className={classes.itemText}>{t("screens")}</span>
        <span className={classes.itemCount}>1</span>
      </Link>

      <Link className={classes.item} to="/playlists">
        <img src="/images/icon-playlist.svg" alt="" />
        <span className={classes.itemText}>{t("playlists")}</span>
      </Link>

      <Link className={classes.subitem} to="/playlist/1">
        <span className={classes.itemText}>
          <span className={classes.itemPill} />
          Playlist exemple
        </span>
      </Link>

      <Link className={classes.item} to="/plannings">
        <span className={classes.itemIcon}>
          <img src="/images/icon-planning.svg" alt="" />
        </span>
        <span className={classes.itemText}>{t("plannings")}</span>
      </Link>

      <Link className={classes.subitem} to="/plannings/1">
        <span className={classes.itemText}>
          <span className={classes.itemPill} />
          Planning exemple
        </span>
      </Link>
    </nav>
  )
}

export default Nav
