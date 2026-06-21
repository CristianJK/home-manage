import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { TaskCard } from "../features/tasks/TaskCard";
import { TaskModal } from "../features/tasks/TaskModal";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [serverError, setServerError] = useState(null);

  const fetchTasks = useCallback(() => {
    api
      .get("/task")
      .then((res) => setTasks(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching tasks:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openCreate = () => {
    setEditingTask(null);
    setServerError(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setServerError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
    setServerError(null);
  };

  const handleSubmit = async (data) => {
    setServerError(null);
    const payload = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ]),
    );
    try {
      if (editingTask) {
        const res = await api.patch(`/task/${editingTask.id}`, payload);
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? res.data : t)),
        );
      } else {
        const res = await api.post("/task", payload);
        setTasks((prev) => [...prev, res.data]);
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
        setServerError("Error al guardar la tarea. Intenta de nuevo.");
      }
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`¿Eliminar "${task.title}"?`)) return;
    try {
      await api.delete(`/task/${task.id}`);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const pending = tasks.filter((t) => t.status === "pending");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gestión de Tareas</h2>
          <p className="text-sm text-text-secondary">
            Centraliza las responsabilidades domésticas con precisión.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-hover transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nueva tarea
          </button>
        </div>
      </div>

      {serverError && (
        <div className="bg-error-bg border border-error-border text-error-text text-sm rounded-lg p-3 mb-4">
          {serverError}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-text-secondary">
          Cargando tareas...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">Por hacer</h3>
                <span className="bg-surface-variant px-2 py-0.5 rounded-full text-xs font-medium">
                  {pending.length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {pending.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
              <button
                onClick={openCreate}
                className="w-full border-2 border-dashed border-outline rounded-xl p-4 text-sm text-text-secondary hover:border-primary/50 hover:text-primary transition-all cursor-pointer text-center"
              >
                + Añadir tarea
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">En progreso</h3>
                <span className="bg-surface-variant px-2 py-0.5 rounded-full text-xs font-medium">
                  {inProgress.length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {inProgress.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  variant="inProgress"
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">Completado</h3>
                <span className="bg-surface-variant px-2 py-0.5 rounded-full text-xs font-medium">
                  {completed.length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 opacity-60">
              {completed.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  variant="completed"
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </div>
      )}

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
