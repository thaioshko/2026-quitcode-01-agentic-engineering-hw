import { useState } from 'react'
import { Button } from './Button'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg'

const variants: Variant[] = ['primary', 'secondary', 'ghost', 'destructive']
const sizes: Size[] = ['sm', 'md', 'lg']

function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-secondary capitalize">{label}</span>
      <div className="inline-flex rounded-sm border border-border bg-surface-subtle p-0.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-xs px-2.5 py-1 text-xs font-medium capitalize transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
              ${value === option ? 'bg-surface text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-xs font-medium text-secondary">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface
          ${checked ? 'bg-accent' : 'bg-border-strong'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-surface transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  )
}

function generateSnippet({
  variant,
  size,
  disabled,
  label,
}: {
  variant: Variant
  size: Size
  disabled: boolean
  label: string
}) {
  const props = [
    variant !== 'primary' ? `variant="${variant}"` : null,
    size !== 'md' ? `size="${size}"` : null,
    disabled ? 'disabled' : null,
  ].filter(Boolean)

  const propsString = props.length ? ' ' + props.join(' ') : ''
  return `<Button${propsString}>\n  ${label}\n</Button>`
}

export function ButtonConfigurator() {
  const [variant, setVariant] = useState<Variant>('primary')
  const [size, setSize] = useState<Size>('md')
  const [disabled, setDisabled] = useState(false)
  const [label, setLabel] = useState('Add task')
  const [copied, setCopied] = useState(false)

  const snippet = generateSnippet({ variant, size, disabled, label })

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="flex min-h-40 items-center justify-center bg-surface-subtle p-8">
        <Button variant={variant} size={size} disabled={disabled}>
          {label || 'Button'}
        </Button>
      </div>

      <div className="flex flex-col gap-4 border-t border-border bg-surface p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <SegmentedControl label="Variant" options={variants} value={variant} onChange={setVariant} />
        <SegmentedControl label="Size" options={sizes} value={size} onChange={setSize} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="btn-label" className="text-xs font-medium text-secondary">
            Label
          </label>
          <input
            id="btn-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="h-8 w-36 rounded-xs border border-border bg-surface px-2 text-xs text-primary
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>

        <div className="sm:ml-auto">
          <Toggle label="Disabled" checked={disabled} onChange={setDisabled} />
        </div>
      </div>

      <div className="relative border-t border-border bg-canvas">
        <pre className="overflow-x-auto p-4 font-mono text-xs text-secondary">
          <code>{snippet}</code>
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2 right-2 rounded-xs border border-border bg-surface px-2 py-1 text-xs font-medium text-secondary hover:text-primary
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
