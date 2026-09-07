export interface Preferences {
  theme: 'light' | 'dark' | 'system'
  accent: 'violet' | 'blue' | 'mint' | 'coral' | 'orange'
  density: 'compact' | 'comfortable' | 'detailed'
}

export const DEFAULT_PREFERENCES: Preferences = {
  theme: 'system',
  accent: 'coral',
  density: 'comfortable',
}

const PREFS_KEY = 'task-tracker:preferences'

// Bump this when DEFAULT_PREFERENCES changes in a way that should reach
// existing visitors (e.g. a new default accent) — stale stored preferences
// from an older version are discarded instead of silently overriding it.
const PREFS_VERSION = 2

interface StoredPreferences extends Preferences {
  version: number
}

export function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return DEFAULT_PREFERENCES
    const parsed = JSON.parse(raw) as Partial<StoredPreferences>
    if (parsed.version !== PREFS_VERSION) return DEFAULT_PREFERENCES
    return { ...DEFAULT_PREFERENCES, ...parsed }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function savePreferences(prefs: Preferences) {
  const stored: StoredPreferences = { ...prefs, version: PREFS_VERSION }
  localStorage.setItem(PREFS_KEY, JSON.stringify(stored))
}

export function resolveTheme(theme: Preferences['theme']): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}
