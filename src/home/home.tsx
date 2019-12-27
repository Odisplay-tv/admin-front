import React, {FC} from "react"
import {useTranslation} from "react-i18next"

import Link from "../app/link"

import classes from "./home.module.scss"

const Home: FC = () => {
  const {t} = useTranslation(["global", "home"])

  return (
    <div className={classes.container}>
      <Link className={classes.cardConnectScreen} to="/screens/connect">
        <img src="/images/screen.svg" alt="" />
        <h2 dangerouslySetInnerHTML={{__html: t("home:connect-screen-title")}} />
        <p>{t("home:connect-screen-desc")}</p>
      </Link>

      <Link className={classes.cardPlaylist} to="/playlists">
        <img src="/images/playlist.svg" alt="" />
        <h2 dangerouslySetInnerHTML={{__html: t("home:create-playlist-title")}} />
        <p>{t("home:create-playlist-desc")}</p>
      </Link>

      <Link className={classes.cardPlanning} to="/plannings">
        <img src="/images/planning.svg" alt="" />
        <h2 dangerouslySetInnerHTML={{__html: t("home:create-planning-title")}} />
        <p>{t("home:create-planning-desc")}</p>
      </Link>

      <Link className={classes.cardScreens} to="/screens">
        <div>
          <strong>199</strong>
          <h3 dangerouslySetInnerHTML={{__html: t("home:screen(s)")}} />
        </div>
      </Link>

      <Link className={classes.cardGuide} to="/guide">
        <div>
          <img src="/images/starter-guide.svg" alt="" />
          <h3>{t("home:starter-guide-title")}</h3>
        </div>
      </Link>

      <Link className={classes.cardSupport} to="/help">
        <div>
          <img src="/images/support.svg" alt="" />
          <h3>{t("home:contact-support-title")}</h3>
        </div>
      </Link>
    </div>
  )
}

export default Home
