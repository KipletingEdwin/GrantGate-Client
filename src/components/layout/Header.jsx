
import { Menu } from 'lucide-react'
import { Button } from '../ui/Button'
import { ThemeToggle } from '../ui/ThemeToggle'

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export function Header({ user, onMenuClick }) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </Button>

      {/* Pushes everything else to the right on desktop */}
      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {user && (
          <div className="flex items-center gap-2.5 rounded-lg border border-border py-1 pl-1 pr-3">
            <span
              className="grid h-7 w-7 place-items-center rounded-md bg-accent-soft text-xs font-bold text-accent"
              aria-hidden
            >
              {initials(user.name)}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-muted capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}