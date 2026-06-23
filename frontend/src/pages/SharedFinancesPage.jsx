import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import useSWR from "swr";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { SharedFinancesTable } from "../features/shared-finances/SharedFinancesTable";
import { SharedFinanceSummary } from "../features/shared-finances/SharedFinanceSummary";
import { SharedFinanceBreakdown } from "../features/shared-finances/SharedFinanceBreakdown";
import { SharedExpenseModal } from "../features/shared-finances/SharedExpenseModal";
import { getMonthStart, isSameMonth } from "../lib/helpers";
import { handleServerError } from "../lib/errors";
import { buildSharedExpensePayload } from "../lib/payload";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function SharedFinancesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const monthStart = useMemo(() => getMonthStart(), []);

  const { data: sharedFinances = [], mutate: mutateExpenses } = useSWR(
    "/shared-expense",
    fetcher
  );
  const { data: percentagesData } = useSWR(
    `/shared-finances/percentages?month=${monthStart}`,
    fetcher
  );
  const { data: paymentsData } = useSWR(
    `/shared-finances/payments?month=${monthStart}`,
    fetcher
  );

  const percentages = useMemo(
    () => (Array.isArray(percentagesData) ? percentagesData : percentagesData?.users || []),
    [percentagesData]
  );
  const payments = useMemo(
    () => (Array.isArray(paymentsData) ? paymentsData : []),
    [paymentsData]
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [serverError, setServerError] = useState(null);

  const thisMonthExpenses = useMemo(
    () =>
      (sharedFinances || []).filter((e) => isSameMonth(e.due_date, monthStart)),
    [sharedFinances, monthStart]
  );

  const totalMonth = useMemo(
    () => thisMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [thisMonthExpenses]
  );

  const balance = useMemo(() => {
    if (!user || percentages.length === 0 || thisMonthExpenses.length === 0) return 0;
    const myPercentage =
      percentages.find((p) => p.user_id === user.id)?.percentage || 0;
    const shouldPay = totalMonth * (myPercentage / 100);
    const paid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const owed = shouldPay - paid;
    return owed > 0 ? owed : 0;
  }, [user, percentages, thisMonthExpenses, totalMonth, payments]);

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

  const isAdmin = user?.role === "admin";

  const handleSubmit = useCallback(
    async (data) => {
      setServerError(null);
      const payload = buildSharedExpensePayload(data, isAdmin);
      try {
        if (editingExpense) {
          await api.patch(`/shared-expense/${editingExpense.id}`, payload);
        } else {
          await api.post("/shared-expense", payload);
        }
        mutateExpenses();
        closeModal();
      } catch (err) {
        handleServerError(err, setServerError);
      }
    },
    [editingExpense, isAdmin, mutateExpenses, closeModal]
  );

  const handleDelete = useCallback(
    async (expense) => {
      if (!window.confirm(`¿Eliminar "${expense.concept}"?`)) return;
      try {
        await api.delete(`/shared-expense/${expense.id}`);
        mutateExpenses();
      } catch (err) {
        console.error("Error deleting shared expense:", err);
      }
    },
    [mutateExpenses]
  );

  return (
    <>
      <SharedFinanceSummary
        totalMonth={totalMonth}
        balance={balance}
        nextSettlement={monthStart}
        onSettle={() => {
          console.log("Liquidar deudas");
        }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-base font-semibold">Gastos Comunes</h3>
            <div className="flex gap-2 items-center">
              <button
                onClick={openCreate}
                className="px-3 py-1.5 text-xs font-medium bg-primary text-on-primary rounded-lg hover:bg-primary-hover transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Nuevo Gasto
              </button>
              <button className="p-2 border border-outline rounded-lg hover:bg-surface-variant transition-colors material-symbols-outlined">
                filter_list
              </button>
              <button className="p-2 border border-outline rounded-lg hover:bg-surface-variant transition-colors material-symbols-outlined">
                download
              </button>
            </div>
          </div>
          <SharedFinancesTable
            sharedFinances={sharedFinances}
            onEdit={openEdit}
            onDelete={handleDelete}
            onViewAll={() => navigate("/shared-finances/all")}
            maxRows={5}
          />
        </section>
        <SharedFinanceBreakdown
          users={[
            {
              user_id: 1,
              name: "Usuario A",
              initials: "UA",
              percentage: 60,
              shouldPay: 2550,
              hasPaid: 2820,
              balance: 270,
              color: "#1E40AF",
            },
            {
              user_id: 2,
              name: "Usuario B",
              initials: "UB",
              percentage: 40,
              shouldPay: 1700,
              hasPaid: 1430,
              balance: -270,
              color: "#64748B",
            },
          ]}
          salaryInfo="Basado en ingresos declarados de $3.000 y $2.000 respectivamente."
          onAdjustPercentages={() => navigate("/shared-finances/percentages")}
        />
      </div>

      <section className="bg-surface border border-outline p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-semibold">Tendencia de Gastos</h3>
          <select className="bg-transparent border-none text-xs font-medium text-primary focus:ring-0 cursor-pointer">
            <option>Últimos 6 meses</option>
            <option>Este año</option>
          </select>
        </div>
        <div className="h-48 w-full flex items-end gap-4 px-4">
          {["Jun", "Jul", "Ago", "Sep", "Oct", "Nov"].map((m, i) => {
            const heights = ["60%", "45%", "80%", "70%", "55%", "90%"];
            const isLast = i === 5;
            return (
              <div key={m} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-lg relative ${isLast ? "bg-primary" : "bg-surface-variant"}`}
                  style={{ height: heights[i] }}
                >
                  {!isLast && <div className="absolute inset-0 bg-primary opacity-20"></div>}
                </div>
                <span className={`text-xs font-medium ${isLast ? "text-primary font-bold" : "text-text-secondary"}`}>
                  {m}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <SharedExpenseModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        serverError={modalOpen ? serverError : null}
        isAdmin={isAdmin}
        defaultValues={
          editingExpense
            ? {
                concept: editingExpense.concept,
                amount: String(editingExpense.amount),
                frequency: editingExpense.frequency,
                due_date: editingExpense.due_date?.slice(0, 10) || "",
                is_paid: editingExpense.is_paid ? "1" : "0",
                comment: editingExpense.comment || "",
              }
            : undefined
        }
        title={editingExpense ? "Editar gasto compartido" : "Nuevo gasto compartido"}
      />
    </>
  );
}
