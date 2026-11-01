
import { Hourglass, ShieldAlert } from 'lucide-react'
import { Card, CardBody, CardHeader, DecisionBadge } from '../ui'
import { formatDate } from '../../lib/format'

function Waiting() {
  return (
    <Card>
      <CardHeader title="Agent proposal" />
      <CardBody className="flex items-center gap-3 text-muted">
        <Hourglass size={18} aria-hidden />
        <p>The agent hasn't proposed a decision yet.</p>
      </CardBody>
    </Card>
  )
}

export function ProposalCard({ proposal, requestedAccess }) {
  if (!proposal) return <Waiting />

  const { decision, accessLevel, expiresAt, rationale, confidence, overriddenByPolicy } = proposal
  const percent = Math.round(confidence * 100)
  const narrowed = decision === 'narrow' && accessLevel !== requestedAccess

  return (
    <Card>
      <CardHeader
        title="Agent proposal"
        description="A suggestion only. A reviewer makes the decision."
        action={<DecisionBadge decision={decision} />}
      />

      {overriddenByPolicy && (
        <div
          role="note"
          className="flex gap-3 border-b border-border bg-blocked-soft px-5 py-3 text-blocked"
        >
          <ShieldAlert size={18} className="mt-0.5 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Overridden by policy</p>
            <p className="text-sm">
              The agent's first answer broke a policy rule, so it was replaced with the decision below.
            </p>
          </div>
        </div>
      )}

      <CardBody className="space-y-5">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">Access to grant</dt>
            <dd className="mt-0.5 font-semibold capitalize">
              {accessLevel ?? 'None'}
              {narrowed && (
                <span className="ml-2 text-sm font-normal text-muted">
                  (requested {requestedAccess})
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Expires</dt>
            <dd className="mt-0.5 font-semibold">
              {accessLevel ? (expiresAt ? formatDate(expiresAt) : 'No expiry') : 'Not applicable'}
            </dd>
          </div>
        </dl>

        <div>
          <p className="text-sm text-muted">Reasoning</p>
          <p className="mt-1 max-w-prose">{rationale}</p>
        </div>

        <div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted">Agent confidence</span>
            <span className="tabular font-semibold">{percent}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Agent confidence"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2"
          >
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-sm text-subtle">
            Confidence is the agent's own estimate. Policy checks do not depend on it.
          </p>
        </div>
      </CardBody>
    </Card>
  )
}