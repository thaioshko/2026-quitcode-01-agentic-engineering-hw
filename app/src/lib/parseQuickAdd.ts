export interface ParsedQuickAdd {
  title: string
  dueAt?: number
  estimatedMinutes?: number
}

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function nextWeekday(from: Date, targetDay: number): Date {
  const d = startOfDay(from)
  const diff = (targetDay - d.getDay() + 7) % 7 || 7
  d.setDate(d.getDate() + diff)
  return d
}

/**
 * Lightweight natural-language parsing for Quick Add.
 * Never blocks task creation — on any ambiguity, falls back to the raw title.
 */
export function parseQuickAdd(raw: string, now: Date = new Date()): ParsedQuickAdd {
  let text = raw.trim()
  let dueDate: Date | undefined
  let dueTime: { hours: number; minutes: number } | undefined
  let estimatedMinutes: number | undefined

  // onMatch returns whether the match was accepted — the matched text is only
  // removed from `text` when it was, so a rejected candidate (e.g. an
  // out-of-range hour) never silently eats part of the title.
  const consume = (pattern: RegExp, onMatch: (match: RegExpMatchArray) => boolean) => {
    const match = text.match(pattern)
    if (match && onMatch(match)) {
      text = (text.slice(0, match.index) + text.slice((match.index ?? 0) + match[0].length)).replace(/\s+/g, ' ').trim()
    }
  }

  // Duration: "30 min", "15 minutes", "1 hour", "1h"
  consume(/\b(\d+)\s*(min|mins|minutes)\b/i, (m) => {
    estimatedMinutes = Number(m[1])
    return true
  })
  if (estimatedMinutes === undefined) {
    consume(/\b(\d+)\s*(h|hr|hrs|hour|hours)\b/i, (m) => {
      estimatedMinutes = Number(m[1]) * 60
      return true
    })
  }

  // Time: requires an explicit anchor ("at ", ":mm", or am/pm) so a bare number
  // in the text (e.g. "Buy 2 bottles of milk", "Task 1", "Review PR 7") is
  // never mistaken for a time.
  consume(
    /\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b|\b(\d{1,2}):(\d{2})\s*(am|pm)?\b|\b(\d{1,2})\s*(am|pm)\b/i,
    (m) => {
      const hoursStr = m[1] ?? m[4] ?? m[7]
      const minutesStr = m[2] ?? m[5]
      const meridiem = (m[3] ?? m[6] ?? m[8])?.toLowerCase()
      let hours = Number(hoursStr)
      const minutes = minutesStr ? Number(minutesStr) : 0
      if (meridiem === 'pm' && hours < 12) hours += 12
      if (meridiem === 'am' && hours === 12) hours = 0
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        dueTime = { hours, minutes }
        return true
      }
      return false
    },
  )

  // Date: today / tomorrow / weekday name (optionally "next <weekday>")
  consume(/\btoday\b/i, () => {
    dueDate = startOfDay(now)
    return true
  })
  if (!dueDate) {
    consume(/\btomorrow\b/i, () => {
      const d = startOfDay(now)
      d.setDate(d.getDate() + 1)
      dueDate = d
      return true
    })
  }
  if (!dueDate) {
    consume(new RegExp(`\\b(?:next\\s+)?(${WEEKDAYS.join('|')})\\b`, 'i'), (m) => {
      const targetDay = WEEKDAYS.indexOf(m[1].toLowerCase())
      dueDate = nextWeekday(now, targetDay)
      return true
    })
  }

  let dueAt: number | undefined
  if (dueDate) {
    if (dueTime) {
      dueDate.setHours(dueTime.hours, dueTime.minutes, 0, 0)
    }
    dueAt = dueDate.getTime()
  } else if (dueTime) {
    // A bare time with no date implies today.
    const d = startOfDay(now)
    d.setHours(dueTime.hours, dueTime.minutes, 0, 0)
    dueAt = d.getTime()
  }

  const title = text.replace(/\s+/g, ' ').trim() || raw.trim()

  return { title, dueAt, estimatedMinutes }
}
