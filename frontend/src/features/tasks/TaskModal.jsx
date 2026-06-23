import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema } from './taskSchema'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'

const statusOptions = [
  { value: 'pending', label: 'Por hacer' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
]

const frequencyOptions = [
  { value: '', label: 'Sin frecuencia' },
  { value: 'daily', label: 'Diaria' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' },
]

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} serverError={serverError}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input label="Título" error={errors.title?.message} id="task-title" placeholder="Nombre de la tarea" {...register('title')} />
        <Input label="Descripción" error={errors.description?.message} id="task-description" as="textarea" rows={3} placeholder="Descripción opcional" {...register('description')} />

        <div className="grid grid-cols-2 gap-4">
          <Select label="Estado" error={errors.status?.message} id="task-status" options={statusOptions} {...register('status')} />
          <Select label="Frecuencia" error={errors.frequency?.message} id="task-frequency" options={frequencyOptions} {...register('frequency')} />
        </div>

        <Input label="Fecha programada" error={errors.scheduled_at?.message} id="task-scheduled-at" type="date" {...register('scheduled_at')} />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</Button>
        </div>
      </form>
    </Modal>
  )
}
