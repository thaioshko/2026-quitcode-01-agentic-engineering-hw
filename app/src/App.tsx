import { useEffect, useState, type FormEvent } from 'react'
import { Button } from './components/Button'
import { Field } from './components/Field'
import { LeadBadge } from './components/LeadBadge'

interface Lead {
  id: string
  name: string
  email: string
  budget: number
  message: string
  createdAt: number
}

const STORAGE_KEY = 'lead-desk:leads'

function isHot(lead: Pick<Lead, 'budget' | 'message'>) {
  return lead.budget >= 1000 || /urgent/i.test(lead.message)
}

function loadLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Lead[]) : []
  } catch {
    return []
  }
}

function App() {
  const [leads, setLeads] = useState<Lead[]>(() => loadLeads())
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
  }, [leads])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const lead: Lead = {
      id: crypto.randomUUID(),
      name,
      email,
      budget: Number(budget) || 0,
      message,
      createdAt: Date.now(),
    }
    setLeads((prev) => [lead, ...prev])
    setName('')
    setEmail('')
    setBudget('')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-canvas text-primary">
      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-12">
        <header>
          <h1 className="text-2xl font-semibold text-primary">Lead Desk</h1>
          <p className="mt-1 text-sm text-secondary">Capture and triage incoming leads.</p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-md border border-border bg-surface p-4">
          <div className="grid grid-cols-2 gap-4">
            <Field id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Field id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Field
            id="budget"
            label="Budget ($)"
            type="number"
            min={0}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <Field
            id="message"
            label="Message"
            multiline
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What do they need? Mention 'urgent' if it's time-sensitive."
          />
          <div>
            <Button type="submit">Add lead</Button>
          </div>
        </form>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-secondary">
              {leads.length} lead{leads.length === 1 ? '' : 's'}
            </h2>
            {leads.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setLeads([])}>
                Clear all
              </Button>
            )}
          </div>

          {leads.length === 0 ? (
            <p className="rounded-md border border-border bg-surface-subtle p-4 text-sm text-secondary">
              No leads yet — submit the form above to add one.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-border rounded-md border border-border bg-surface">
              {leads.map((lead) => (
                <li key={lead.id} className="flex flex-col gap-1 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-primary">{lead.name}</span>
                    <LeadBadge hot={isHot(lead)} />
                  </div>
                  <div className="text-xs text-secondary">
                    {lead.email} · ${lead.budget.toLocaleString()}
                  </div>
                  {lead.message && <p className="text-sm text-primary">{lead.message}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
