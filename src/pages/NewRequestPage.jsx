
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Info } from 'lucide-react'
import { createRequest, currentUser, listResources } from '../api/mock'
import { PageHeader } from '../components/layout/PageHeader'
import {
  Button,
  Card,
  CardBody,
  Field,
  Select,
  Textarea,
} from '../components/ui'

const MIN = 20
const MAX = 1000

const ACCESS_HINTS = {
  read: 'View data only.',
  write: 'Change data. Needs an expiry date when approved.',
  admin: 'Manage the resource and its permissions. Rarely approved.',
}

export default function NewRequestPage() {
  const navigate = useNavigate()

  const [resources, setResources] = useState([])
  const [resourceName, setResourceName] = useState('')
  const [access, setAccess] = useState('read')
  const [justification, setJustification] = useState('')

  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    listResources().then((data) => !cancelled && setResources(data))
    return () => {
      cancelled = true
    }
  }, [])

  const length = justification.trim().length

  function validate() {
    const next = {}
    if (!resourceName) next.resourceName = 'Choose a resource.'
    if (length < MIN) next.justification = `Add at least ${MIN} characters. A reviewer will read this.`
    if (length > MAX) next.justification = `Keep it under ${MAX} characters.`
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return

    setSaving(true)
    try {
      const created = await createRequest({ resourceName, access, justification })
      navigate(`/requests/${created.id}`)
    } catch (err) {
      setSubmitError(err.message || 'Could not submit the request. Try again.')
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        title="New request"
        description="Tell us what you need access to and why."
      />

      <div className="max-w-2xl">
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <Field label="Resource" error={errors.resourceName}>
                {(p) => (
                  <Select
                    {...p}
                    value={resourceName}
                    onChange={(e) => setResourceName(e.target.value)}
                  >
                    <option value="">Select a resource</option>
                    {resources.map((r) => (
                      <option key={r.name} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>

              <Field label="Access level" hint={ACCESS_HINTS[access]}>
                {(p) => (
                  <Select
                    {...p}
                    value={access}
                    onChange={(e) => setAccess(e.target.value)}
                  >
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                    <option value="admin">Admin</option>
                  </Select>
                )}
              </Field>

              <div>
                <Field
                  label="Why do you need this?"
                  hint="Name the task or project, and how long you'll need it."
                  error={errors.justification}
                >
                  {(p) => (
                    <Textarea
                      {...p}
                      rows={5}
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder="For example: I need to load cleaned revenue tables for the Q4 report."
                    />
                  )}
                </Field>
                <p
                  className={`tabular mt-1.5 text-right text-xs ${
                    length > MAX ? 'text-danger' : 'text-subtle'
                  }`}
                >
                  {length} / {MAX}
                </p>
              </div>

              <p className="flex gap-2 rounded-lg bg-surface-2 p-3 text-sm text-muted">
                <Info size={16} className="mt-0.5 shrink-0" aria-hidden />
                <span>
                  Submitting as <strong className="text-fg">{currentUser.name}</strong> ({currentUser.team}).
                  Your role and team come from the company directory, so there's no need to mention them.
                </span>
              </p>

              {submitError && (
                <p role="alert" className="text-sm text-danger">
                  {submitError}
                </p>
              )}

              <div className="flex gap-2">
                <Button type="submit" loading={saving}>
                  Submit request
                </Button>
                <Button
                  variant="ghost"
                  disabled={saving}
                  onClick={() => navigate('/requests')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  )
}