
import { useState } from 'react'
import { Ban, CheckCircle2, Lock, Pencil, XCircle } from 'lucide-react'
import { Button, Card, CardBody, CardHeader, Field, Input, Select, Textarea } from '../ui'
import { formatDateTime } from '../../lib/format'

const LEVELS = ['read', 'write', 'admin']

function Notice({ icon: Icon, children }) {
  return (
    <CardBody className="flex items-start gap-3 text-muted">
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden />
      <p>{children}</p>
    </CardBody>
  )
}

// Shown once a decision has been recorded.
function Decided({ review }) {
  const approved = review.decision === 'approved'
  return (
    <Card>
      <CardHeader
        title="Decision"
        description={`Recorded ${formatDateTime(review.decidedAt)}`}
      />
      <CardBody className="space-y-2">
        <p className="flex items-center gap-2 font-semibold">
          {approved ? (
            <CheckCircle2 size={18} className="text-success" aria-hidden />
          ) : (
            <XCircle size={18} className="text-danger" aria-hidden />
          )}
          {approved
            ? `Approved: ${review.accessLevel} access`
            : 'Rejected'}
        </p>
        {review.note && <p className="text-muted">{review.note}</p>}
      </CardBody>
    </Card>
  )
}

export function ReviewActions({ request, reviewer, onDecide }) {
  const { proposal, policyChecks, status, review, requester, requestedAccess } = request

  const [mode, setMode] = useState(null) // 'approve' | 'edit' | 'reject'
  const [note, setNote] = useState('')
  const [level, setLevel] = useState(proposal?.accessLevel ?? 'read')
  const [expiry, setExpiry] = useState(proposal?.expiresAt ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  if (review) return <Decided review={review} />

  // Reasons the reviewer can't act. The server must enforce all of these too.
  if (!proposal) {
    return (
      <Card>
        <CardHeader title="Your decision" />
        <Notice icon={Lock}>
          You can decide once the agent has made a proposal.
        </Notice>
      </Card>
    )
  }

  const selfRequest = requester.id === reviewer.id
  if (selfRequest) {
    return (
      <Card>
        <CardHeader title="Your decision" />
        <Notice icon={Lock}>
          You can't decide your own request. Another reviewer needs to handle it.
        </Notice>
      </Card>
    )
  }

  const policyFailed = policyChecks.some((c) => c.result === 'fail')
  const isDenial = proposal.decision === 'deny'
  const allowedLevels = LEVELS.slice(0, LEVELS.indexOf(requestedAccess) + 1)
  const needsExpiry = level !== 'read'

  function open(next) {
    setMode(next)
    setError(null)
    setNote('')
    setLevel(proposal.accessLevel ?? 'read')
    setExpiry(proposal.expiresAt ?? '')
  }

  async function submit(e) {
    e.preventDefault()
    setError(null)

    const rejecting = mode === 'reject'
    if (rejecting && !note.trim()) {
      setError('Add a short reason so the requester knows why.')
      return
    }
    if (mode === 'edit' && needsExpiry && !expiry) {
      setError('Write and admin access need an expiry date.')
      return
    }

    const payload = rejecting
      ? { decision: 'rejected', accessLevel: null, expiresAt: null, note: note.trim() }
      : {
          decision: 'approved',
          accessLevel: mode === 'edit' ? level : proposal.accessLevel,
          expiresAt: mode === 'edit' ? expiry || null : proposal.expiresAt,
          note: note.trim(),
        }

    setSaving(true)
    try {
      await onDecide(payload)
    } catch (err) {
      setError(err.message || 'Could not save the decision. Try again.')
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader
        title="Your decision"
        description="Policy is checked again when you confirm."
      />

      {policyFailed && !isDenial && (
        <p className="border-b border-border bg-danger-soft px-5 py-3 text-sm text-danger">
          A policy check failed, so this can't be approved. You can still reject it.
        </p>
      )}

      <CardBody className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {isDenial ? (
            <Button variant="danger" onClick={() => open('reject')}>
              <Ban size={16} aria-hidden />
              Confirm denial
            </Button>
          ) : (
            <>
              <Button
                variant="success"
                disabled={policyFailed}
                onClick={() => open('approve')}
              >
                <CheckCircle2 size={16} aria-hidden />
                Approve
              </Button>
              <Button
                variant="secondary"
                disabled={policyFailed}
                onClick={() => open('edit')}
              >
                <Pencil size={16} aria-hidden />
                Edit and approve
              </Button>
              <Button variant="danger" onClick={() => open('reject')}>
                <XCircle size={16} aria-hidden />
                Reject
              </Button>
            </>
          )}
        </div>

        {mode && (
          <form
            onSubmit={submit}
            className="space-y-4 rounded-lg border border-border bg-surface-2 p-4"
          >
            {mode === 'edit' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Access level"
                  hint={`Can't be higher than the ${requestedAccess} access requested.`}
                >
                  {(p) => (
                    <Select
                      {...p}
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                    >
                      {allowedLevels.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
                <Field
                  label="Expires"
                  hint={needsExpiry ? 'Required for write and admin.' : 'Optional for read.'}
                >
                  {(p) => (
                    <Input
                      {...p}
                      type="date"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                  )}
                </Field>
              </div>
            )}

            <Field
              label={mode === 'reject' ? 'Reason' : 'Note (optional)'}
              error={error}
            >
              {(p) => (
                <Textarea
                  {...p}
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={
                    mode === 'reject'
                      ? 'Why is this being rejected?'
                      : 'Anything the requester or auditors should know'
                  }
                />
              )}
            </Field>

            <div className="flex gap-2">
              <Button
                type="submit"
                variant={mode === 'reject' ? 'danger' : 'success'}
                loading={saving}
              >
                {mode === 'reject'
                  ? isDenial ? 'Confirm denial' : 'Reject request'
                  : mode === 'edit' ? 'Approve with changes' : 'Approve as proposed'}
              </Button>
              <Button
                variant="ghost"
                disabled={saving}
                onClick={() => setMode(null)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardBody>
    </Card>
  )
}