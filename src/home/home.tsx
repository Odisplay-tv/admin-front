import React, {FC} from "react"
import {useTranslation} from "react-i18next"

import Link from "../shared/link"

import classes from "./home.module.scss"

const Home: FC = () => {
  const {t} = useTranslation()

  return (
    <div className={classes.container}>
      <Link className={classes.cardConnectScreen} to="/screens/connect">
        <img src="/images/playlist.svg" alt="" />
        <h2 dangerouslySetInnerHTML={{__html: t("connect-screen-title")}} />
        <p>{t("connect-screen-desc")}</p>
      </Link>

      <Link className={classes.cardPlaylist} to="/playlists">
        <img src="/images/playlist.svg" alt="" />
        <h2 dangerouslySetInnerHTML={{__html: t("create-playlist-title")}} />
        <p>{t("create-playlist-desc")}</p>
      </Link>

      <Link className={classes.cardPlanning} to="/plannings">
        <img src="/images/playlist.svg" alt="" />
        <h2 dangerouslySetInnerHTML={{__html: t("create-planning-title")}} />
        <p>{t("create-planning-desc")}</p>
      </Link>

      <Link className={classes.cardScreens} to="/screens">
        <strong>199</strong>
        <h3 dangerouslySetInnerHTML={{__html: t("screen(s)")}} />
      </Link>

      <Link className={classes.cardGuide} to="/guide">
        <img src="/images/starter-guide.svg" alt="" />
        <h3>{t("starter-guide-title")}</h3>
      </Link>

      <Link className={classes.cardSupport} to="/help">
        <img src="/images/support.svg" alt="" />
        <h3>{t("contact-support-title")}</h3>
      </Link>
    </div>
  )
}

export default Home
