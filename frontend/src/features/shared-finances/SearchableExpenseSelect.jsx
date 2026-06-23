import { useState, useRef, useEffect, useMemo, useCallback } from "react";

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

export function SearchableExpenseSelect({ value, onChange, expenses }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const selectedExpense = value
    ? expenses?.find((e) => String(e.id) === value)
    : null;

  const filtered = useMemo(() => {
    if (!expenses) return [];
    const q = search.toLowerCase().trim();
    if (!q) return expenses;
    return expenses.filter(
      (e) =>
        (conceptConfig[e.concept]?.label || e.concept)
          .toLowerCase()
          .includes(q) ||
        String(e.amount).includes(q),
    );
  }, [expenses, search]);

  const close = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, close]);

  const selectItem = (id) => {
    onChange(id);
    close();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => open ? close() : setOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-surface border border-outline rounded-lg text-left focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
      >
        {selectedExpense ? (
          <>
            <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-[18px]">
                {conceptConfig[selectedExpense.concept]?.icon || "more_horiz"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold">
                {conceptConfig[selectedExpense.concept]?.label ||
                  selectedExpense.concept}
              </span>
              <span
                className={`ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  selectedExpense.is_paid
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {selectedExpense.is_paid ? "Pagado" : "Pendiente"}
              </span>
            </div>
            <span className="text-sm font-medium text-text-secondary">
              ${Number(selectedExpense.amount).toLocaleString()}
            </span>
          </>
        ) : (
          <span className="text-sm text-text-secondary">
            Sin gasto asociado
          </span>
        )}
        <span
          className={`material-symbols-outlined text-text-secondary ml-auto transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-surface border border-outline rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-outline">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
                search
              </span>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar gasto..."
                className="w-full pl-9 pr-3 py-2 bg-surface border border-outline rounded-lg text-sm text-text-primary placeholder:text-text-secondary/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto">
            <button
              type="button"
              onClick={() => selectItem("")}
              className={`w-full text-left px-4 py-3 transition-colors ${
                !value
                  ? "bg-primary/5 border-l-2 border-primary"
                  : "hover:bg-surface-variant border-l-2 border-transparent"
              }`}
            >
              <span className="text-sm text-text-secondary">
                Sin gasto asociado
              </span>
            </button>
            {filtered.map((expense) => {
              const conCfg =
                conceptConfig[expense.concept] || conceptConfig.other;
              const isSelected = value === String(expense.id);
              return (
                <button
                  key={expense.id}
                  type="button"
                  onClick={() => selectItem(String(expense.id))}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    isSelected
                      ? "bg-primary/5 border-l-2 border-primary"
                      : "hover:bg-surface-variant border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        {conCfg.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {conCfg.label}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                            expense.is_paid
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {expense.is_paid ? "Pagado" : "Pendiente"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                        <span>
                          $
                          {Number(expense.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span>·</span>
                        <span>
                          {frequencyLabels[expense.frequency] ||
                            expense.frequency}
                        </span>
                        <span>·</span>
                        <span>
                          {new Date(expense.due_date).toLocaleDateString(
                            "es-ES",
                            { day: "numeric", month: "short" },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-text-secondary">
                No se encontraron gastos
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
