import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { savingGoalSchema } from '../schemas/savingGoal'

export function SavingModal({ isOpen, onClose, onSubmit, defaultValues, title, serverError }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(savingGoalSchema),
    defaultValues: {
      target_name: '',
      category: '',
      target_amount: '',
      deadline: '',
      current_amount: '',
      ...defaultValues,
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        target_name: '',
        category: '',
        target_amount: '',
        deadline: '',
        current_amount: '',
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
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="saving-name">Nombre de la meta</label>
            <input
              {...register('target_name')}
              className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              id="saving-name"
              placeholder="Ej: Fondo de Emergencia"
            />
            {errors.target_name && <p className="text-error text-sm mt-1">{errors.target_name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="saving-category">Categoría</label>
            <select
              {...register('category')}
              className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              id="saving-category"
            >
              <option value="">Sin categoría</option>
              <option value="emergency">Fondo de Emergencia</option>
              <option value="travel">Viajes</option>
              <option value="housing">Vivienda</option>
              <option value="education">Educación</option>
              <option value="health">Salud</option>
              <option value="investment">Inversión</option>
              <option value="other">Otro</option>
            </select>
            {errors.category && <p className="text-error text-sm mt-1">{errors.category.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="saving-target">Meta ($)</label>
              <input
                {...register('target_amount')}
                className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                id="saving-target"
                type="number"
                step="0.01"
                min="0"
                placeholder="10000.00"
              />
              {errors.target_amount && <p className="text-error text-sm mt-1">{errors.target_amount.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="saving-current">Ahorrado ($)</label>
              <input
                {...register('current_amount')}
                className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                id="saving-current"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
              />
              {errors.current_amount && <p className="text-error text-sm mt-1">{errors.current_amount.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="saving-deadline">Fecha límite</label>
            <input
              {...register('deadline')}
              className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              id="saving-deadline"
              type="date"
            />
            {errors.deadline && <p className="text-error text-sm mt-1">{errors.deadline.message}</p>}
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
