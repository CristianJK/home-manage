import { memo } from "react";
import { categoryConfig } from "../../lib/constants";
import { formatCurrency } from "../../lib/helpers";

export const PersonalExpenseTable = memo(function PersonalExpenseTable({ expenses, onEdit, onDelete, maxRows }) {
  const displayed = maxRows ? expenses.slice(0, maxRows) : expenses;

  if (expenses.length === 0) {
    return (
      <div className="p-8 text-center text-text-secondary text-sm">
        No hay gastos registrados. Crea uno para comenzar.
      </div>
    );
  }

  return (
    <div className="divide-y divide-outline">
      {displayed.map((expense) => {
        const cat = categoryConfig[expense.category] || categoryConfig.other;
        return (
          <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-surface-variant transition-colors group">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 flex items-center justify-center bg-surface-variant rounded-full shrink-0">
                <span className="material-symbols-outlined text-text-secondary">{cat.icon}</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-semibold truncate">{expense.concept}</h4>
                <p className="text-xs font-medium text-text-secondary">{cat.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="text-sm font-bold text-text-primary">${formatCurrency(expense.amount)}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button onClick={(e) => { e.stopPropagation(); onEdit(expense); }} className="material-symbols-outlined text-text-secondary hover:text-primary transition-colors text-[18px]" title="Editar">edit</button>
                )}
                {onDelete && (
                  <button onClick={(e) => { e.stopPropagation(); onDelete(expense); }} className="material-symbols-outlined text-text-secondary hover:text-error transition-colors text-[18px]" title="Eliminar">delete</button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
