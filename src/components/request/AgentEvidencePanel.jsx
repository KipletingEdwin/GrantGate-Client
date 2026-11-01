
import { useId, useState } from 'react'
import { ChevronRight, Search, Wrench } from 'lucide-react'
import { Card, CardBody, CardHeader } from '../ui'
import { cn } from '../../lib/cn'

function Json({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-semibold text-muted">{label}</p>
      <pre className="overflow-x-auto rounded-lg border border-border bg-surface-2 p-3 text-xs leading-relaxed">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}

function EvidenceItem({ item }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-start gap-3 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-surface-2"
      >
        <ChevronRight
          size={16}
          aria-hidden
          className={cn(
            'mt-1 shrink-0 text-subtle transition-transform duration-150',
            open && 'rotate-90'
          )}
        />
        <span className="min-w-0">
          <span className="block font-mono text-sm font-semibold">{item.tool}</span>
          <span className="mt-0.5 block text-sm text-muted">{item.summary}</span>
        </span>
      </button>

      {open && (
        <div
          id={panelId}
          className="grid gap-3 border-t border-border bg-surface px-5 py-4 pl-12 md:grid-cols-2"
        >
          <Json label="Input the agent sent" value={item.input} />
          <Json label="Result the tool returned" value={item.output} />
        </div>
      )}
    </li>
  )
}

export function AgentEvidencePanel({ evidence }) {
  return (
    <Card>
      <CardHeader
        title="What the agent looked at"
        description={
          evidence.length
            ? `${evidence.length} read-only lookups. The agent cannot change anything.`
            : 'Read-only lookups the agent makes before proposing.'
        }
        action={
          evidence.length > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <Search size={15} aria-hidden />
              <span className="tabular">{evidence.length}</span>
            </span>
          )
        }
      />
      {evidence.length === 0 ? (
        <CardBody className="flex items-center gap-3 text-muted">
          <Wrench size={18} aria-hidden />
          <p>The agent hasn't started investigating this request.</p>
        </CardBody>
      ) : (
        <ul className="divide-y divide-border">
          {evidence.map((item) => (
            <EvidenceItem key={item.id} item={item} />
          ))}
        </ul>
      )}
    </Card>
  )
}