
import { PageHeader } from '../components/layout/PageHeader'
import { Card, CardBody } from '../components/ui'

export default function AuditLogPage() {
  return (
    <>
      <PageHeader
        title="Audit log"
        description="Every action on every request, in order."
      />
      <Card>
        <CardBody className="text-muted">The event timeline will go here.</CardBody>
      </Card>
    </>
  )
}