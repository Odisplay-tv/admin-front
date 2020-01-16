import uuid from "uuid/v4"

export type Layout = LeafLayout | VNodeLayout | HNodeLayout

export type LeafLayoutData = {
  type: "file"
  url: string
}

export type LeafLayout = {
  id: string
  type: "leaf"
  data: LeafLayoutData | null
}

export type VNodeLayout = {
  id: string
  type: "v-node"
  val: number
  left: Layout
  right: Layout
}

export type HNodeLayout = {
  id: string
  type: "h-node"
  val: number
  top: Layout
  bottom: Layout
}

export type Screen = {
  id: string
  code: string
  name: string
  orientation: "H" | "V"
  groupId: string | null
  layout: Layout
}

export type PartialScreen = Partial<Screen> & Pick<Screen, "id">

export type Group = {
  id: string
  name: string
}

export function emptyLeaf(): LeafLayout {
  return {id: uuid(), type: "leaf", data: null}
}

export const emptyScreen: Screen = {
  id: "",
  code: "",
  name: "",
  orientation: "H",
  groupId: null,
  layout: emptyLeaf(),
}

export const emptyGroup: Group = {
  id: "",
  name: "",
}
