import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-surface-variant">
      <header className="bg-surface shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">Home Manage</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">{user?.name}</span>
            <button
              onClick={logout}
              className="text-sm text-error hover:text-error-text"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-text-primary">
            Welcome, {user?.name}
          </h2>
          <p className="text-text-secondary text-sm">{user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-text-secondary">Tasks</h3>
            <p className="text-2xl font-bold text-text-primary mt-1">—</p>
          </div>
          <div className="bg-surface rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-text-secondary">Shared Expenses</h3>
            <p className="text-2xl font-bold text-text-primary mt-1">—</p>
          </div>
          <div className="bg-surface rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-text-secondary">Personal Expenses</h3>
            <p className="text-2xl font-bold text-text-primary mt-1">—</p>
          </div>
          <div className="bg-surface rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-text-secondary">Savings</h3>
            <p className="text-2xl font-bold text-text-primary mt-1">—</p>
          </div>
        </div>
      </main>
    </div>
  )
}
