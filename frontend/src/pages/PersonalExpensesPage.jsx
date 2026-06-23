import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import useSWR from "swr";
import api from "../services/api";
import { PersonalExpenseTable } from "../features/savings/PersonalExpenseTable";
import { PersonalExpenseModal } from "../features/savings/PersonalExpenseModal";
import { buildPayload } from "../lib/payload";
import { handleServerError } from "../lib/errors";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function PersonalExpensesPage() {
  const navigate = useNavigate();
  const { data: expenses = [], mutate } = useSWR("/personal-expense", fetcher);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [serverError, setServerError] = useState(null);

  const openCreate = useCallback(() => {
    setEditingExpense(null);
    setServerError(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((expense) => {
    setEditingExpense(expense);
    setServerError(null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingExpense(null);
    setServerError(null);
  }, []);

  const handleSubmit = useCallback(
    async (data) => {
      setServerError(null);
      const payload = buildPayload(data, ["amount"]);
      try {
        if (editingExpense) {
          await api.patch(`/personal-expense/${editingExpense.id}`, payload);
        } else {
          await api.post("/personal-expense", payload);
        }
        mutate();
        closeModal();
      } catch (err) {
        handleServerError(err, setServerError);
      }
    },
    [editingExpense, mutate, closeModal]
  );

  const handleDelete = useCallback(
    async (expense) => {
      if (!window.confirm(`¿Eliminar "${expense.concept}"?`)) return;
      try {
        await api.delete(`/personal-expense/${expense.id}`);
        mutate();
      } catch (err) {
        console.error("Error deleting expense:", err);
      }
    },
    [mutate]
  );

  return (
    <>
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate("/savings")}
                className="material-symbols-outlined text-text-secondary hover:text-primary transition-colors text-[20px]"
                title="Volver a ahorros"
              >
                arrow_back
              </button>
              <h1 className="text-2xl font-bold text-text-primary">Gastos Personales</h1>
            </div>
            <p className="text-base text-text-secondary">
              Todos tus gastos registrados en un solo lugar.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-hover transition-all flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nuevo gasto
          </button>
        </div>
      </header>

      {serverError && (
        <div className="bg-error-bg border border-error-border text-error-text text-sm rounded-lg p-3 mb-4 whitespace-pre-line">
          {serverError}
        </div>
      )}

      <section className="bg-surface border border-outline rounded-xl overflow-hidden shadow-sm">
        <PersonalExpenseTable expenses={expenses} onEdit={openEdit} onDelete={handleDelete} />
      </section>

      <PersonalExpenseModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        serverError={modalOpen ? serverError : null}
        defaultValues={
          editingExpense
            ? {
                concept: editingExpense.concept,
                amount: String(editingExpense.amount),
                category: editingExpense.category,
              }
            : undefined
        }
        title={editingExpense ? "Editar gasto" : "Nuevo gasto"}
      />
    </>
  );
}
