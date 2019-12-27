import React, {FC, createContext, useContext, useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {toast} from "react-toastify"

import {useAuthState} from "../auth/context"
import {firestore} from "../app/firebase"
import {Screen, PartialScreen, Group, emptyScreen, emptyGroup} from "./model"
import $screen from "./service"

const noop = async () => {}

type ScreenState = {
  screens: Screen[]
  update: (screen: PartialScreen) => Promise<void>
  delete: (id: string) => Promise<void>
  groups: Group[]
  addGroup: (name: string) => Promise<void>
  deleteGroup: (id: string) => Promise<void>
}

const defaultState: ScreenState = {
  screens: [],
  update: noop,
  delete: noop,
  groups: [],
  addGroup: noop,
  deleteGroup: noop,
}

const ScreenContext = createContext<ScreenState>(defaultState)

export const ScreenContextProvider: FC = ({children}) => {
  const {user} = useAuthState()
  const [screens, setScreens] = useState<Screen[]>([])
  const [groups, setGroups] = useState<Group[]>([])
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

  async function update(screen: PartialScreen) {
    try {
      if (!user) return
      await $screen.update(user.uid, screen)
      toast.success(t("successfully-updated"))
    } catch (err) {
      toast.error(t(err.message))
    }
  }

  async function _delete(id: string) {
    try {
      if (!user) return
      await $screen.delete(user.uid, id)
      toast.success(t("successfully-deleted"))
    } catch (err) {
      toast.error(t(err.message))
    }
  }

  useEffect(() => {
    if (!user) return
    const unsubscribe = firestore(`users/${user.uid}/groups`).onSnapshot(
      query => {
        const groups: Group[] = []
        query.forEach(ref => groups.push({...emptyGroup, id: ref.id, ...ref.data()}))
        setGroups(groups)
      },
      err => {
        toast.error(t(err.message))
      },
    )

    return () => unsubscribe()
  }, [t, user])

  async function addGroup(name: string) {
    try {
      if (!user) return
      await $screen.addGroup(user.uid, name)
      toast.success(t("group-successfully-added"))
    } catch (err) {
      toast.error(t(err.message))
    }
  }

  async function deleteGroup(id: string) {
    try {
      if (!user) return
      await $screen.deleteGroup(user.uid, id)
      await Promise.all(
        screens
          .filter(s => s.groupId === id)
          .map(s => $screen.update(user.uid, {...s, groupId: null})),
      )
      toast.success(t("group-successfully-deleted"))
    } catch (err) {
      toast.error(t(err.message))
    }
  }

  return (
    <ScreenContext.Provider
      value={{screens, update, delete: _delete, groups, addGroup, deleteGroup}}
    >
      {children}
    </ScreenContext.Provider>
  )
}

export const useScreens = () => useContext(ScreenContext)
export default useScreens
