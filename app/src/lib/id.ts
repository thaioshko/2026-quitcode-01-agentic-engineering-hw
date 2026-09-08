/** crypto.randomUUID() isn't available in every browser (e.g. older Safari, some locked-down
 * corporate browsers, or any non-HTTPS/non-localhost context) — fall back to a simple
 * timestamp + random suffix so task creation never silently throws. */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID()
    } catch {
      // fall through to the fallback below
    }
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
