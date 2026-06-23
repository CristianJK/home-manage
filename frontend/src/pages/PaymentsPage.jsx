import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import useSWR from "swr";
import api from "../services/api";
import { PaymentTable } from "../features/shared-finances/PaymentTable";
import { PaymentModal } from "../features/shared-finances/PaymentModal";
import { formatCurrency } from "../lib/helpers";
import { handleServerError } from "../lib/errors";

const fetcher = (url) => api.get(url).then((res) => res.data);

const conceptLabels = {
  rent: "Renta",
  water: "Agua",
  electricity: "Electricidad",
  internet: "Internet",
  gas: "Gas",
  other: "Otro",
};

export default function PaymentsPage() {
  const navigate = useNavigate();
  const { data: payments = [], mutate, isLoading } = useSWR("/shared-finances/payments", fetcher);
  const { data: sharedExpenses = [] } = useSWR("/shared-expense", fetcher);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredPayments = useMemo(() => {
    let result = payments;
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter((p) => {
        const concept =
          conceptLabels[p.shared_expense?.concept] ||
          p.shared_expense?.concept ||
          "Pago general";
        return concept.toLowerCase().includes(q);
      });
    }
    if (dateFrom) result = result.filter((p) => p.paid_at?.slice(0, 10) >= dateFrom);
    if (dateTo) result = result.filter((p) => p.paid_at?.slice(0, 10) <= dateTo);
    return result;
  }, [payments, search, dateFrom, dateTo]);

  const hasActiveFilters = search || dateFrom || dateTo;

  const openCreate = useCallback(() => {
    setEditingPayment(null);
    setServerError(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((payment) => {
    setEditingPayment(payment);
    setServerError(null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingPayment(null);
    setServerError(null);
  }, []);

  const handleSubmit = useCallback(
    async (data) => {
      setServerError(null);
      const payload = { ...data, shared_expense_id: data.shared_expense_id ? Number(data.shared_expense_id) : undefined };
      try {
        if (editingPayment) {
          await api.patch(`/shared-finances/payments/${editingPayment.id}`, payload);
        } else {
          await api.post("/shared-finances/payments", payload);
        }
        mutate();
        closeModal();
      } catch (err) {
        handleServerError(err, setServerError);
      }
    },
    [editingPayment, mutate, closeModal]
  );

  const handleDelete = useCallback(async (payment) => {
    if (!window.confirm(`¿Eliminar pago de $${formatCurrency(payment.amount)}?`)) return;
    try {
      await api.delete(`/shared-finances/payments/${payment.id}`);
      mutate();
    } catch (err) {
      console.error("Error deleting payment:", err);
    }
  }, [mutate]);

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
              <h1 className="text-2xl font-bold text-text-primary">Pagos Realizados</h1>
            </div>
            <p className="text-base text-text-secondary">
              Tus pagos registrados en gastos compartidos.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-hover transition-all flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nuevo pago
          </button>
        </div>
      </header>

      {serverError && (
        <div className="bg-error-bg border border-error-border text-error-text text-sm rounded-lg p-3 mb-4 whitespace-pre-line">
          {serverError}
        </div>
      )}

      <div className="bg-surface border border-outline rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar por nombre..."
              className="w-full pl-9 pr-3 py-2 bg-surface-variant border border-outline rounded-lg text-sm text-text-primary placeholder:text-text-secondary/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 bg-surface-variant border border-outline rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              title="Desde"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 bg-surface-variant border border-outline rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              title="Hasta"
            />
            {hasActiveFilters && (
              <button
                onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); }}
                className="px-3 py-2 text-sm font-medium text-text-secondary border border-outline rounded-lg hover:bg-surface-variant transition-all"
                title="Limpiar filtros"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-12 text-text-secondary">Cargando pagos...</div>
        ) : filteredPayments.length === 0 && hasActiveFilters ? (
          <div className="text-center py-12 text-text-secondary text-sm">
            No se encontraron pagos con los filtros aplicados.
          </div>
        ) : (
          <PaymentTable payments={filteredPayments} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </div>

      <PaymentModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        serverError={modalOpen ? serverError : null}
        sharedExpenses={sharedExpenses}
        defaultValues={
          editingPayment
            ? {
                shared_expense_id: editingPayment.shared_expense_id ? String(editingPayment.shared_expense_id) : "",
                amount: String(editingPayment.amount),
                paid_at: editingPayment.paid_at?.slice(0, 10) || "",
                notes: editingPayment.notes || "",
                photo: editingPayment.photo || "",
              }
            : undefined
        }
        title={editingPayment ? "Editar pago" : "Nuevo pago"}
      />
    </>
  );
}
