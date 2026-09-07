type Context = 'work' | 'personal' | 'study'

const dotClass: Record<Context, string> = {
  work: 'bg-work',
  personal: 'bg-personal',
  study: 'bg-study',
}

export function ProjectLabel({ context, name }: { context: Context; name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-secondary">
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dotClass[context]}`} />
      {name}
    </span>
  )
}
