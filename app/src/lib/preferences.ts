export interface Preferences {
  theme: 'light' | 'dark' | 'system'
  accent: 'violet' | 'blue' | 'mint' | 'coral' | 'orange'
  density: 'compact' | 'comfortable' | 'detailed'
}

export const DEFAULT_PREFERENCES: Preferences = {
  theme: 'system',
  accent: 'violet',
  density: 'comfortable',
}

const PREFS_KEY = 'task-tracker:preferences'

export function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    return raw ? { ...DEFAULT_PREFERENCES, ...(JSON.parse(raw) as Partial<Preferences>) } : DEFAULT_PREFERENCES
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function savePreferences(prefs: Preferences) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
}

export function resolveTheme(theme: Preferences['theme']): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}
