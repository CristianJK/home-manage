import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sharedPaymentSchema } from "./sharedPaymentSchema";
import { SearchableExpenseSelect } from "./SearchableExpenseSelect";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function PaymentModal({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  title,
  serverError,
  sharedExpenses,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(sharedPaymentSchema),
    defaultValues: {
      shared_expense_id: "",
      amount: "",
      paid_at: new Date().toISOString().slice(0, 10),
      notes: "",
      photo: "",
      ...defaultValues,
    },
  });

  const selectedId = useWatch({ name: "shared_expense_id", control });

  useEffect(() => {
    if (isOpen) {
      reset({
        shared_expense_id: "",
        amount: "",
        paid_at: new Date().toISOString().slice(0, 10),
        notes: "",
        photo: "",
        ...defaultValues,
      });
    }
  }, [isOpen, defaultValues, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} serverError={serverError}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <input type="hidden" {...register("shared_expense_id")} />
        <div className="space-y-1">
          <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Gasto asociado</label>
          <SearchableExpenseSelect value={selectedId} onChange={(val) => setValue("shared_expense_id", val)} expenses={sharedExpenses} />
        </div>
        <Input label="Monto ($)" error={errors.amount?.message} id="payment-amount" type="number" step="0.01" min="0" placeholder="150.00" {...register("amount")} />
        <Input label="Fecha" error={errors.paid_at?.message} id="payment-date" type="date" {...register("paid_at")} />
        <Input label="Notas" error={errors.notes?.message} id="payment-notes" placeholder="Opcional" {...register("notes")} />
        <Input label="Foto del comprobante" error={errors.photo?.message} id="payment-photo" placeholder="URL de la imagen (opcional)" {...register("photo")} />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar"}</Button>
        </div>
      </form>
    </Modal>
  );
}
