import { v4 as uuidv4 } from 'uuid'

const UUID_KEY = 'lehrerwm_uuid'

export function getClientUUID() {
  let id = localStorage.getItem(UUID_KEY)
  if (!id) {
    id = uuidv4()
    localStorage.setItem(UUID_KEY, id)
  }
  return id
}

export function getLightFingerprint() {
  try {
    const data = [
      navigator.userAgent,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen.width + 'x' + screen.height,
      navigator.language,
    ].join('|')
    return btoa(unescape(encodeURIComponent(data)))
  } catch {
    return null
  }
}
