import { Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-surface-variant"><p className="text-text-secondary">Loading...</p></div>
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}
