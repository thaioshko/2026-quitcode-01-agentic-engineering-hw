import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface BaseProps {
  label: string
  id: string
}

type InputProps = BaseProps & { multiline?: false } & InputHTMLAttributes<HTMLInputElement>
type TextareaProps = BaseProps & { multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>

const fieldClasses =
  'w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'

export function Field(props: InputProps | TextareaProps) {
  const { label, id, multiline, ...rest } = props

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-secondary">
        {label}
      </label>
      {multiline ? (
        <textarea id={id} className={`${fieldClasses} min-h-20 resize-y`} {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input id={id} className={fieldClasses} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
    </div>
  )
}
