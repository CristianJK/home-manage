import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { Header } from './components/Header'
import { AuthProvider, useAuth } from './context/AuthContext'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))

function GuestRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100"><p className="text-gray-500">Loading...</p></div>
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100"><p className="text-gray-500">Loading...</p></div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <Header />
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        {children}
      </Suspense>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={
          <GuestRoute>
            <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
              <LoginPage />
            </Suspense>
          </GuestRoute>
        } />
        <Route path="/*" element={
          <AppLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
            </Routes>
          </AppLayout>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App
