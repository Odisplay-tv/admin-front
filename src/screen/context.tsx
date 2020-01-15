import React, {FC, createContext, useContext, useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {toast} from "react-toastify"

import useAsync from "../async/context"
import {useAuthState} from "../auth/context"
import {firestore} from "../app/firebase"
import {Screen, PartialScreen, Group, emptyScreen, emptyGroup} from "./model"
import $screen from "./service"

const noop = async () => {}

type ScreenState = {
  screens: Screen[]
  update: (screen: PartialScreen, merge?: boolean) => Promise<void>
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
  const {auth} = useAuthState()
  const {loading, setLoading} = useAsync()
  const [screens, setScreens] = useState<Screen[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const {t} = useTranslation(["screen"])

  useEffect(() => {
    if (!auth) return
    const unsubscribe = firestore(`users/${auth.uid}/screens`).onSnapshot(
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
  }, [t, auth])

  async function update(screen: PartialScreen, merge = true) {
    if (loading) return
    if (!auth) return
    setLoading(true)

    try {
      await $screen.update(auth.uid, screen, merge)
      toast.success(t("successfully-updated"))
    } catch (err) {
      toast.error(t(err.message))
    }

    setLoading(false)
  }

  async function _delete(id: string) {
    try {
      if (!auth) return
      await $screen.delete(auth.uid, id)
      toast.success(t("successfully-deleted"))
    } catch (err) {
      toast.error(t(err.message))
    }
  }

  useEffect(() => {
    if (!auth) return
    const unsubscribe = firestore(`users/${auth.uid}/groups`).onSnapshot(
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
  }, [t, auth])

  async function addGroup(name: string) {
    try {
      if (!auth) return
      await $screen.addGroup(auth.uid, name)
      toast.success(t("group-successfully-added"))
    } catch (err) {
      toast.error(t(err.message))
    }
  }

  async function deleteGroup(id: string) {
    try {
      if (!auth) return
      await $screen.deleteGroup(auth.uid, id)
      await Promise.all(
        screens
          .filter(s => s.groupId === id)
          .map(s => $screen.update(auth.uid, {...s, groupId: null})),
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
