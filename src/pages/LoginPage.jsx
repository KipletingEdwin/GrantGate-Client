
import { useNavigate } from 'react-router'
import { ShieldCheck } from 'lucide-react'
import { Button, Card, CardBody, Field, Input } from '../components/ui'

export default function LoginPage() {
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/requests')
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-fg">
            <ShieldCheck size={24} aria-hidden />
          </span>
          <h1 className="text-2xl">Sign in to GrantGate</h1>
        </div>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Email">
                {(p) => (
                  <Input {...p} type="email" placeholder="you@company.com" required />
                )}
              </Field>
              <Field label="Password">
                {(p) => <Input {...p} type="password" required />}
              </Field>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}