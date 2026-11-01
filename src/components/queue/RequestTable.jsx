
import { Link, useNavigate } from 'react-router'
import { Inbox } from 'lucide-react'
import { RiskBadge, StatusBadge } from '../ui'
import { timeAgo } from '../../lib/format'

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-surface-2 text-muted">
        <Inbox size={20} aria-hidden />
      </span>
      <p className="font-semibold">No requests here</p>
      <p className="max-w-xs text-sm text-muted">
        New requests appear once the agent has reviewed them. Try another filter.
      </p>
    </div>
  )
}

const th = 'px-5 py-3 text-left text-xs font-semibold text-muted'

export function RequestTable({ requests }) {
  const navigate = useNavigate()

  if (requests.length === 0) return <EmptyState />

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr className="border-b border-border bg-surface-2/60">
            <th scope="col" className={th}>Request</th>
            <th scope="col" className={th}>Resource</th>
            <th scope="col" className={th}>Risk</th>
            <th scope="col" className={th}>Status</th>
            <th scope="col" className={th}>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr
              key={r.id}
              onClick={() => navigate(`/requests/${r.id}`)}
              className="cursor-pointer border-b border-border transition-colors duration-150 last:border-b-0 hover:bg-surface-2"
            >
              <td className="px-5 py-3.5">
                <Link
                  to={`/requests/${r.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-sm font-semibold text-accent"
                >
                  #{r.id}
                </Link>
                <p className="mt-0.5 text-sm text-muted">{r.requester.name}</p>
              </td>
              <td className="px-5 py-3.5">
                <p className="font-mono text-sm">{r.resource.name}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {r.requestedAccess} access
                </p>
              </td>
              <td className="px-5 py-3.5">
                <RiskBadge level={r.risk} />
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-5 py-3.5 text-sm text-muted whitespace-nowrap">
                {timeAgo(r.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}