import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";

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

export default function SharedFinancesAllPage() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const fetchAll = useCallback(() => {
    setLoading(true);
    api
      .get("/shared-expense/with-payments")
      .then((res) => setExpenses(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching expenses:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filtered = expenses.filter((e) => {
    if (filterName) {
      const label = (conceptConfig[e.concept]?.label || e.concept || "").toLowerCase();
      if (!label.includes(filterName.toLowerCase())) return false;
    }
    if (filterStatus !== "all") {
      const isPaid = filterStatus === "paid";
      if (e.is_paid !== isPaid) return false;
    }
    if (filterDateFrom && e.due_date) {
      if (e.due_date.slice(0, 10) < filterDateFrom) return false;
    }
    if (filterDateTo && e.due_date) {
      if (e.due_date.slice(0, 10) > filterDateTo) return false;
    }
    return true;
  });

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
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              Nombre
            </label>
            <input
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              placeholder="Filtrar por concepto..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              Estado
            </label>
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
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              Desde
            </label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              Hasta
            </label>
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
        {loading ? (
          <div className="text-center py-12 text-text-secondary">
            Cargando gastos...
          </div>
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
                  <>
                    <tr
                      key={expense.id}
                      className="hover:bg-surface-variant transition-colors cursor-pointer"
                      onClick={() => toggleExpand(expense.id)}
                    >
                      <td className="p-4">
                        <span className="material-symbols-outlined text-text-secondary text-[18px] transition-transform"
                          style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                        >
                          chevron_right
                        </span>
                      </td>
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
                            <span className="material-symbols-outlined text-primary text-[18px]">{conCfg.icon}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">{conCfg.label}</span>
                            {expense.comment && (
                              <p className="text-xs text-text-secondary">{expense.comment}</p>
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
                        ${Number(expense.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          expense.is_paid
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {expense.is_paid ? "Pagado" : "Pendiente"}
                        </span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${expense.id}-payments`}>
                        <td colSpan={6} className="p-0">
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
                                          {new Date(payment.paid_at).toLocaleDateString("es-ES", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                          })}
                                          {payment.notes && ` — ${payment.notes}`}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                      <p className="text-sm font-bold text-primary">
                                        ${Number(payment.amount).toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
