import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema } from '../schemas/task'

export function TaskModal({ isOpen, onClose, onSubmit, defaultValues, title, serverError }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      frequency: '',
      scheduled_at: '',
      ...defaultValues,
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        title: '',
        description: '',
        status: 'pending',
        frequency: '',
        scheduled_at: '',
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
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="task-title">Título</label>
            <input
              {...register('title')}
              className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              id="task-title"
              placeholder="Nombre de la tarea"
            />
            {errors.title && <p className="text-error text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="task-description">Descripción</label>
            <textarea
              {...register('description')}
              className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              id="task-description"
              rows={3}
              placeholder="Descripción opcional"
            />
            {errors.description && <p className="text-error text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="task-status">Estado</label>
              <select
                {...register('status')}
                className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                id="task-status"
              >
                <option value="pending">Por hacer</option>
                <option value="in_progress">En progreso</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
              {errors.status && <p className="text-error text-sm mt-1">{errors.status.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="task-frequency">Frecuencia</label>
              <select
                {...register('frequency')}
                className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                id="task-frequency"
              >
                <option value="">Sin frecuencia</option>
                <option value="daily">Diaria</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="yearly">Anual</option>
              </select>
              {errors.frequency && <p className="text-error text-sm mt-1">{errors.frequency.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="task-scheduled-at">Fecha programada</label>
            <input
              {...register('scheduled_at')}
              className="w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              id="task-scheduled-at"
              type="date"
            />
            {errors.scheduled_at && <p className="text-error text-sm mt-1">{errors.scheduled_at.message}</p>}
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
