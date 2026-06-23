import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const conceptConfig = {
  rent: { icon: "home", label: "Renta" },
  water: { icon: "water_drop", label: "Agua" },
  electricity: { icon: "bolt", label: "Electricidad" },
  internet: { icon: "wifi", label: "Internet" },
  gas: { icon: "local_fire_department", label: "Gas" },
  other: { icon: "more_horiz", label: "Otro" },
};

export default function LogisticsCalendarPage() {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [completingTaskId, setCompletingTaskId] = useState(null);

  const fetchTasks = useCallback(() => {
    api.get("/task")
      .then((res) => setTasks(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const fetchExpenses = useCallback(() => {
    api.get("/shared-expense")
      .then((res) => setExpenses(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching shared expenses:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchExpenses();
  }, [fetchTasks, fetchExpenses]);

  const events = useMemo(() => {
    const result = [];
    tasks.forEach((task) => {
      if (!task.scheduled_at) return;
      const d = new Date(task.scheduled_at);
      result.push({
        id: `task-${task.id}`,
        type: "task",
        date: d,
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        data: task,
      });
    });
    expenses.forEach((expense) => {
      if (!expense.due_date) return;
      const d = new Date(expense.due_date);
      result.push({
        id: `expense-${expense.id}`,
        type: "expense",
        date: d,
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        data: expense,
      });
    });
    return result;
  }, [tasks, expenses]);

  const monthEvents = useMemo(
    () => events.filter((e) => e.month === currentMonth && e.year === currentYear),
    [events, currentMonth, currentYear],
  );

  const eventsByDay = useMemo(() => {
    const map = {};
    monthEvents.forEach((e) => {
      if (!map[e.day]) map[e.day] = [];
      map[e.day].push(e);
    });
    return map;
  }, [monthEvents]);

  const dayEvents = selectedDay ? eventsByDay[selectedDay] || [] : [];

  const upcomingPayments = useMemo(
    () =>
      expenses
        .filter((e) => !e.is_paid)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 5),
    [expenses],
  );

  const goToToday = () => {
    const d = new Date();
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
    setSelectedDay(d.getDate());
  };

  const goToPrevMonth = () => {
    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
    setSelectedDay(null);
  };

  const handleCompleteTask = async (task) => {
    setCompletingTaskId(task.id);
    try {
      const res = await api.patch(`/task/${task.id}`, { status: "completed" });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? res.data : t)),
      );
    } catch (err) {
      console.error("Error completing task:", err);
    } finally {
      setCompletingTaskId(null);
    }
  };

  const firstDay = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const calendarDays = [];
  for (let i = 0; i < startOffset; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const isToday = (day) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const eventsCount = (day) => (eventsByDay[day] ? eventsByDay[day].length : 0);

  const formatDate = (date) =>
    date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-grow min-w-0">
        <div className="bg-surface rounded-xl border border-outline shadow-sm overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-outline">
            <div>
              <h2 className="text-xl font-bold text-primary">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <p className="text-sm text-text-secondary">
                {monthEvents.length}{" "}
                {monthEvents.length === 1 ? "evento" : "eventos"} programados
              </p>
            </div>
            <div className="flex items-center gap-2 bg-surface-variant p-1 rounded-lg">
              <button
                onClick={goToPrevMonth}
                className="p-2 hover:bg-surface rounded-md transition-colors material-symbols-outlined"
              >
                chevron_left
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-surface text-xs font-medium rounded-md shadow-sm hover:bg-surface-variant transition-colors"
              >
                Hoy
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-surface rounded-md transition-colors material-symbols-outlined"
              >
                chevron_right
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-outline bg-surface-variant">
            {DAYS.map((d) => (
              <div
                key={d}
                className={`p-3 text-center text-xs font-medium uppercase tracking-wider ${
                  d === "Dom" ? "text-error" : "text-text-secondary"
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                onClick={() => day && setSelectedDay(day)}
                className={`p-2 min-h-[80px] transition-colors cursor-pointer ${
                  day ? "bg-surface hover:bg-surface-variant" : "bg-surface-variant/30"
                } border-r border-b border-outline ${
                  selectedDay === day ? "ring-2 ring-inset ring-primary bg-primary/5" : ""
                } ${idx % 7 === 6 ? "border-r-0" : ""}`}
              >
                {day && (
                  <>
                    {isToday(day) ? (
                      <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center ml-auto text-xs font-medium">
                        {day}
                      </span>
                    ) : (
                      <span
                        className={`block text-right text-xs font-medium ${
                          selectedDay === day
                            ? "text-primary font-bold"
                            : "text-text-secondary"
                        }`}
                      >
                        {day}
                      </span>
                    )}
                    {eventsCount(day) > 0 && (
                      <div className="mt-1.5 flex flex-col gap-0.5">
                        {eventsByDay[day].slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 truncate ${
                              event.type === "task"
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "bg-error/10 text-error border border-error/30"
                            }`}
                            title={
                              event.type === "task"
                                ? event.data.title
                                : conceptConfig[event.data.concept]?.label ||
                                  event.data.concept
                            }
                          >
                            <span className="material-symbols-outlined !text-[10px] shrink-0">
                              {event.type === "task" ? "check_circle" : "payments"}
                            </span>
                            <span className="truncate">
                              {event.type === "task"
                                ? event.data.title
                                : conceptConfig[event.data.concept]?.label ||
                                  event.data.concept}
                            </span>
                          </div>
                        ))}
                        {eventsCount(day) > 2 && (
                          <span className="text-[10px] text-text-secondary font-medium pl-1">
                            +{eventsCount(day) - 2} más
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="lg:w-80 flex flex-col gap-4">
        <div className="bg-surface rounded-xl border border-outline shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-primary">
              Detalle del Evento
            </h3>
            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                className="material-symbols-outlined text-text-secondary hover:text-text-primary transition-colors"
              >
                close
              </button>
            )}
          </div>

          {!selectedDay ? (
            <p className="text-sm text-text-secondary text-center py-8">
              Selecciona un día para ver los detalles
            </p>
          ) : dayEvents.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8">
              Sin eventos este día
            </p>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-surface-variant rounded-lg p-3 border border-outline space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        event.type === "task"
                          ? "bg-primary/10 text-primary"
                          : "bg-error/10 text-error"
                      }`}
                    >
                      {event.type === "task" ? "Tarea" : "Gasto Compartido"}
                    </span>
                    {event.type === "task" &&
                      event.data.status === "completed" && (
                        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                          Completada
                        </span>
                      )}
                    {event.type === "expense" && event.data.is_paid && (
                      <span className="text-[10px] font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                        Pagado
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-text-primary">
                    {event.type === "task"
                      ? event.data.title
                      : conceptConfig[event.data.concept]?.label ||
                        event.data.concept}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <span className="material-symbols-outlined !text-[14px]">
                      calendar_today
                    </span>
                    <span>{formatDate(event.date)}</span>
                  </div>

                  {event.type === "expense" && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-primary">
                        $
                        {Number(event.data.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-[10px] text-text-secondary capitalize">
                        {event.data.frequency}
                      </span>
                    </div>
                  )}

                  {event.type === "task" && event.data.description && (
                    <p className="text-xs text-text-secondary italic">
                      &ldquo;{event.data.description}&rdquo;
                    </p>
                  )}

                  {event.type === "task" && event.data.user && (
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-[10px]">
                        {event.data.user.name
                          ?.split(" ")
                          .map((w) => w[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "?"}
                      </div>
                      <span className="text-xs font-medium text-text-secondary">
                        {event.data.user.name || "Sin asignar"}
                      </span>
                    </div>
                  )}

                  {event.data.frequency && (
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <span className="material-symbols-outlined !text-[14px]">
                        repeat
                      </span>
                      <span className="capitalize">
                        {event.data.frequency === "monthly"
                          ? "Mensual"
                          : event.data.frequency === "weekly"
                            ? "Semanal"
                            : event.data.frequency === "daily"
                              ? "Diaria"
                              : event.data.frequency === "yearly"
                                ? "Anual"
                                : event.data.frequency === "unique"
                                  ? "Único"
                                  : event.data.frequency === "biweekly"
                                    ? "Quincenal"
                                    : event.data.frequency === "semiannual"
                                      ? "Semestral"
                                      : event.data.frequency}
                      </span>
                    </div>
                  )}

                  {event.type === "task" &&
                    event.data.status !== "completed" && (
                      <button
                        onClick={() => handleCompleteTask(event.data)}
                        disabled={completingTaskId === event.data.id}
                        className="w-full bg-primary text-white py-2 rounded-lg text-xs font-semibold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {completingTaskId === event.data.id ? (
                          <>
                            <svg
                              className="animate-spin h-3.5 w-3.5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Completando...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined !text-[16px]">
                              done_all
                            </span>
                            Marcar como completada
                          </>
                        )}
                      </button>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-primary text-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance_wallet
            </span>
            <h3 className="text-base font-semibold">Próximos Pagos</h3>
          </div>
          {upcomingPayments.length === 0 ? (
            <p className="text-sm text-white/70">No hay pagos pendientes</p>
          ) : (
            <div className="space-y-2">
              {upcomingPayments.map((exp) => (
                <div
                  key={exp.id}
                  className="flex justify-between items-center bg-white/10 p-2 rounded border border-white/20"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined !text-[16px] text-white/70 shrink-0">
                      {conceptConfig[exp.concept]?.icon || "more_horiz"}
                    </span>
                    <span className="text-sm truncate">
                      {conceptConfig[exp.concept]?.label || exp.concept}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-sm">
                      ${Number(exp.amount).toLocaleString()}
                    </span>
                    <br />
                    <span className="text-[10px] text-white/70">
                      {new Date(exp.due_date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate("/shared-finances")}
            className="mt-4 w-full bg-surface text-primary py-2 rounded-lg text-xs font-medium hover:bg-surface/90 transition-all"
          >
            Gestionar Finanzas
          </button>
        </div>
      </aside>
    </div>
  );
}
