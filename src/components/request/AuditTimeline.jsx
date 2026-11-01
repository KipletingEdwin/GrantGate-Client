
import { Link } from 'react-router'
import {
  Bot,
  CheckCircle2,
  FileText,
  KeyRound,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import { Card, CardBody, CardHeader } from '../ui'
import { formatDateTime } from '../../lib/format'
import { cn } from '../../lib/cn'

// One icon and color per event type. Unknown types fall back to "other".
const TYPES = {
  'request.submitted': { icon: FileText, tone: 'bg-surface-2 text-muted' },
  'agent.investigated': { icon: Bot, tone: 'bg-info-soft text-info' },
  'proposal.created': { icon: Bot, tone: 'bg-info-soft text-info' },
  'policy.evaluated': { icon: ShieldCheck, tone: 'bg-accent-soft text-accent' },
  'policy.overrode': { icon: ShieldAlert, tone: 'bg-blocked-soft text-blocked' },
  'review.approved': { icon: CheckCircle2, tone: 'bg-success-soft text-success' },
  'review.rejected': { icon: XCircle, tone: 'bg-danger-soft text-danger' },
  'grant.recorded': { icon: KeyRound, tone: 'bg-success-soft text-success' },
  other: { icon: ScrollText, tone: 'bg-surface-2 text-muted' },
}

function TimelineEvent({ event, isLast, showRequestLink }) {
  const t = TYPES[event.type] ?? TYPES.other
  const Icon = t.icon

  return (
    <li className="relative flex gap-3 pb-6 last:pb-0">
      {/* The line connecting this event to the next one */}
      {!isLast && (
        <span
          className="absolute left-[15px] top-8 bottom-0 w-px bg-border"
          aria-hidden
        />
      )}

      <span
        className={cn(
          'relative grid h-8 w-8 shrink-0 place-items-center rounded-full',
          t.tone
        )}
      >
        <Icon size={15} aria-hidden />
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm">
          <span className="font-semibold">{event.actor}</span>{' '}
          <span className="text-muted">{event.message}</span>
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-subtle">
          <time dateTime={event.createdAt}>{formatDateTime(event.createdAt)}</time>
          <span className="font-mono">{event.type}</span>
          {showRequestLink && (
            <Link
              to={`/requests/${event.requestId}`}
              className="font-mono font-semibold text-accent"
            >
              #{event.requestId}
            </Link>
          )}
        </p>
      </div>
    </li>
  )
}

export function AuditTimeline({ events, showRequestLink = false, bare = false }) {
  const list = (
    <ol>
      {events.map((event, i) => (
        <TimelineEvent
          key={event.id}
          event={event}
          isLast={i === events.length - 1}
          showRequestLink={showRequestLink}
        />
      ))}
    </ol>
  )

  // `bare` returns just the list, for pages that provide their own card.
  if (bare) return list

  return (
    <Card>
      <CardHeader
        title="History"
        description="Recorded events. They can't be edited or deleted."
      />
      <CardBody>
        {events.length === 0 ? (
          <p className="text-muted">Nothing has happened yet.</p>
        ) : (
          list
        )}
      </CardBody>
    </Card>
  )
}