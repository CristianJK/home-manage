const conceptConfig = {
  rent: { icon: "home", label: "Renta" },
  water: { icon: "water_drop", label: "Agua" },
  electricity: { icon: "bolt", label: "Electricidad" },
  internet: { icon: "wifi", label: "Internet" },
  gas: { icon: "local_fire_department", label: "Gas" },
  other: { icon: "more_horiz", label: "Otro" },
};

const frequencyLabels = {
  unique: "Único",
  monthly: "Mensual",
  yearly: "Anual",
  biweekly: "Quincenal",
  semiannual: "Semestral",
};

export function SharedFinancesTable({
  sharedFinances,
  onEdit,
  onDelete,
  onViewAll,
  maxRows,
}) {
  const displayed = maxRows ? sharedFinances.slice(0, maxRows) : sharedFinances;

  if (sharedFinances.length === 0) {
    return (
      <div className="p-8 text-center text-text-secondary text-sm">
        No hay gastos compartidos registrados. Crea uno para comenzar.
      </div>
    );
  }

  return (
    <div className="bg-surface border border-outline rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-surface-variant border-b border-outline">
          <tr>
            <th className="p-4 text-xs font-medium text-text-secondary">
              Fecha
            </th>
            <th className="p-4 text-xs font-medium text-text-secondary">
              Descripción
            </th>
            <th className="p-4 text-xs font-medium text-text-secondary">
              Frecuencia
            </th>
            <th className="p-4 text-xs font-medium text-text-secondary text-right">
              Monto Total
            </th>
            <th className="p-4 text-xs font-medium text-text-secondary text-center">
              Estado
            </th>
            <th className="p-4 w-20" />
          </tr>
        </thead>
        <tbody className="divide-y divide-outline">
          {displayed.map((expense) => {
            const conCfg =
              conceptConfig[expense.concept] || conceptConfig.other;
            return (
              <tr
                key={expense.id}
                className="hover:bg-surface-variant transition-colors group"
              >
                <td className="p-4 text-sm text-text-secondary">
                  {new Date(expense.due_date).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        {conCfg.icon}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        {conCfg.label}
                      </span>
                      {expense.comment && (
                        <p className="text-xs text-text-secondary">
                          {expense.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-xs font-medium px-2 py-1 bg-surface-variant text-text-primary rounded-full">
                    {frequencyLabels[expense.frequency] || expense.frequency}
                  </span>
                </td>
                <td className="p-4 text-right text-sm font-bold">
                  $
                  {Number(expense.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      expense.is_paid
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {expense.is_paid ? "Pagado" : "Pendiente"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(expense);
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
                          onDelete(expense);
                        }}
                        className="material-symbols-outlined text-text-secondary hover:text-error transition-colors text-[18px]"
                        title="Eliminar"
                      >
                        delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="p-4 bg-surface border-t border-outline flex justify-center">
        <button
          onClick={onViewAll}
          className="text-primary text-xs font-medium flex items-center gap-1 hover:underline"
        >
          Ver todos los movimientos
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
}
