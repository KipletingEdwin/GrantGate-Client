import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Loader2 } from 'lucide-react'
import { listRequests } from '../api/mock'
import { PageHeader } from '../components/layout/PageHeader'
import { QueueFilters } from '../components/queue/QueueFilters'
import { RequestTable } from '../components/queue/RequestTable'
import { Button, Card } from '../components/ui'

const PENDING = ['submitted', 'investigating', 'proposed', 'blocked']
const DECIDED = ['approved', 'rejected', 'granted']

export default function QueuePage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    let cancelled = false
    listRequests()
      .then((data) => !cancelled && setRequests(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const options = useMemo(
    () => [
      {
        value: 'pending',
        label: 'Needs attention',
        count: requests.filter((r) => PENDING.includes(r.status)).length,
      },
      {
        value: 'decided',
        label: 'Decided',
        count: requests.filter((r) => DECIDED.includes(r.status)).length,
      },
      { value: 'all', label: 'All', count: requests.length },
    ],
    [requests]
  )

  const visible = useMemo(() => {
    if (filter === 'pending') return requests.filter((r) => PENDING.includes(r.status))
    if (filter === 'decided') return requests.filter((r) => DECIDED.includes(r.status))
    return requests
  }, [requests, filter])

  return (
    <>
      <PageHeader
        title="Review queue"
        description="Access requests waiting for a decision."
        action={
          <Link to="/requests/new">
            <Button>New request</Button>
          </Link>
        }
      />

      {!loading && !error && (
        <div className="mb-4">
          <QueueFilters options={options} value={filter} onChange={setFilter} />
        </div>
      )}

      <Card>
        {loading ? (
          <div
            className="flex items-center justify-center gap-2 py-16 text-muted"
            role="status"
          >
            <Loader2 size={18} className="animate-spin" aria-hidden />
            Loading requests
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center" role="alert">
            <p className="font-semibold text-danger">Couldn't load requests</p>
            <p className="mt-1 text-sm text-muted">{error}</p>
          </div>
        ) : (
          <RequestTable requests={visible} />
        )}
      </Card>
    </>
  )
}