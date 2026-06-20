import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import api from '../services/api'
import { SavingCard } from '../components/SavingCard'
import { SavingModal } from '../components/SavingModal'
import { PersonalExpenseTable } from '../components/PersonalExpenseTable'
import { PersonalExpenseModal } from '../components/PersonalExpenseModal'

export default function SavingsPage() {
  const [savings, setSavings] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSaving, setEditingSaving] = useState(null)
  const [serverError, setServerError] = useState(null)

  const [expenses, setExpenses] = useState([])
  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [expenseServerError, setExpenseServerError] = useState(null)

  const navigate = useNavigate()

  const fetchExpenses = useCallback(() => {
    api.get('/personal-expense')
      .then(res => setExpenses(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error('Error fetching expenses:', err))
  }, [])

  const fetchSavings = useCallback(() => {
    api.get('/saving-goals')
      .then(res => setSavings(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error('Error fetching savings:', err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchSavings(); fetchExpenses() }, [fetchSavings, fetchExpenses])

  const openCreate = () => {
    setEditingSaving(null)
    setServerError(null)
    setModalOpen(true)
  }

  const openEdit = (saving) => {
    setEditingSaving(saving)
    setServerError(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingSaving(null)
    setServerError(null)
  }

  const handleSubmit = async (data) => {
    setServerError(null)
    const payload = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === '' ? null : key === 'target_amount' || key === 'current_amount' ? Number(value) : value,
      ]),
    )
    try {
      if (editingSaving) {
        const res = await api.patch(`/saving-goals/${editingSaving.id}`, payload)
        setSavings(prev => prev.map(s => s.id === editingSaving.id ? res.data : s))
      } else {
        const res = await api.post('/saving-goals', payload)
        setSavings(prev => [...prev, res.data])
      }
      closeModal()
    } catch (err) {
      if (err.response?.status === 422) {
        const fields = err.response.data?.errors
        if (fields) {
          setServerError(Object.values(fields).flat().join('\n'))
        } else {
          setServerError('Error de validación. Revisa los campos.')
        }
      } else {
        setServerError('Error al guardar la meta. Intenta de nuevo.')
      }
    }
  }

  const openCreateExpense = () => {
    setEditingExpense(null)
    setExpenseServerError(null)
    setExpenseModalOpen(true)
  }

  const openEditExpense = (expense) => {
    setEditingExpense(expense)
    setExpenseServerError(null)
    setExpenseModalOpen(true)
  }

  const closeExpenseModal = () => {
    setExpenseModalOpen(false)
    setEditingExpense(null)
    setExpenseServerError(null)
  }

  const handleExpenseSubmit = async (data) => {
    setExpenseServerError(null)
    const payload = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        key === 'amount' ? Number(value) : value,
      ]),
    )
    try {
      if (editingExpense) {
        const res = await api.patch(`/personal-expense/${editingExpense.id}`, payload)
        setExpenses(prev => prev.map(e => e.id === editingExpense.id ? res.data : e))
      } else {
        const res = await api.post('/personal-expense', payload)
        setExpenses(prev => [...prev, res.data])
      }
      closeExpenseModal()
    } catch (err) {
      if (err.response?.status === 422) {
        const fields = err.response.data?.errors
        if (fields) {
          setExpenseServerError(Object.values(fields).flat().join('\n'))
        } else {
          setExpenseServerError('Error de validación. Revisa los campos.')
        }
      } else {
        setExpenseServerError('Error al guardar el gasto. Intenta de nuevo.')
      }
    }
  }

  const handleExpenseDelete = async (expense) => {
    if (!window.confirm(`¿Eliminar "${expense.concept}"?`)) return
    try {
      await api.delete(`/personal-expense/${expense.id}`)
      setExpenses(prev => prev.filter(e => e.id !== expense.id))
    } catch (err) {
      console.error('Error deleting expense:', err)
    }
  }

  const handleDelete = async (saving) => {
    if (!window.confirm(`¿Eliminar "${saving.target_name}"?`)) return
    try {
      await api.delete(`/saving-goals/${saving.id}`)
      setSavings(prev => prev.filter(s => s.id !== saving.id))
    } catch (err) {
      console.error('Error deleting saving goal:', err)
    }
  }

  return (
    <>
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Ahorros y Planeación
            </h1>
            <p className="text-base text-text-secondary">
              Visualiza el futuro de tu hogar con precisión financiera.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-hover transition-all flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nueva meta
          </button>
        </div>
      </header>

      {serverError && (
        <div className="bg-error-bg border border-error-border text-error-text text-sm rounded-lg p-3 mb-4 whitespace-pre-line">
          {serverError}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-text-secondary">
          Cargando metas de ahorro...
        </div>
      ) : savings.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          No hay metas de ahorro aún. Crea una para comenzar.
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {savings.map(s => (
            <SavingCard key={s.id} saving={s} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </section>
      )}

      <section className="bg-surface border border-outline rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline flex justify-between items-center bg-surface-variant/30">
          <div>
            <h2 className="text-base font-semibold">Gastos Personales</h2>
            <p className="text-sm text-text-secondary">Administra tus gastos y pagos.</p>
          </div>
          <button
            onClick={openCreateExpense}
            className="flex items-center gap-2 text-primary text-xs font-medium hover:bg-primary-light/10 p-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Nuevo Gasto
          </button>
        </div>
        <PersonalExpenseTable
          expenses={expenses}
          onEdit={openEditExpense}
          onDelete={handleExpenseDelete}
          maxRows={5}
        />
        {expenses.length > 5 && (
          <div className="p-4 bg-surface-variant/20 flex justify-center">
            <button
              onClick={() => navigate('/savings/expenses')}
              className="text-xs font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-2"
            >
              Ver todos los gastos
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        )}
      </section>

      <section className="mt-6 relative overflow-hidden rounded-2xl h-48 flex items-center p-6 bg-surface border border-outline">
        <div className="z-10 relative max-w-md">
          <h2 className="text-xl font-bold text-primary mb-2">
            Tu ahorro creció un 12% este mes
          </h2>
          <p className="text-sm text-text-secondary">
            Sigue así y alcanzarás tu meta de "Vacaciones 2024" antes de lo esperado.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none">
          <img
            alt="Savings growth illustration"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCexKzJlR2rGiTUmrVxFkNKWpS72Dm0g3HvBgiFheTqflTIQmAlzeVq5DI8lZEAp7dvak71M5eY8j4bqoeaMGzh1zTgTCmqCFFXiXNXUPDt4Aaxj9YECXrlkK6RMLW8k0IoY_lr6LgQXkMWrYcP19-wY-jWZdEBSKDU5FmuhFDToDbslJHEhkkJXC-y1t-PeNnProFXxJkJU6lGsw_RkBnsB4HDZn0r1tw1YmINkRc09cwdJQlZ-jMO0eWyf8tIGiFWSwDYm2u5V1c"
          />
        </div>
      </section>

      <SavingModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        serverError={modalOpen ? serverError : null}
        defaultValues={
          editingSaving
            ? {
                target_name: editingSaving.target_name,
                category: editingSaving.category || '',
                target_amount: String(editingSaving.target_amount),
                deadline: editingSaving.deadline ? editingSaving.deadline.slice(0, 10) : '',
                current_amount: String(editingSaving.current_amount || ''),
              }
            : undefined
        }
        title={editingSaving ? 'Editar meta de ahorro' : 'Nueva meta de ahorro'}
      />

      <PersonalExpenseModal
        isOpen={expenseModalOpen}
        onClose={closeExpenseModal}
        onSubmit={handleExpenseSubmit}
        serverError={expenseModalOpen ? expenseServerError : null}
        defaultValues={
          editingExpense
            ? {
                concept: editingExpense.concept,
                amount: String(editingExpense.amount),
                category: editingExpense.category,
              }
            : undefined
        }
        title={editingExpense ? 'Editar gasto' : 'Nuevo gasto'}
      />
    </>
  )
}
