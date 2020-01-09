export type AuthCredentials = {
  email: string
  password: string
}

export type User = {
  id: string
  email: string
  createdAt: Date
  uploads: string[]
}

export const defaultCredentials: AuthCredentials = {email: "", password: ""}
