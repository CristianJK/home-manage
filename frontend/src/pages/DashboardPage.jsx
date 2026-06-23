import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const conceptConfig = {
  rent: { icon: "home", label: "Renta", color: "bg-primary" },
  water: { icon: "water_drop", label: "Agua", color: "bg-sky-500" },
  electricity: { icon: "bolt", label: "Electricidad", color: "bg-amber-500" },
  internet: { icon: "wifi", label: "Internet", color: "bg-violet-500" },
  gas: { icon: "local_fire_department", label: "Gas", color: "bg-orange-500" },
  other: { icon: "more_horiz", label: "Otros", color: "bg-slate-500" },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(() => {
    api
      .get("/task")
      .then((res) => setTasks(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  const fetchExpenses = useCallback(() => {
    api
      .get("/shared-expense")
      .then((res) => setExpenses(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  const fetchSavings = useCallback(() => {
    api
      .get("/saving-goals")
      .then((res) => setSavings(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchExpenses();
    fetchSavings();
  }, [fetchTasks, fetchExpenses, fetchSavings]);

  const now = new Date();
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
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 1)[0] || null,
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

  const handleCompleteTask = async (task) => {
    try {
      const res = await api.patch(`/task/${task.id}`, {
        status: "completed",
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data : t)));
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

  const daysUntilDue = (dueDate) => {
    const diff = Math.ceil(
      (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24),
    );
    if (diff < 0) return "Vencido";
    if (diff === 0) return "Hoy";
    if (diff === 1) return "Mañana";
    return `${diff} días`;
  };

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
          <div className="md:col-span-8 bg-surface rounded-xl border border-outline p-4 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text-primary">
                Resumen de gastos
              </h3>
              <span className="text-xs font-medium px-3 py-1 bg-surface-variant rounded-full capitalize">
                {monthName}
              </span>
            </div>
            {loading ? (
              <div className="text-center py-8 text-sm text-text-secondary">
                Cargando...
              </div>
            ) : monthExpenses.length === 0 ? (
              <div className="text-center py-8 text-sm text-text-secondary">
                Sin gastos compartidos este mes
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row items-center justify-around gap-4 py-4">
                <div className="relative w-48 h-48 rounded-full border-[16px] border-primary flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-xl font-bold block">
                      $
                      {totalMonth.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
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
                        <div
                          className={`w-3 h-3 rounded-full ${cfg.color}`}
                        ></div>
                        <div className="flex justify-between w-full lg:w-48">
                          <span className="text-sm">{cfg.label}</span>
                          <span className="text-xs font-bold text-primary">
                            $
                            {amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
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
            {urgentPayment && (
              <div
                className={`rounded-xl p-4 shadow-sm border flex items-start gap-4 ${
                  daysUntilDue(urgentPayment.due_date) === "Vencido"
                    ? "bg-error-bg text-error-text border-error/20"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${
                    daysUntilDue(urgentPayment.due_date) === "Vencido"
                      ? "text-error"
                      : "text-amber-600"
                  }`}
                >
                  {daysUntilDue(urgentPayment.due_date) === "Vencido"
                    ? "error"
                    : "warning"}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-base font-bold">
                    {daysUntilDue(urgentPayment.due_date) === "Vencido"
                      ? "Pago Vencido"
                      : "Pago Urgente"}
                  </span>
                  <p className="text-sm">
                    {conceptConfig[urgentPayment.concept]?.label ||
                      urgentPayment.concept}{" "}
                    {daysUntilDue(urgentPayment.due_date) === "Hoy"
                      ? "vence hoy"
                      : `vence en ${daysUntilDue(urgentPayment.due_date)}`}
                    .
                  </p>
                  <span className="text-lg font-semibold mt-1">
                    $
                    {Number(urgentPayment.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            )}
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
                          {new Date(exp.due_date).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          ${Number(exp.amount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

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
            {loading ? (
              <div className="text-center py-8 text-sm text-text-secondary">
                Cargando...
              </div>
            ) : pendingTasks.length === 0 ? (
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
                              ? new Date(task.scheduled_at).toLocaleDateString(
                                  "es-ES",
                                  {
                                    day: "numeric",
                                    month: "short",
                                  },
                                )
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
            {loading ? (
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
                          <p className="text-sm font-semibold">{goal.name}</p>
                          <p className="text-xs text-text-secondary">
                            Meta: ${Number(goal.target_amount).toLocaleString()}
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
                        ></div>
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
