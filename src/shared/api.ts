const baseUrl = process.env.REACT_APP_API_URL

const request = async (method: string, path: string) => {
  const url = baseUrl + path
  const opts: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  }

  try {
    const res = await fetch(url, opts)
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  } catch (err) {
    throw new Error(err.message)
  }
}

export function generatePairingCode() {
  return request("POST", "/rpc/generate_pairing_code")
}

export default {
  generatePairingCode,
}
