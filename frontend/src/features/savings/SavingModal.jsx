import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { savingGoalSchema } from './savingGoalSchema'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'

const categoryOptions = [
  { value: '', label: 'Sin categoría' },
  { value: 'emergency', label: 'Fondo de Emergencia' },
  { value: 'travel', label: 'Viajes' },
  { value: 'housing', label: 'Vivienda' },
  { value: 'education', label: 'Educación' },
  { value: 'health', label: 'Salud' },
  { value: 'investment', label: 'Inversión' },
  { value: 'other', label: 'Otro' },
]

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} serverError={serverError}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input label="Nombre de la meta" error={errors.target_name?.message} id="saving-name" placeholder="Ej: Fondo de Emergencia" {...register('target_name')} />
        <Select label="Categoría" error={errors.category?.message} id="saving-category" options={categoryOptions} {...register('category')} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Meta ($)" error={errors.target_amount?.message} id="saving-target" type="number" step="0.01" min="0" placeholder="10000.00" {...register('target_amount')} />
          <Input label="Ahorrado ($)" error={errors.current_amount?.message} id="saving-current" type="number" step="0.01" min="0" placeholder="0.00" {...register('current_amount')} />
        </div>

        <Input label="Fecha límite" error={errors.deadline?.message} id="saving-deadline" type="date" {...register('deadline')} />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</Button>
        </div>
      </form>
    </Modal>
  )
}
