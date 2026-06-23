import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useSWR from "swr";
import api from "../services/api";
import { TaskModal } from "../features/tasks/TaskModal";
import { handleServerError } from "../lib/errors";

const fetcher = (url) => api.get(url).then((res) => res.data);

const statusLabels = {
  pending: "Pendiente",
  in_progress: "En progreso",
  completed: "Completado",
  cancelled: "Cancelado",
};

const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-gray-100 text-gray-500",
};

const frequencyLabels = {
  daily: "Diario",
  weekly: "Semanal",
  monthly: "Mensual",
  yearly: "Anual",
};

export default function AllTasksPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get("status") || "";

  const { data: tasks = [], isLoading, mutate } = useSWR("/task", fetcher);

  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState(statusParam);
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [serverError, setServerError] = useState(null);

  const openCreate = useCallback(() => {
    setEditingTask(null);
    setServerError(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((task) => {
    setEditingTask(task);
    setServerError(null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingTask(null);
    setServerError(null);
  }, []);

  const handleSubmit = useCallback(
    async (data) => {
      setServerError(null);
      const payload = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === "" ? null : value,
        ]),
      );
      try {
        if (editingTask) {
          await api.patch(`/task/${editingTask.id}`, payload);
        } else {
          await api.post("/task", payload);
        }
        mutate();
        closeModal();
      } catch (err) {
        handleServerError(err, setServerError);
      }
    },
    [editingTask, mutate, closeModal],
  );

  const handleDelete = useCallback(
    async (task) => {
      if (!window.confirm(`¿Eliminar "${task.title}"?`)) return;
      try {
        await api.delete(`/task/${task.id}`);
        mutate();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    },
    [mutate],
  );

  const filtered = useMemo(
    () =>
      tasks.filter((t) => {
        if (filterName) {
          const name = (t.title || "").toLowerCase();
          if (!name.includes(filterName.toLowerCase())) return false;
        }
        if (filterStatus && filterStatus !== "all") {
          if (t.status !== filterStatus) return false;
        }
        if (
          filterDateFrom &&
          t.scheduled_at &&
          t.scheduled_at.slice(0, 10) < filterDateFrom
        )
          return false;
        if (
          filterDateTo &&
          t.scheduled_at &&
          t.scheduled_at.slice(0, 10) > filterDateTo
        )
          return false;
        return true;
      }),
    [tasks, filterName, filterStatus, filterDateFrom, filterDateTo],
  );

  return (
    <>
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate("/tasks")}
                className="material-symbols-outlined text-text-secondary hover:text-primary transition-colors text-[20px]"
                title="Volver"
              >
                arrow_back
              </button>
              <h1 className="text-2xl font-bold text-text-primary">
                Todas las Tareas
              </h1>
            </div>
            <p className="text-base text-text-secondary">
              Visualiza y filtra todas las tareas del hogar.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-hover transition-all flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nueva tarea
          </button>
        </div>
      </header>

      {serverError && (
        <div className="bg-error-bg border border-error-border text-error-text text-sm rounded-lg p-3 mb-4">
          {serverError}
        </div>
      )}

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
              placeholder="Filtrar por título..."
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
              <option value="pending">Pendiente</option>
              <option value="in_progress">En progreso</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
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
        {isLoading ? (
          <div className="text-center py-12 text-text-secondary">
            Cargando tareas...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            No se encontraron tareas con los filtros aplicados.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-variant border-b border-outline">
              <tr>
                <th className="p-4 text-xs font-medium text-text-secondary">
                  Título
                </th>
                <th className="p-4 text-xs font-medium text-text-secondary hidden sm:table-cell">
                  Descripción
                </th>
                <th className="p-4 text-xs font-medium text-text-secondary">
                  Estado
                </th>
                <th className="p-4 text-xs font-medium text-text-secondary hidden md:table-cell">
                  Frecuencia
                </th>
                <th className="p-4 text-xs font-medium text-text-secondary">
                  Fecha
                </th>
                <th className="p-4 text-xs font-medium text-text-secondary hidden lg:table-cell">
                  Asignado
                </th>
                <th className="p-4 text-xs font-medium text-text-secondary w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {filtered.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-surface-variant/50 transition-colors"
                >
                  <td className="p-4">
                    <span className="text-sm font-medium">{task.title}</span>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="text-sm text-text-secondary line-clamp-1">
                      {task.description || "—"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[task.status] || "bg-gray-100 text-gray-500"}`}
                    >
                      {statusLabels[task.status] || task.status}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-sm text-text-secondary">
                      {frequencyLabels[task.frequency] || task.frequency || "—"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-text-secondary">
                      {task.scheduled_at
                        ? new Date(task.scheduled_at).toLocaleDateString(
                            "es-ES",
                          )
                        : "—"}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {task.user?.name
                          ? task.user.name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : "?"}
                      </div>
                      <span className="text-sm text-text-secondary">
                        {task.user?.name || "Sin asignar"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(task)}
                        className="material-symbols-outlined text-text-secondary hover:text-primary transition-colors text-[18px]"
                        title="Editar"
                      >
                        edit
                      </button>
                      <button
                        onClick={() => handleDelete(task)}
                        className="material-symbols-outlined text-text-secondary hover:text-error transition-colors text-[18px]"
                        title="Eliminar"
                      >
                        delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <TaskModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        serverError={modalOpen ? serverError : null}
        defaultValues={
          editingTask
            ? {
                title: editingTask.title,
                description: editingTask.description || "",
                status: editingTask.status,
                frequency: editingTask.frequency || "",
                scheduled_at: editingTask.scheduled_at
                  ? editingTask.scheduled_at.slice(0, 10)
                  : "",
              }
            : undefined
        }
        title={editingTask ? "Editar tarea" : "Nueva tarea"}
      />
    </>
  );
}
