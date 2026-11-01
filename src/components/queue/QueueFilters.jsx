
import { cn } from '../../lib/cn'

export function QueueFilters({ options, value, onChange }) {
  return (
    <div
      role="group"
      aria-label="Filter requests"
      className="inline-flex gap-1 rounded-lg border border-border bg-surface-2 p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex h-8 cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-semibold',
              'transition-colors duration-150',
              active
                ? 'bg-surface text-fg shadow-card'
                : 'text-muted hover:text-fg'
            )}
          >
            {opt.label}
            <span
              className={cn(
                'tabular rounded-full px-1.5 text-xs',
                active ? 'bg-accent-soft text-accent' : 'bg-border text-muted'
              )}
            >
              {opt.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}