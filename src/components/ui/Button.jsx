
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

const variants = {
  primary:
    'bg-accent text-accent-fg hover:bg-accent-hover border border-transparent',
  secondary:
    'bg-surface text-fg border border-border-strong hover:bg-surface-2',
  ghost:
    'bg-transparent text-muted border border-transparent hover:bg-surface-2 hover:text-fg',
  danger:
    'bg-danger text-accent-fg border border-transparent hover:opacity-90',
  success:
    'bg-success text-accent-fg border border-transparent hover:opacity-90',
}

const sizes = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
  icon: 'h-9 w-9 justify-center',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  children,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center font-semibold rounded-lg cursor-pointer select-none',
        'transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden />}
      {children}
    </button>
  )
}