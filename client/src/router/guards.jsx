import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

function Loading() {
  return <div className="grid min-h-svh place-items-center text-muted-foreground">Loading...</div>
}

// Only logged-in users. Others go to /login.
export function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

// Only guests (login/register). Logged-in users go to /dashboard.
export function PublicRoute() {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}
