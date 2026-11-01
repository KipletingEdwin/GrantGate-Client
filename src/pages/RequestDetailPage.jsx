
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { currentUser, getRequest, submitDecision } from '../api/mock'
import { PageHeader } from '../components/layout/PageHeader'
import { AgentEvidencePanel } from '../components/request/AgentEvidencePanel'
import { AuditTimeline } from '../components/request/AuditTimeline'
import { PolicyChecksList } from '../components/request/PolicyChecksList'
import { ProposalCard } from '../components/request/ProposalCard'
import { RequestSummary } from '../components/request/RequestSummary'
import { ReviewActions } from '../components/request/ReviewActions'
import { StatusBadge } from '../components/ui'

function BackLink() {
  return (
    <Link
      to="/requests"
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg"
    >
      <ArrowLeft size={16} aria-hidden />
      Back to queue
    </Link>
  )
}

export default function RequestDetailPage() {
  const { id } = useParams()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setRequest(null)

    getRequest(id)
      .then((data) => !cancelled && setRequest(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [id])

  const handleDecide = useCallback(
    async (input) => {
      const updated = await submitDecision(id, input)
      // Copy so React sees a new object and re-renders.
      setRequest({ ...updated })
    },
    [id]
  )

  if (loading) {
    return (
      <>
        <BackLink />
        <div
          className="flex items-center justify-center gap-2 py-24 text-muted"
          role="status"
        >
          <Loader2 size={18} className="animate-spin" aria-hidden />
          Loading request
        </div>
      </>
    )
  }

  if (error || !request) {
    return (
      <>
        <BackLink />
        <div className="py-24 text-center" role="alert">
          <p className="font-semibold text-danger">Couldn't load this request</p>
          <p className="mt-1 text-sm text-muted">{error}</p>
        </div>
      </>
    )
  }

  return (
    <>
      <BackLink />
      <PageHeader
        title={`Request #${request.id}`}
        description={`${request.requester.name} · ${request.resource.name}`}
        action={<StatusBadge status={request.status} />}
      />

      <div className="grid items-start gap-6 lg:grid-cols-5">
        {/* Facts: what was asked and what the agent saw */}
        <div className="space-y-6 lg:col-span-3">
          <RequestSummary request={request} />
          <AgentEvidencePanel evidence={request.evidence} />
          <AuditTimeline events={request.events} />
        </div>

        {/* Decision: proposal, rules, actions */}
        <div className="space-y-6 lg:col-span-2">
          <ProposalCard
            proposal={request.proposal}
            requestedAccess={request.requestedAccess}
          />
          <PolicyChecksList checks={request.policyChecks} />
          <ReviewActions
            request={request}
            reviewer={currentUser}
            onDecide={handleDecide}
          />
        </div>
      </div>
    </>
  )
}