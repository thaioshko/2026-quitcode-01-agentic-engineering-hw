export function TaskCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={checked ? `Mark "${label}" as not done` : `Mark "${label}" as done`}
      onClick={onChange}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      <span
        aria-hidden
        className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors
          ${checked ? 'border-accent bg-accent' : 'border-border-strong bg-transparent'}`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-inverse" fill="none">
            <path
              d="M2.5 6.2 4.8 8.5 9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </button>
  )
}
