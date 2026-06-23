import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import useSWR from "swr";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { conceptConfig } from "../lib/constants";
import { formatCurrency, daysUntilDue, formatDateShort } from "../lib/helpers";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: tasks = [] } = useSWR("/task", fetcher);
  const { data: expenses = [] } = useSWR("/shared-expense", fetcher);
  const { data: savings = [], isLoading } = useSWR("/saving-goals", fetcher);

  const now = useMemo(() => new Date(), []);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  const monthName = now.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const monthExpenses = useMemo(
    () =>
      expenses.filter((e) => {
        const d = new Date(e.due_date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }),
    [expenses, currentMonth, currentYear],
  );

  const totalMonth = useMemo(
    () => monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [monthExpenses],
  );

  const expensesByConcept = useMemo(() => {
    const map = {};
    monthExpenses.forEach((e) => {
      const key = e.concept || "other";
      map[key] = (map[key] || 0) + Number(e.amount);
    });
    return map;
  }, [monthExpenses]);

  const urgentPayment = useMemo(
    () =>
      expenses
        .filter((e) => !e.is_paid)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0] || null,
    [expenses],
  );

  const upcomingPayments = useMemo(
    () =>
      expenses
        .filter((e) => !e.is_paid)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 4),
    [expenses],
  );

  const pendingTasks = useMemo(
    () =>
      tasks.filter((t) => t.status === "pending" || t.status === "in_progress"),
    [tasks],
  );

  const handleCompleteTask = useCallback(async (task) => {
    try {
      await api.patch(`/task/${task.id}`, { status: "completed" });
    } catch (err) {
      console.error("Error completing task:", err);
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-primary">
            {greeting}, {user?.name?.split(" ")[0] || "Familia"}.
          </h2>
          <p className="text-base text-text-secondary">
            Aquí tienes el resumen de tu hogar para hoy.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Summary card */}
          <div className="md:col-span-8 bg-surface rounded-xl border border-outline p-4 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text-primary">
                Resumen de gastos
              </h3>
              <span className="text-xs font-medium px-3 py-1 bg-surface-variant rounded-full capitalize">
                {monthName}
              </span>
            </div>
            {monthExpenses.length === 0 ? (
              <div className="text-center py-8 text-sm text-text-secondary">
                Sin gastos compartidos este mes
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row items-center justify-around gap-4 py-4">
                <div className="relative w-48 h-48 rounded-full border-[16px] border-primary flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-xl font-bold block">
                      ${formatCurrency(totalMonth)}
                    </span>
                    <span className="text-xs text-text-secondary">
                      Total Mes
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-full lg:w-auto">
                  {Object.entries(conceptConfig).map(([key, cfg]) => {
                    const amount = expensesByConcept[key];
                    if (!amount) return null;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${cfg.color}`} />
                        <div className="flex justify-between w-full lg:w-48">
                          <span className="text-sm">{cfg.label}</span>
                          <span className="text-xs font-bold text-primary">
                            ${formatCurrency(amount)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="md:col-span-4 flex flex-col gap-4">
            {urgentPayment &&
              (() => {
                const urgency = daysUntilDue(urgentPayment.due_date);
                return (
                  <div
                    className={`rounded-xl p-4 shadow-sm border flex items-start gap-4 ${
                      urgency === "Vencido"
                        ? "bg-error-bg text-error-text border-error/20"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined ${urgency === "Vencido" ? "text-error" : "text-amber-600"}`}
                    >
                      {urgency === "Vencido" ? "error" : "warning"}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-bold">
                        {urgency === "Vencido"
                          ? "Pago Vencido"
                          : "Pago Urgente"}
                      </span>
                      <p className="text-sm">
                        {conceptConfig[urgentPayment.concept]?.label ||
                          urgentPayment.concept}{" "}
                        {urgency === "Hoy"
                          ? "vence hoy"
                          : `vence en ${urgency}`}
                        .
                      </p>
                      <span className="text-lg font-semibold mt-1">
                        ${formatCurrency(urgentPayment.amount)}
                      </span>
                    </div>
                  </div>
                );
              })()}

            <div className="bg-surface border border-outline rounded-xl p-4 shadow-sm flex flex-col gap-3 flex-1">
              <h3 className="text-base font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  event_upcoming
                </span>
                Próximos Pagos
              </h3>
              {upcomingPayments.length === 0 ? (
                <p className="text-sm text-text-secondary py-2">
                  No hay pagos pendientes
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {upcomingPayments.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-surface-variant transition-colors"
                    >
                      <span className="text-sm font-medium">
                        {conceptConfig[exp.concept]?.label || exp.concept}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-surface-variant px-2 py-0.5 rounded font-medium">
                          {formatDateShort(exp.due_date)}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          ${formatCurrency(exp.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tasks */}
          <div className="md:col-span-6 bg-surface rounded-xl border border-outline p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Tareas pendientes
              </h3>
              <button
                onClick={() => navigate("/tasks")}
                className="text-primary text-xs font-medium hover:underline"
              >
                Ver todas
              </button>
            </div>
            {pendingTasks.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-8">
                No hay tareas pendientes
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {pendingTasks.slice(0, 5).map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant border border-transparent hover:border-outline transition-all group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary">
                          assignment
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {task.user?.name
                            ? `Responsable: ${task.user.name}`
                            : task.scheduled_at
                              ? formatDateShort(task.scheduled_at)
                              : "Sin fecha"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCompleteTask(task)}
                      className="material-symbols-outlined text-text-secondary hover:text-primary transition-colors shrink-0"
                      title="Marcar como completada"
                    >
                      check_circle
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Savings */}
          <div className="md:col-span-6 bg-surface rounded-xl border border-outline p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Metas de ahorro
              </h3>
              <button
                onClick={() => navigate("/savings")}
                className="text-primary text-xs font-medium hover:underline"
              >
                Ver todas
              </button>
            </div>
            {isLoading ? (
              <div className="text-center py-8 text-sm text-text-secondary">
                Cargando...
              </div>
            ) : savings.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-8">
                No hay metas de ahorro
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {savings.slice(0, 3).map((goal) => {
                  const pct = Math.min(
                    Math.round(
                      (Number(goal.current_amount) /
                        Number(goal.target_amount)) *
                        100,
                    ),
                    100,
                  );
                  return (
                    <div key={goal.id} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-sm font-semibold">
                            {goal.target_name || goal.name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            Meta: ${formatCurrency(goal.target_amount)}
                          </p>
                        </div>
                        <span className="text-lg font-semibold text-primary">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-12 relative h-48 rounded-2xl overflow-hidden shadow-md mt-4">
          <img
            alt="Modern Kitchen"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7wD2JISQHrSaz_lJANQCD392ZHIAapQgrl2mQdzEXNX_qVE_RN3X9yd4SSQDvpTHxg1F59745-2IOOZSglQheqdMr2vBPuQ37s4JI_jZMPCWnWuDPCeOiZweQErcWbO6NGWbV-JCyFuWYSMqVzx_dedCNgsm13999mHj5GpEw5zgMa9evaTHrqIrulSN8icy72IoykcqIxY1oQLesAo50XGfZQRxtv0yZi94U-aT_EPocEFo8X7GDUifVWL6STQpdBJL8iQ53Yjg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex flex-col justify-center px-12 text-on-primary">
            <h4 className="text-2xl font-bold">Gestiona tu hogar con calma</h4>
            <p className="text-base">
              Cada tarea completada es un paso hacia la tranquilidad.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
