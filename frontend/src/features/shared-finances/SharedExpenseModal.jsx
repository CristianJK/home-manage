import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sharedExpenseSchema } from './sharedExpenseSchema'

const conceptOptions = [
  { value: 'rent', label: 'Renta' },
  { value: 'water', label: 'Agua' },
  { value: 'electricity', label: 'Electricidad' },
  { value: 'internet', label: 'Internet' },
  { value: 'gas', label: 'Gas' },
  { value: 'other', label: 'Otro' },
]

const frequencyOptions = [
  { value: 'unique', label: 'Único' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'semiannual', label: 'Semestral' },
]

export function SharedExpenseModal({ isOpen, onClose, onSubmit, defaultValues, title, serverError, isAdmin }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(sharedExpenseSchema),
    defaultValues: {
      concept: '',
      amount: '',
      frequency: '',
      due_date: '',
      is_paid: '0',
      comment: '',
      ...defaultValues,
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        concept: '',
        amount: '',
        frequency: '',
        due_date: '',
        is_paid: '0',
        comment: '',
        ...defaultValues,
      })
    }
  }, [isOpen, defaultValues, reset])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="material-symbols-outlined text-text-secondary hover:text-text-primary transition-colors"
          >
            close
          </button>
        </div>

        {serverError && (
          <div className="bg-error-bg border border-error-border text-error-text text-sm rounded-lg p-3 whitespace-pre-line">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="expense-concept">Concepto</label>
            <select
              {...register('concept')}
              className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              id="expense-concept"
            >
              <option value="">Selecciona un concepto</option>
              {conceptOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.concept && <p className="text-error text-sm mt-1">{errors.concept.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="expense-amount">Monto ($)</label>
              <input
                {...register('amount')}
                className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                id="expense-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="150.00"
              />
              {errors.amount && <p className="text-error text-sm mt-1">{errors.amount.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="expense-frequency">Frecuencia</label>
              <select
                {...register('frequency')}
                className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                id="expense-frequency"
              >
                <option value="">Selecciona</option>
                {frequencyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.frequency && <p className="text-error text-sm mt-1">{errors.frequency.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="expense-date">Fecha de vencimiento</label>
              <input
                {...register('due_date')}
                className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                id="expense-date"
                type="date"
              />
              {errors.due_date && <p className="text-error text-sm mt-1">{errors.due_date.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="expense-status">Estado</label>
              <select
                {...register('is_paid')}
                disabled={!isAdmin}
                className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                id="expense-status"
              >
                <option value="0">Pendiente</option>
                <option value="1">Pagado</option>
              </select>
              {errors.is_paid && <p className="text-error text-sm mt-1">{errors.is_paid.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="expense-comment">Comentario</label>
            <input
              {...register('comment')}
              className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              id="expense-comment"
              placeholder="Opcional"
            />
            {errors.comment && <p className="text-error text-sm mt-1">{errors.comment.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-text-secondary border border-outline rounded-lg hover:bg-surface-variant transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium bg-primary text-on-primary rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
