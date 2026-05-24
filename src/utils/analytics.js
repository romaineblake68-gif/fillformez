const ANALYTICS_KEY = 'fillformeez_analytics_v1'

function load() {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY)
    if (!raw) return { appOpens: [], formStarts: [], formCompletions: [] }
    const p = JSON.parse(raw)
    return {
      appOpens:       Array.isArray(p.appOpens)       ? p.appOpens       : [],
      formStarts:     Array.isArray(p.formStarts)     ? p.formStarts     : [],
      formCompletions:Array.isArray(p.formCompletions)? p.formCompletions: [],
    }
  } catch {
    return { appOpens: [], formStarts: [], formCompletions: [] }
  }
}

function save(data) {
  try { localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data)) } catch {}
}

export function trackAppOpen() {
  const data = load()
  data.appOpens.push({ timestamp: Date.now() })
  save(data)
}

// formType: 'passport' | 'trn' | 'nis'
// resumed: whether user resumed from a saved draft
export function trackFormStart(formType, resumed = false) {
  const data = load()
  data.formStarts.push({ timestamp: Date.now(), formType, resumed })
  save(data)
}

export function trackFormComplete(formType) {
  const data = load()
  data.formCompletions.push({ timestamp: Date.now(), formType })
  save(data)
}

export function loadAnalytics() {
  return load()
}
