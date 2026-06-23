import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => !!localStorage.getItem('access_token'))

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      api.get('/user')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('access_token')
        })
        .finally(() => setLoading(false))
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('access_token', res.data.access_token)
    setUser(res.data.user)
    return res.data
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('access_token')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
