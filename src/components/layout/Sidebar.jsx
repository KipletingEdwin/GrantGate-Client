
import { NavLink, useLocation } from 'react-router'
import {
  FlaskConical,
  Inbox,
  PlusCircle,
  ScrollText,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '../../lib/cn'

const items = [
  {
    to: '/requests',
    label: 'Review queue',
    icon: Inbox,
    // Highlight for the list and for request detail pages, but not "new".
    isActive: (path) => path.startsWith('/requests') && path !== '/requests/new',
  },
  { to: '/requests/new', label: 'New request', icon: PlusCircle },
  { to: '/audit', label: 'Audit log', icon: ScrollText },
  { to: '/sandbox', label: 'Sandbox', icon: FlaskConical },
]

export function Sidebar({ className, onNavigate }) {
  const { pathname } = useLocation()

  return (
    <aside
      className={cn(
        'flex w-60 shrink-0 flex-col border-r border-border bg-surface',
        className
      )}
    >
      <div className="flex h-14 items-center gap-2.5 px-5 border-b border-border">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-fg">
          <ShieldCheck size={18} aria-hidden />
        </span>
        <span className="text-base font-bold tracking-tight">GrantGate</span>
      </div>

      <nav aria-label="Main" className="flex flex-col gap-1 p-3">
        {items.map(({ to, label, icon: Icon, isActive }) => (
          <NavLink
            key={to}
            to={to}
            end
            onClick={onNavigate}
            className={({ isActive: routerActive }) => {
              const active = isActive ? isActive(pathname) : routerActive
              return cn(
                'flex items-center gap-3 rounded-lg px-3 h-9 text-sm font-semibold',
                'transition-colors duration-150',
                active
                  ? 'bg-accent-soft text-accent'
                  : 'text-muted hover:bg-surface-2 hover:text-fg'
              )
            }}
          >
            <Icon size={18} aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>

      <p className="mt-auto px-5 py-4 text-xs text-subtle">
        Sandbox data only. No real access is granted.
      </p>
    </aside>
  )
}