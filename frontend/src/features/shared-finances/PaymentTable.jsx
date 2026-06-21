export function PaymentTable({ payments, onEdit, onDelete }) {
  if (payments.length === 0) {
    return (
      <div className="p-8 text-center text-text-secondary text-sm">
        No hay pagos registrados. Crea uno para comenzar.
      </div>
    );
  }

  return (
    <div className="divide-y divide-outline">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="p-4 flex items-center justify-between hover:bg-surface-variant transition-colors group"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 flex items-center justify-center bg-surface-variant rounded-full shrink-0">
              <span className="material-symbols-outlined text-text-secondary">
                payments
              </span>
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-semibold truncate">
                {payment.user?.name || "Usuario"}
              </h4>
              <p className="text-xs font-medium text-text-secondary">
                {new Date(payment.paid_at).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                {payment.notes && ` — ${payment.notes}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-sm font-bold text-primary">
                $
                {Number(payment.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(payment);
                  }}
                  className="material-symbols-outlined text-text-secondary hover:text-primary transition-colors text-[18px]"
                  title="Editar"
                >
                  edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(payment);
                  }}
                  className="material-symbols-outlined text-text-secondary hover:text-error transition-colors text-[18px]"
                  title="Eliminar"
                >
                  delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
