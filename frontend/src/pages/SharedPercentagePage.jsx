import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import api from '../services/api'

export default function SharedPercentagePage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const fetchPercentages = useCallback(() => {
    setLoading(true)
    api.get('/shared-finances/percentages')
      .then(res => {
        const data = res.data?.users || []
        setUsers(data.map(u => ({ ...u, percentage: String(u.percentage) })))
      })
      .catch(err => setError('Error al cargar porcentajes.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchPercentages() }, [fetchPercentages])

  const handleChange = (userId, value) => {
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, percentage: value } : u))
  }

  const total = users.reduce((sum, u) => sum + (parseFloat(u.percentage) || 0), 0)
  const isValid = Math.abs(total - 100) < 0.01 && users.every(u => u.percentage !== '' && !isNaN(Number(u.percentage)))

  const handleSave = async () => {
    if (!isValid) return
    setSaving(true)
    setError(null)
    try {
      await api.put('/shared-finances/percentages', {
        users: users.map(u => ({ user_id: u.user_id, percentage: parseFloat(u.percentage) })),
      })
      navigate('/shared-finances')
    } catch (err) {
      if (err.response?.status === 422) {
        const fields = err.response.data?.errors
        if (fields) {
          setError(Object.values(fields).flat().join('\n'))
        } else {
          setError('Error de validación.')
        }
      } else {
        setError('Error al guardar. Intenta de nuevo.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={() => navigate('/shared-finances')}
            className="material-symbols-outlined text-text-secondary hover:text-primary transition-colors text-[20px]"
            title="Volver"
          >
            arrow_back
          </button>
          <h1 className="text-2xl font-bold text-text-primary">
            Ajustar Porcentajes
          </h1>
        </div>
        <p className="text-base text-text-secondary">
          Asigna el porcentaje que cada usuario debe aportar a las finanzas compartidas.
        </p>
      </header>

      {error && (
        <div className="bg-error-bg border border-error-border text-error-text text-sm rounded-lg p-3 mb-4 whitespace-pre-line">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-text-secondary">Cargando usuarios...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          No hay usuarios con salario registrado.
        </div>
      ) : (
        <section className="bg-surface border border-outline rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline bg-surface-variant/30">
            <h2 className="text-base font-semibold">Usuarios</h2>
          </div>
          <div className="divide-y divide-outline">
            {users.map((user) => (
              <div key={user.user_id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary text-sm">
                    {user.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span className="text-sm font-semibold">{user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={user.percentage}
                    onChange={(e) => handleChange(user.user_id, e.target.value)}
                    className="w-20 px-3 py-2 bg-surface border border-outline rounded-lg text-text-primary text-right text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                  <span className="text-sm font-medium text-text-secondary">%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-outline bg-surface-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-secondary">Total:</span>
              <span className={`text-sm font-bold ${isValid ? 'text-primary' : 'text-error'}`}>
                {total.toFixed(2)}%
              </span>
              {!isValid && (
                <span className="text-xs text-error">Debe sumar 100%</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/shared-finances')}
                className="px-4 py-2 text-sm font-medium text-text-secondary border border-outline rounded-lg hover:bg-surface-variant transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid || saving}
                className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {saving && (
                  <svg className="animate-spin h-4 w-4 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
