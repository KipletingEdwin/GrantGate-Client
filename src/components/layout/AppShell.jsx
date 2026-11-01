
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

// Temporary. This will come from the login / JWT later.
const demoUser = { name: 'Maya Chen', role: 'reviewer' }

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the drawer after navigating.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Close the drawer with the Escape key.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <Sidebar className="hidden md:flex sticky top-0 h-screen" />

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-30 bg-black/40"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <Sidebar
            className="fixed inset-y-0 left-0 z-40 shadow-pop"
            onNavigate={() => setMenuOpen(false)}
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={demoUser} onMenuClick={() => setMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}