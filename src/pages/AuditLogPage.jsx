
import { useEffect, useMemo, useState } from 'react'
import { Loader2, ScrollText } from 'lucide-react'
import { listEvents } from '../api/mock'
import { PageHeader } from '../components/layout/PageHeader'
import { AuditTimeline } from '../components/request/AuditTimeline'
import { Card, CardBody, CardHeader, Field, Input, Select } from '../components/ui'

export default function AuditLogPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [actor, setActor] = useState('')
  const [requestId, setRequestId] = useState('')

  useEffect(() => {
    let cancelled = false
    listEvents()
      .then((data) => !cancelled && setEvents(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  // Everyone who appears in the log, for the dropdown.
  const actors = useMemo(
    () => [...new Set(events.map((e) => e.actor))].sort((a, b) => a.localeCompare(b)),
    [events]
  )

  const visible = useMemo(() => {
    const id = requestId.trim().replace('#', '')
    return events.filter(
      (e) => (!actor || e.actor === actor) && (!id || e.requestId.includes(id))
    )
  }, [events, actor, requestId])

  const filtering = Boolean(actor || requestId.trim())

  return (
    <>
      <PageHeader
        title="Audit log"
        description="Every action on every request, newest first. Events can't be edited or deleted."
      />

      {!loading && !error && (
        <div className="mb-4 grid max-w-xl gap-4 sm:grid-cols-2">
          <Field label="Who did it">
            {(p) => (
              <Select {...p} value={actor} onChange={(e) => setActor(e.target.value)}>
                <option value="">Everyone</option>
                {actors.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Request number">
            {(p) => (
              <Input
                {...p}
                inputMode="numeric"
                placeholder="1042"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
              />
            )}
          </Field>
        </div>
      )}

      <Card>
        <CardHeader
          title="Events"
          description={
            loading || error
              ? undefined
              : filtering
                ? `${visible.length} of ${events.length} events`
                : `${events.length} events`
          }
        />
        <CardBody>
          {loading ? (
            <div
              className="flex items-center justify-center gap-2 py-12 text-muted"
              role="status"
            >
              <Loader2 size={18} className="animate-spin" aria-hidden />
              Loading events
            </div>
          ) : error ? (
            <div className="py-12 text-center" role="alert">
              <p className="font-semibold text-danger">Couldn't load the audit log</p>
              <p className="mt-1 text-sm text-muted">{error}</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-surface-2 text-muted">
                <ScrollText size={20} aria-hidden />
              </span>
              <p className="font-semibold">No events match</p>
              <p className="max-w-xs text-sm text-muted">
                Try a different person or request number, or clear the filters.
              </p>
            </div>
          ) : (
            <AuditTimeline events={visible} showRequestLink bare />
          )}
        </CardBody>
      </Card>
    </>
  )
}