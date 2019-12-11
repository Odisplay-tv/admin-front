import {useCallback, useRef} from "react"

import {useAuthState} from "../auth/context"
import {functions} from "./firebase"

const generateToken = functions.httpsCallable("generateToken")
const baseUrl = process.env.REACT_APP_API_URL

export default function useApi() {
  const token = useRef(null)
  const {user} = useAuthState()

  const getFetchOpts = useCallback(
    (method: string, body?: any) => ({
      method,
      ...(body || {}),
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(user ? {Authorization: `Bearer ${token.current}`} : {}),
      },
    }),
    [token, user],
  )

  const request = async (method: string, path: string, body?: any) => {
    const url = baseUrl + path
    let res = await fetch(url, getFetchOpts(method, body))

    if (res.status === 401) {
      const idToken = user ? await user.getIdToken() : ""
      const {data} = await generateToken({idToken})
      if (!data.ok) throw new Error(data.message)
      token.current = data.token
      res = await fetch(url, getFetchOpts(method))
    }

    if (!res.ok) {
      throw new Error(await res.text())
    } else {
      return res.json()
    }
  }

  const generatePairingCode = () => request("POST", "/rpc/declare_new_screen").then(JSON.parse)
  const findScreensByCode = (code: string) =>
    request("GET", `/screens?and=(code.eq.${code},user_id.is.null)`)
  const pairScreen = (id: string, userId: string) =>
    request("PATCH", `/screens?id=eq.${id}`, {user_id: userId})

  return {
    generatePairingCode,
    findScreensByCode,
    pairScreen,
  }
}
