import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { Header } from './components/Header'
import { SideNavBar } from './components/sideNavBar'
import { AuthProvider, useAuth } from './context/AuthContext'
import GuestRoute from './components/GuestRoute'
import ProtectedRoute from './components/ProtectedRoute'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))

function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <SideNavBar />
      <div className="md:ml-64">
        <Header />
        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
          {children}
        </Suspense>
      </div>
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
