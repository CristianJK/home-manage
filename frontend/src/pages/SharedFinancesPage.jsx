import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { SharedFinancesTable } from "../features/shared-finances/SharedFinancesTable";
import { SharedFinanceSummary } from "../features/shared-finances/SharedFinanceSummary";
import { SharedFinanceBreakdown } from "../features/shared-finances/SharedFinanceBreakdown";
import { SharedExpenseModal } from "../features/shared-finances/SharedExpenseModal";

export default function SharedFinancesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sharedFinances, setSharedFinances] = useState([]);
  const [percentages, setPercentages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [serverError, setServerError] = useState(null);

  const monthStart = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  }, []);

  const fetchShared = useCallback(() => {
    api
      .get("/shared-expense")
      .then((res) => setSharedFinances(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching shared expenses:", err));
  }, []);

  const fetchPercentages = useCallback(() => {
    api
      .get(`/shared-finances/percentages?month=${monthStart}`)
      .then((res) => setPercentages(res.data?.users || []))
      .catch(() => {});
  }, [monthStart]);

  const fetchPayments = useCallback(() => {
    api
      .get(`/shared-finances/payments?month=${monthStart}`)
      .then((res) => setPayments(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, [monthStart]);

  useEffect(() => {
    fetchShared();
    fetchPercentages();
    fetchPayments();
  }, [fetchShared, fetchPercentages, fetchPayments]);

  const thisMonthExpenses = useMemo(
    () =>
      sharedFinances.filter((e) => {
        if (!e.due_date) return false;
        const d = e.due_date.slice(0, 7);
        return d === monthStart.slice(0, 7);
      }),
    [sharedFinances, monthStart],
  );

  const totalMonth = useMemo(
    () => thisMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [thisMonthExpenses],
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

  const openCreate = () => {
    setEditingExpense(null);
    setServerError(null);
    setModalOpen(true);
  };

  const openEdit = (expense) => {
    setEditingExpense(expense);
    setServerError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingExpense(null);
    setServerError(null);
  };

  const handleSubmit = async (data) => {
    setServerError(null);
    const payload = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        key === "amount"
          ? Number(value)
          : key === "is_paid"
            ? value === "1"
            : value === ""
              ? null
              : value,
      ]),
    );
    try {
      if (editingExpense) {
        const res = await api.patch(
          `/shared-expense/${editingExpense.id}`,
          payload,
        );
        setSharedFinances((prev) =>
          prev.map((e) => (e.id === editingExpense.id ? res.data : e)),
        );
      } else {
        const res = await api.post("/shared-expense", payload);
        setSharedFinances((prev) => [...prev, res.data]);
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
        setServerError("Error al guardar el gasto. Intenta de nuevo.");
      }
    }
  };

  const handleDelete = async (expense) => {
    if (!window.confirm(`¿Eliminar "${expense.concept}"?`)) return;
    try {
      await api.delete(`/shared-expense/${expense.id}`);
      setSharedFinances((prev) => prev.filter((e) => e.id !== expense.id));
    } catch (err) {
      console.error("Error deleting shared expense:", err);
    }
  };

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
            onViewAll={() => navigate('/shared-finances/all')}
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
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-variant rounded-t-lg relative"
              style={{ height: "60%" }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Jun</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-variant rounded-t-lg relative"
              style={{ height: "45%" }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Jul</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-variant rounded-t-lg relative"
              style={{ height: "80%" }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Ago</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-variant rounded-t-lg relative"
              style={{ height: "70%" }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Sep</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-variant rounded-t-lg relative"
              style={{ height: "55%" }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Oct</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-primary rounded-t-lg"
              style={{ height: "90%" }}
            ></div>
            <span className="text-xs font-medium text-primary font-bold">
              Nov
            </span>
          </div>
        </div>
      </section>

      <SharedExpenseModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        serverError={modalOpen ? serverError : null}
        defaultValues={
          editingExpense
            ? {
                concept: editingExpense.concept,
                amount: String(editingExpense.amount),
                frequency: editingExpense.frequency,
                due_date: editingExpense.due_date
                  ? editingExpense.due_date.slice(0, 10)
                  : "",
                is_paid: editingExpense.is_paid ? "1" : "0",
                comment: editingExpense.comment || "",
              }
            : undefined
        }
        title={
          editingExpense ? "Editar gasto compartido" : "Nuevo gasto compartido"
        }
      />
    </>
  );
}
