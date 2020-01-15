import React, {FC, useEffect, useState} from "react"
import {useHistory, useRouteMatch} from "react-router-dom"
import {useTranslation} from "react-i18next"
import cn from "classnames"
import qs from "query-string"
import find from "lodash/fp/find"
import getOr from "lodash/fp/getOr"

import $auth from "../auth/service"
import {useAuthState} from "../auth/context"
import filestack from "../app/filestack"
import {ReactComponent as IconAdd} from "../app/icon-add.svg"
import {ReactComponent as IconArrowLeft} from "../app/icon-arrow-left.svg"
import {ReactComponent as IconApp} from "../app/icon-app.svg"
import {ReactComponent as IconFile} from "../app/icon-file.svg"
import {ReactComponent as IconPlanning} from "../app/icon-planning.svg"
import {ReactComponent as IconPlaylist} from "../app/icon-playlist.svg"
import {ReactComponent as IconPreview} from "../app/icon-preview.svg"
import {ReactComponent as IconSave} from "../app/icon-save.svg"
import {ReactComponent as IconTrash} from "../app/icon-trash.svg"
import Button from "../app/button"
import {emptyLeaf} from "./model"
import LayoutView from "./layout"
import useScreens from "./context"

import classes from "./edit.module.scss"

type View = "planning" | "playlist" | "file" | "app"

const icons: {[V in View]: JSX.Element} = {
  planning: <IconPlanning />,
  playlist: <IconPlaylist />,
  file: <IconFile />,
  app: <IconApp />,
}

const ScreenEdit: FC = () => {
  const history = useHistory()
  const {id} = useRouteMatch<{id: string}>().params
  const {user} = useAuthState()
  const {screens, ...$screen} = useScreens()
  const screen = find({id}, screens)
  const defaultLayout = getOr(undefined, "layout", screen)
  const [layout, setLayout] = useState(defaultLayout)
  const [activeView, setActiveView] = useState<View | undefined>()
  const {t} = useTranslation(["default", "screen"])

  function save(evt: React.FormEvent) {
    evt.preventDefault()
    if (!screen) return
    if (!layout) return
    $screen.update({...screen, layout}, false)
  }

  useEffect(() => {
    if (defaultLayout) {
      setLayout(defaultLayout)
    }
  }, [defaultLayout])

  const AsideHeaderBtn: FC<{view?: View}> = ({view}) => {
    const className = cn(classes.asideHeaderBtn, {[classes.active]: view === activeView})
    const handleClick = () => setActiveView(view)

    return (
      <button className={className} onClick={handleClick}>
        {view ? icons[view] : <IconAdd />}
      </button>
    )
  }

  const AsideContentBtn: FC<{view: View}> = ({view}) => {
    const {t} = useTranslation()
    const handleClick = () => setActiveView(view)

    return (
      <button className={classes.asideContentBtn} onClick={handleClick}>
        <div>
          <IconAdd />
        </div>
        <span>{t("add")}</span>
        <strong>{t(view)}</strong>
      </button>
    )
  }

  async function uploadMedia() {
    const picker = filestack.picker({
      onUploadDone: ({filesUploaded}) => {
        if (user) {
          const uploads = (user.uploads || []).concat(filesUploaded.map(f => f.url))
          $auth.addUploads(user.id, uploads)
        }
      },
    })

    picker.open()
  }

  function startDragging(url: string) {
    return (evt: React.DragEvent<HTMLImageElement>) => {
      evt.dataTransfer.setData("type", "file")
      evt.dataTransfer.setData("url", url)
    }
  }

  async function deleteScreen(evt: React.MouseEvent<HTMLButtonElement>) {
    evt.preventDefault()

    if (screen && window.confirm(t("screen:confirm-deletion"))) {
      await $screen.delete(screen.id)
      history.push("/screens")
    }
  }

  const userId = getOr("", "id", user)
  const screenId = getOr("", "id", screen)

  return (
    <div className={classes.container}>
      <div>
        <h1 className={classes.title}>{t("screen:edit-title")}</h1>
        <div className={classes.layout}>
          <LayoutView layout={layout} onChange={setLayout} />
        </div>
      </div>
      <form className={classes.config} onSubmit={save}>
        <div className={classes.left}>
          <div>
            {t("screen:name")} <input type="text" className={classes.nameInput} />
          </div>
          <div>
            {t("screen:status")} <input type="text" className={classes.statusInput} />
          </div>
          <div>
            {t("screen:orientation")} <input type="text" className={classes.orientationInput} />
          </div>
          <div>
            {t("screen:layout")} <input type="text" className={classes.layoutInput} />
          </div>
        </div>
        <div className={classes.right}>
          <div className={classes.topActions}>
            <Button
              className={classes.button}
              to={window.location.origin + "/viewer?" + qs.stringify({userId, screenId})}
              prefix={IconPreview}
              color="gray"
            >
              {t("preview")}
            </Button>
            <Button type="submit" className={classes.button} prefix={IconSave} color="green">
              {t("save")}
            </Button>
          </div>
          <div className={classes.desc}>{t("screen:platform-type")} Android</div>
          <div className={classes.desc}>{t("screen:connected-at")} 16 octobre 2019</div>
          <div className={classes.bottomActions}>
            <Button
              className={classes.button}
              prefix={IconSave}
              color="transparent"
              onClick={() => setLayout(emptyLeaf())}
            >
              {t("reset")}
            </Button>
            <Button
              className={classes.button}
              prefix={IconTrash}
              color="red"
              onClick={deleteScreen}
            >
              {t("delete")}
            </Button>
          </div>
        </div>
      </form>
      <IconArrowLeft className={classes.dragArrow} />
      <span
        className={classes.dragMsg}
        dangerouslySetInnerHTML={{__html: t("screen:drag-drop-help")}}
      />
      <aside className={classes.aside}>
        <header className={classes.asideHeader}>
          <AsideHeaderBtn />
          <AsideHeaderBtn view="playlist" />
          <AsideHeaderBtn view="planning" />
          <AsideHeaderBtn view="file" />
          <AsideHeaderBtn view="app" />
        </header>
        <div className={classes.asideContent}>
          {(() => {
            switch (activeView) {
              case "planning":
                return null

              case "playlist":
                return null

              case "file":
                return (
                  <div className={classes.asideFile}>
                    <Button prefix={IconSave} color="gray" onClick={uploadMedia}>
                      {t("screen:upload-file")}
                    </Button>
                    {user &&
                      user.uploads.map(upload => (
                        <div key={upload}>
                          <img
                            draggable
                            onDragStart={startDragging(upload)}
                            height={200}
                            src={upload}
                            alt=""
                          />
                        </div>
                      ))}
                  </div>
                )

              case "app":
                return null

              default:
                return (
                  <div className={classes.asideHome}>
                    <AsideContentBtn view="file" />
                    <AsideContentBtn view="planning" />
                    <AsideContentBtn view="playlist" />
                    <AsideContentBtn view="app" />
                  </div>
                )
            }
          })()}
        </div>
      </aside>
    </div>
  )
}

export default ScreenEdit
