
import { PageHeader } from '../components/layout/PageHeader'
import { Card, CardBody } from '../components/ui'

export default function SandboxPage() {
  return (
    <>
      <PageHeader
        title="Sandbox"
        description="Type your own request and watch the agent handle it."
      />
      <Card>
        <CardBody className="text-muted">The sandbox form will go here.</CardBody>
      </Card>
    </>
  )
}