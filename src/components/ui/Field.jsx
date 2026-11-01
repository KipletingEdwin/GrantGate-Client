
import { useId } from 'react'
import { cn } from '../../lib/cn'

const control =
  'w-full bg-surface text-fg placeholder:text-subtle rounded-lg border ' +
  'border-border-strong transition-colors duration-150 ' +
  'hover:border-subtle focus:border-accent focus:outline-none ' +
  'focus:ring-4 focus:ring-[var(--ring)] ' +
  'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-surface-2'

// Wraps a control with label, hint and error. Children is a render function
// that receives id and aria props so the label stays linked to the control:
//
//   <Field label="Resource" error={errors.resource}>
//     {(p) => <Input {...p} name="resource" />}
//   </Field>
export function Field({ label, hint, error, className, children }) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-fg">
          {label}
        </label>
      )}
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        invalid: Boolean(error),
      })}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ invalid, className, ...props }) {
  return (
    <input
      className={cn(control, 'h-10 px-3', invalid && 'border-danger', className)}
      {...props}
    />
  )
}

export function Textarea({ invalid, className, rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cn(control, 'px-3 py-2 resize-y', invalid && 'border-danger', className)}
      {...props}
    />
  )
}

export function Select({ invalid, className, children, ...props }) {
  return (
    <select
      className={cn(control, 'h-10 px-3 cursor-pointer', invalid && 'border-danger', className)}
      {...props}
    >
      {children}
    </select>
  )
}