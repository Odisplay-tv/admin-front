export type Screen = {
  id: string
  code: string
  name: string
  groupId: string | null
  layout: any
}

export type PartialScreen = Partial<Screen> & Pick<Screen, "id">

export type Group = {
  id: string
  name: string
}

export const emptyScreen: Screen = {
  id: "",
  code: "",
  name: "",
  groupId: null,
  layout: {},
}

export const emptyGroup: Group = {
  id: "",
  name: "",
}
