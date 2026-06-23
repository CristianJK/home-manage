import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import useSWR from "swr";
import api from "../services/api";
import { conceptConfig, frequencyLabels } from "../lib/constants";
import { formatDate, formatCurrency } from "../lib/helpers";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function SharedFinancesAllPage() {
  const navigate = useNavigate();
  const { data: expenses = [], isLoading } = useSWR(
    "/shared-expense/with-payments",
    fetcher
  );
  const [expandedId, setExpandedId] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const toggleExpand = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const filtered = useMemo(
    () =>
      expenses.filter((e) => {
        if (filterName) {
          const label = (conceptConfig[e.concept]?.label || e.concept || "").toLowerCase();
          if (!label.includes(filterName.toLowerCase())) return false;
        }
        if (filterStatus !== "all") {
          const isPaid = filterStatus === "paid";
          if (e.is_paid !== isPaid) return false;
        }
        if (filterDateFrom && e.due_date && e.due_date.slice(0, 10) < filterDateFrom) return false;
        if (filterDateTo && e.due_date && e.due_date.slice(0, 10) > filterDateTo) return false;
        return true;
      }),
    [expenses, filterName, filterStatus, filterDateFrom, filterDateTo]
  );

  return (
    <>
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate("/shared-finances")}
                className="material-symbols-outlined text-text-secondary hover:text-primary transition-colors text-[20px]"
                title="Volver"
              >
                arrow_back
              </button>
              <h1 className="text-2xl font-bold text-text-primary">
                Todos los Gastos Comunes
              </h1>
            </div>
            <p className="text-base text-text-secondary">
              Historial completo de gastos compartidos y sus pagos.
            </p>
          </div>
        </div>
      </header>

      <section className="bg-surface border border-outline rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Nombre</label>
            <input
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              placeholder="Filtrar por concepto..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            >
              <option value="all">Todos</option>
              <option value="paid">Pagado</option>
              <option value="pending">Pendiente</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Desde</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Hasta</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
          </div>
        </div>
      </section>

      <section className="bg-surface border border-outline rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12 text-text-secondary">Cargando gastos...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            No se encontraron gastos con los filtros aplicados.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-variant border-b border-outline">
              <tr>
                <th className="p-4 text-xs font-medium text-text-secondary w-10" />
                <th className="p-4 text-xs font-medium text-text-secondary">Fecha</th>
                <th className="p-4 text-xs font-medium text-text-secondary">Descripción</th>
                <th className="p-4 text-xs font-medium text-text-secondary">Frecuencia</th>
                <th className="p-4 text-xs font-medium text-text-secondary text-right">Monto Total</th>
                <th className="p-4 text-xs font-medium text-text-secondary text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {filtered.map((expense) => {
                const conCfg = conceptConfig[expense.concept] || conceptConfig.other;
                const isExpanded = expandedId === expense.id;
                const payments = expense.payments || [];
                return (
                  <tr key={expense.id}>
                    <td colSpan={6} className="p-0">
                      <div
                        className="hover:bg-surface-variant transition-colors cursor-pointer flex items-center w-full px-4 py-4"
                        onClick={() => toggleExpand(expense.id)}
                      >
                        <span
                          className="material-symbols-outlined text-text-secondary text-[18px] transition-transform shrink-0"
                          style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                        >
                          chevron_right
                        </span>
                        <span className="text-sm text-text-secondary w-32 ml-2">
                          {formatDate(expense.due_date)}
                        </span>
                        <div className="flex items-center gap-3 flex-1 ml-4">
                          <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                              {conCfg.icon}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">{conCfg.label}</span>
                            {expense.comment && (
                              <p className="text-xs text-text-secondary">{expense.comment}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-surface-variant text-text-primary rounded-full w-24 text-center">
                          {frequencyLabels[expense.frequency] || expense.frequency}
                        </span>
                        <span className="text-right text-sm font-bold w-32">
                          ${formatCurrency(expense.amount)}
                        </span>
                        <span className="text-center w-24">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              expense.is_paid
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {expense.is_paid ? "Pagado" : "Pendiente"}
                          </span>
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="bg-surface-variant/30 px-4 py-3 border-b border-outline">
                          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                            Historial de Pagos
                          </h4>
                          {payments.length === 0 ? (
                            <p className="text-sm text-text-secondary italic">
                              No hay pagos registrados para este gasto.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {payments.map((payment) => (
                                <div
                                  key={payment.id}
                                  className="flex items-center justify-between bg-surface border border-outline rounded-lg p-3"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                                      <span className="text-xs font-bold text-primary">
                                        {payment.user?.name?.charAt(0)?.toUpperCase() || "?"}
                                      </span>
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium">
                                        {payment.user?.name || "Usuario desconocido"}
                                      </p>
                                      <p className="text-xs text-text-secondary">
                                        {formatDate(payment.paid_at)}
                                        {payment.notes && ` — ${payment.notes}`}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0 ml-4">
                                    <p className="text-sm font-bold text-primary">
                                      ${formatCurrency(payment.amount)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
