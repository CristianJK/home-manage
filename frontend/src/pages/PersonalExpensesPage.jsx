import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import api from '../services/api'
import { PersonalExpenseTable } from '../features/savings/PersonalExpenseTable'
import { PersonalExpenseModal } from '../features/savings/PersonalExpenseModal'

export default function PersonalExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [serverError, setServerError] = useState(null)

  const navigate = useNavigate()

  const fetchExpenses = useCallback(() => {
    api.get('/personal-expense')
      .then(res => setExpenses(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error('Error fetching expenses:', err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchExpenses() }, [fetchExpenses])

  const openCreate = () => {
    setEditingExpense(null)
    setServerError(null)
    setModalOpen(true)
  }

  const openEdit = (expense) => {
    setEditingExpense(expense)
    setServerError(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingExpense(null)
    setServerError(null)
  }

  const handleSubmit = async (data) => {
    setServerError(null)
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
        setServerError('Error al guardar el gasto. Intenta de nuevo.')
      }
    }
  }

  const handleDelete = async (expense) => {
    if (!window.confirm(`¿Eliminar "${expense.concept}"?`)) return
    try {
      await api.delete(`/personal-expense/${expense.id}`)
      setExpenses(prev => prev.filter(e => e.id !== expense.id))
    } catch (err) {
      console.error('Error deleting expense:', err)
    }
  }

  return (
    <>
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate('/savings')}
                className="material-symbols-outlined text-text-secondary hover:text-primary transition-colors text-[20px]"
                title="Volver a ahorros"
              >
                arrow_back
              </button>
              <h1 className="text-2xl font-bold text-text-primary">
                Gastos Personales
              </h1>
            </div>
            <p className="text-base text-text-secondary">
              Todos tus gastos registrados en un solo lugar.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-hover transition-all flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nuevo gasto
          </button>
        </div>
      </header>

      {serverError && (
        <div className="bg-error-bg border border-error-border text-error-text text-sm rounded-lg p-3 mb-4 whitespace-pre-line">
          {serverError}
        </div>
      )}

      <section className="bg-surface border border-outline rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-text-secondary">
            Cargando gastos...
          </div>
        ) : (
          <PersonalExpenseTable
            expenses={expenses}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </section>

      <PersonalExpenseModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        serverError={modalOpen ? serverError : null}
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
