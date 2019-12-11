import React, {FC, createContext, useContext, useState} from "react"

type AsyncState = boolean
type AsyncDispatch = (loading?: boolean) => void

const defaultState: AsyncState = false
const defaultDispatch: AsyncDispatch = () => {
  //
}

const AsyncContextState = createContext<AsyncState>(defaultState)
const AsyncContextDispatch = createContext<AsyncDispatch>(defaultDispatch)

export const useAsyncState = () => useContext(AsyncContextState)
export const useAsyncDispatch = () => useContext(AsyncContextDispatch)
export const useAsync = () => {
  const loading = useAsyncState()
  const setLoading = useAsyncDispatch()
  return {loading, setLoading}
}

export const AsyncContextProvider: FC = ({children}) => {
  const [loading, setLoading] = useState(false)

  function toggleLoading(nextLoading?: boolean) {
    setLoading(nextLoading === undefined ? !loading : Boolean(nextLoading))
  }

  return (
    <AsyncContextDispatch.Provider value={toggleLoading}>
      <AsyncContextState.Provider value={loading}>{children}</AsyncContextState.Provider>
    </AsyncContextDispatch.Provider>
  )
}

export default useAsync
