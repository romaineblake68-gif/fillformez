const MUTE_KEY = 'fillformeez_muted'

export function isMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === 'true'
  } catch {
    return false
  }
}

export function persistMute(value) {
  try {
    localStorage.setItem(MUTE_KEY, value ? 'true' : 'false')
  } catch {
    // ignore — localStorage unavailable
  }
}
