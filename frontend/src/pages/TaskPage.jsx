import { useState, useCallback, useMemo } from "react";
import useSWR from "swr";
import api from "../services/api";
import { TaskCard } from "../features/tasks/TaskCard";
import { TaskModal } from "../features/tasks/TaskModal";
import { handleServerError } from "../lib/errors";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function TaskPage() {
  const { data: tasks = [], mutate } = useSWR("/task", fetcher);
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

  const pending = useMemo(
    () => tasks.filter((t) => t.status === "pending").slice(0, 3),
    [tasks, 3],
  );
  const inProgress = useMemo(
    () => tasks.filter((t) => t.status === "in_progress").slice(0, 3),
    [tasks, 3],
  );
  const completed = useMemo(
    () => tasks.filter((t) => t.status === "completed").slice(0, 3),
    [tasks, 3],
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gestión de Tareas</h2>
          <p className="text-sm text-text-secondary">
            Centraliza las responsabilidades domésticas con precisión.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-hover transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nueva tarea
        </button>
      </div>

      {serverError && (
        <div className="bg-error-bg border border-error-border text-error-text text-sm rounded-lg p-3 mb-4">
          {serverError}
        </div>
      )}

      {tasks.length === 0 ? (
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
