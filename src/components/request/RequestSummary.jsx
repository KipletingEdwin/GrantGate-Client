
import { ShieldAlert } from 'lucide-react'
import { Card, CardBody, CardHeader, RiskBadge } from '../ui'
import { formatDateTime } from '../../lib/format'

const EMPLOYMENT = {
  full_time: 'Full-time employee',
  contractor: 'Contractor',
}

function Fact({ label, children }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold">{children}</dd>
    </div>
  )
}

export function RequestSummary({ request }) {
  const { requester, resource, requestedAccess, justification, risk, createdAt } = request

  return (
    <Card>
      <CardHeader
        title="Request"
        description={`Submitted ${formatDateTime(createdAt)}`}
        action={<RiskBadge level={risk} />}
      />
      <CardBody className="space-y-5">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Fact label="Requester">{requester.name}</Fact>
          <Fact label="Team">{requester.team}</Fact>
          <Fact label="Employment">{EMPLOYMENT[requester.employment]}</Fact>
          <Fact label="Role">
            <span className="capitalize">{requester.role}</span>
          </Fact>
          <Fact label="Resource">
            <span className="font-mono text-sm">{resource.name}</span>
          </Fact>
          <Fact label="Access requested">
            <span className="capitalize">{requestedAccess}</span>
          </Fact>
        </dl>

        <p className="text-sm text-subtle">
          Requester details come from the company directory, not from what they wrote below.
        </p>

        <figure className="rounded-lg border border-border bg-surface-2 p-4">
          <figcaption className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-muted">
            <ShieldAlert size={15} aria-hidden />
            Written by the requester. Not verified.
          </figcaption>
          <blockquote className="whitespace-pre-wrap wrap-break-word">
            {justification}
          </blockquote>
        </figure>
      </CardBody>
    </Card>
  )
}