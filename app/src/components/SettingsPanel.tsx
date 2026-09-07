import type { Preferences } from '../lib/preferences'

const ACCENTS: { value: Preferences['accent']; swatch: string }[] = [
  { value: 'coral', swatch: '#d9603b' },
  { value: 'violet', swatch: '#6d4aff' },
  { value: 'blue', swatch: '#3568d4' },
  { value: 'mint', swatch: '#1f8a55' },
  { value: 'orange', swatch: '#c9820a' },
]

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex rounded-sm border border-border bg-surface-subtle p-0.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={`rounded-xs px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
            value === option ? 'bg-surface text-primary shadow-sm' : 'text-secondary hover:text-primary'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export function SettingsPanel({
  prefs,
  onChange,
  onClose,
}: {
  prefs: Preferences
  onChange: (prefs: Preferences) => void
  onClose: () => void
}) {
  return (
    <div className="flex w-64 flex-col gap-4 rounded-md border border-border bg-surface p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">Settings</h2>
        <button type="button" onClick={onClose} aria-label="Close settings" className="text-secondary hover:text-primary">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-secondary">Appearance</span>
        <SegmentedControl
          options={['light', 'dark', 'system'] as const}
          value={prefs.theme}
          onChange={(theme) => onChange({ ...prefs, theme })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-secondary">Accent</span>
        <div className="flex items-center gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => onChange({ ...prefs, accent: a.value })}
              aria-label={a.value}
              aria-pressed={prefs.accent === a.value}
              className={`h-6 w-6 rounded-full border-2 transition-transform ${
                prefs.accent === a.value ? 'scale-110 border-primary' : 'border-transparent'
              }`}
              style={{ backgroundColor: a.swatch }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-secondary">Density</span>
        <SegmentedControl
          options={['compact', 'comfortable', 'detailed'] as const}
          value={prefs.density}
          onChange={(density) => onChange({ ...prefs, density })}
        />
      </div>
    </div>
  )
}
