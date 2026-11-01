
import { CheckCircle2, CircleAlert, ShieldQuestion, XCircle } from 'lucide-react'
import { Card, CardBody, CardHeader } from '../ui'
import { cn } from '../../lib/cn'

const RESULT = {
  fail: {
    icon: XCircle,
    label: 'Failed',
    icon_class: 'text-danger',
    row: 'bg-danger-soft',
  },
  warn: {
    icon: CircleAlert,
    label: 'Warning',
    icon_class: 'text-warning',
    row: 'bg-warning-soft',
  },
  pass: {
    icon: CheckCircle2,
    label: 'Passed',
    icon_class: 'text-success',
    row: '',
  },
}

// Failures first, then warnings, then passes.
const ORDER = { fail: 0, warn: 1, pass: 2 }

function summarize(checks) {
  const count = (r) => checks.filter((c) => c.result === r).length
  const parts = []
  if (count('fail')) parts.push(`${count('fail')} failed`)
  if (count('warn')) parts.push(`${count('warn')} ${count('warn') === 1 ? 'warning' : 'warnings'}`)
  if (count('pass')) parts.push(`${count('pass')} passed`)
  return parts.join(', ')
}

function CheckRow({ check }) {
  const r = RESULT[check.result] ?? RESULT.warn
  const Icon = r.icon

  return (
    <li className={cn('flex gap-3 px-5 py-3.5', r.row)}>
      <Icon size={18} className={cn('mt-0.5 shrink-0', r.icon_class)} aria-hidden />
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2">
          <span className="font-mono text-sm font-semibold">{check.rule}</span>
          <span className="sr-only">{r.label}</span>
        </p>
        <p className="mt-0.5 text-sm text-muted">{check.reason}</p>
      </div>
    </li>
  )
}

export function PolicyChecksList({ checks }) {
  const sorted = [...checks].sort(
    (a, b) => (ORDER[a.result] ?? 3) - (ORDER[b.result] ?? 3)
  )

  return (
    <Card>
      <CardHeader
        title="Policy checks"
        description={
          checks.length
            ? summarize(checks)
            : 'Rules the proposal must satisfy before it can be approved.'
        }
      />
      {checks.length === 0 ? (
        <CardBody className="flex items-center gap-3 text-muted">
          <ShieldQuestion size={18} aria-hidden />
          <p>Policy checks run once the agent has made a proposal.</p>
        </CardBody>
      ) : (
        <ul className="divide-y divide-border">
          {sorted.map((check) => (
            <CheckRow key={check.rule} check={check} />
          ))}
        </ul>
      )}
    </Card>
  )
}