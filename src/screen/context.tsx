import React, {FC, createContext, useContext, useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {toast} from "react-toastify"

import {useAuthState} from "../auth/context"
import {firestore} from "../app/firebase"
import {Screen, emptyScreen} from "./model"
import $screen from "./service"

type ScreenState = {
  screens: Screen[]
  update: (screen: Screen) => Promise<void>
  delete: (id: string) => Promise<void>
}

const defaultState: ScreenState = {
  screens: [],
  update: async () => {},
  delete: async () => {},
}

const ScreenContext = createContext<ScreenState>(defaultState)

export const ScreenContextProvider: FC = ({children}) => {
  const {user} = useAuthState()
  const [screens, setScreens] = useState<Screen[]>([])
  const {t} = useTranslation(["screen"])

  useEffect(() => {
    if (!user) return
    const unsubscribe = firestore(`users/${user.uid}/screens`).onSnapshot(
      query => {
        const screens: Screen[] = []
        query.forEach(ref => screens.push({...emptyScreen, id: ref.id, ...ref.data()}))
        setScreens(screens)
      },
      err => {
        toast.error(t(err.message))
      },
    )

    return () => unsubscribe()
  }, [t, user])

  async function _update(screen: Screen) {
    try {
      if (!user) return
      await $screen.update(user.uid, screen)
      toast.success(t("successfully-updated"))
    } catch (err) {
      toast.error(t(err.message))
    }
  }

  async function _delete(screenId: string) {
    try {
      if (!user) return
      await $screen.delete(user.uid, screenId)
      toast.success(t("successfully-deleted"))
    } catch (err) {
      toast.error(t(err.message))
    }
  }

  return (
    <ScreenContext.Provider value={{screens, update: _update, delete: _delete}}>
      {children}
    </ScreenContext.Provider>
  )
}

export const useScreens = () => useContext(ScreenContext)
export default useScreens
