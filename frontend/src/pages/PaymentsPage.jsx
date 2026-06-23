import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";
import { PaymentTable } from "../features/shared-finances/PaymentTable";
import { PaymentModal } from "../features/shared-finances/PaymentModal";

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [serverError, setServerError] = useState(null);

  const fetchPayments = useCallback(() => {
    api
      .get("/shared-finances/payments")
      .then((res) => setPayments(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching payments:", err))
      .finally(() => setLoading(false));
  }, []);

  const fetchSharedExpenses = useCallback(() => {
    api
      .get("/shared-finances")
      .then((res) => setSharedExpenses(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching shared expenses:", err));
  }, []);

  useEffect(() => {
    fetchPayments();
    fetchSharedExpenses();
  }, [fetchPayments, fetchSharedExpenses]);

  const openCreate = () => {
    setEditingPayment(null);
    setServerError(null);
    setModalOpen(true);
  };

  const openEdit = (payment) => {
    setEditingPayment(payment);
    setServerError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPayment(null);
    setServerError(null);
  };

  const handleSubmit = async (data) => {
    setServerError(null);
    const payload = {
      amount: Number(data.amount),
      paid_at: data.paid_at,
      notes: data.notes || null,
      photo: data.photo || null,
    };
    if (data.shared_expense_id) {
      payload.shared_expense_id = Number(data.shared_expense_id);
    }
    try {
      if (editingPayment) {
        const res = await api.patch(
          `/shared-finances/payments/${editingPayment.id}`,
          payload,
        );
        setPayments((prev) =>
          prev.map((p) => (p.id === editingPayment.id ? res.data : p)),
        );
      } else {
        const res = await api.post("/shared-finances/payments", payload);
        setPayments((prev) => [...prev, res.data]);
      }
      closeModal();
    } catch (err) {
      if (err.response?.status === 422) {
        const fields = err.response.data?.errors;
        if (fields) {
          setServerError(Object.values(fields).flat().join("\n"));
        } else {
          setServerError("Error de validación. Revisa los campos.");
        }
      } else {
        setServerError("Error al guardar el pago. Intenta de nuevo.");
      }
    }
  };

  const handleDelete = async (payment) => {
    if (
      !window.confirm(
        `¿Eliminar pago de $${Number(payment.amount).toLocaleString()}?`,
      )
    )
      return;
    try {
      await api.delete(`/shared-finances/payments/${payment.id}`);
      setPayments((prev) => prev.filter((p) => p.id !== payment.id));
    } catch (err) {
      console.error("Error deleting payment:", err);
    }
  };

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
                Pagos Realizados
              </h1>
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

      <section className="bg-surface border border-outline rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-text-secondary">
            Cargando pagos...
          </div>
        ) : (
          <PaymentTable
            payments={payments}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </section>

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
