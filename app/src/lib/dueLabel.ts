const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function hasTime(date: Date): boolean {
  return date.getHours() !== 0 || date.getMinutes() !== 0
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function dueLabel(dueAt: number, now: Date = new Date()): { label: string; overdue: boolean } {
  const due = new Date(dueAt)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const time = hasTime(due) ? ` · ${formatTime(due)}` : ''

  if (isSameDay(due, today)) {
    // An all-day "today" task isn't overdue until the day is over; a timed one is overdue once its time passes.
    const overdueToday = hasTime(due) && dueAt < now.getTime()
    return { label: `Today${time}`, overdue: overdueToday }
  }
  if (isSameDay(due, tomorrow)) return { label: `Tomorrow${time}`, overdue: false }
  const overdue = due.getTime() < today.getTime()
  return { label: `${WEEKDAY_LABELS[due.getDay()]}${time}`, overdue }
}
