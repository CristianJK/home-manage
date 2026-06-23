import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalExpenseSchema } from './personalExpenseSchema'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'

const categoryOptions = [
  { value: 'food', label: 'Comida' },
  { value: 'transportation', label: 'Transporte' },
  { value: 'housing', label: 'Vivienda' },
  { value: 'entertainment', label: 'Entretenimiento' },
  { value: 'other', label: 'Otro' },
]

export function PersonalExpenseModal({ isOpen, onClose, onSubmit, defaultValues, title, serverError }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(personalExpenseSchema),
    defaultValues: {
      concept: '',
      amount: '',
      category: '',
      ...defaultValues,
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        concept: '',
        amount: '',
        category: '',
        ...defaultValues,
      })
    }
  }, [isOpen, defaultValues, reset])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} serverError={serverError}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input label="Concepto" error={errors.concept?.message} id="expense-concept" placeholder="Ej: Supermercado" {...register('concept')} />
        <Input label="Monto ($)" error={errors.amount?.message} id="expense-amount" type="number" step="0.01" min="0" placeholder="150.00" {...register('amount')} />
        <Select label="Categoría" error={errors.category?.message} id="expense-category" options={categoryOptions} placeholder="Selecciona una categoría" {...register('category')} />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</Button>
        </div>
      </form>
    </Modal>
  )
}
