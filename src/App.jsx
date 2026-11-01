
import { Navigate, Route, Routes } from 'react-router'
import { AppShell } from './components/layout/AppShell'
import LoginPage from './pages/LoginPage'
import QueuePage from './pages/QueuePage'
import RequestDetailPage from './pages/RequestDetailPage'
import NewRequestPage from './pages/NewRequestPage'
import AuditLogPage from './pages/AuditLogPage'
import SandboxPage from './pages/SandboxPage'

export default function App() {
  return (
    <Routes>
      {/* Public: no sidebar or header */}
      <Route path="/login" element={<LoginPage />} />

      {/* Everything inside the app shell */}
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/requests" replace />} />
        <Route path="/requests" element={<QueuePage />} />
        <Route path="/requests/new" element={<NewRequestPage />} />
        <Route path="/requests/:id" element={<RequestDetailPage />} />
        <Route path="/audit" element={<AuditLogPage />} />
        <Route path="/sandbox" element={<SandboxPage />} />
      </Route>

      {/* Anything unknown goes back to the queue */}
      <Route path="*" element={<Navigate to="/requests" replace />} />
    </Routes>
  )
}