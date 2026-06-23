import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sharedExpenseSchema } from './sharedExpenseSchema'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { conceptOptions, frequencyOptions } from '../../lib/constants'

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} serverError={serverError}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Select label="Concepto" error={errors.concept?.message} id="expense-concept" options={conceptOptions} placeholder="Selecciona un concepto" {...register('concept')} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Monto ($)" error={errors.amount?.message} id="expense-amount" type="number" step="0.01" min="0" placeholder="150.00" {...register('amount')} />
          <Select label="Frecuencia" error={errors.frequency?.message} id="expense-frequency" options={frequencyOptions} placeholder="Selecciona" {...register('frequency')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Fecha de vencimiento" error={errors.due_date?.message} id="expense-date" type="date" {...register('due_date')} />
          <Select label="Estado" error={errors.is_paid?.message} id="expense-status" options={[{ value: '0', label: 'Pendiente' }, { value: '1', label: 'Pagado' }]} disabled={!isAdmin} {...register('is_paid')} />
        </div>

        <Input label="Comentario" error={errors.comment?.message} id="expense-comment" placeholder="Opcional" {...register('comment')} />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</Button>
        </div>
      </form>
    </Modal>
  )
}
