const priorityConfig = {
  high: { label: "Alta", className: "bg-error/10 text-error" },
  medium: { label: "Media", className: "bg-surface-variant text-text-primary" },
  low: { label: "Baja", className: "bg-primary-light text-text-primary" },
};

export function TaskCard({ task, variant = "default", onEdit, onDelete }) {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const initials = task.user?.name
    ? task.user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (variant === "completed") {
    return (
      <div className="bg-surface-variant border border-outline p-4 rounded-xl shadow-none line-through decoration-gray-400">
        <div className="flex justify-between items-start mb-2">
          <span
            className={`${priority.className} px-2 py-0.5 rounded-full text-xs font-medium`}
          >
            {priority.label}
          </span>
          <span
            className="material-symbols-outlined text-primary text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>
        <h4 className="text-base font-semibold text-text-secondary mb-2">
          {task.title}
        </h4>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
              {initials}
            </div>
            <span className="text-xs font-medium text-text-secondary">
              {task.user?.name || "Sin asignar"}
            </span>
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
              className="material-symbols-outlined text-text-secondary hover:text-error transition-colors text-[18px]"
              title="Eliminar"
            >
              delete
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-surface border ${variant === "inProgress" ? "border-l-4 border-primary border-y border-r" : "border-outline"} p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group`}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`${priority.className} px-2 py-0.5 rounded-full text-xs font-medium`}
        >
          {priority.label}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="material-symbols-outlined text-text-secondary hover:text-primary transition-colors text-[18px]"
              title="Editar"
            >
              edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
              className="material-symbols-outlined text-text-secondary hover:text-error transition-colors text-[18px]"
              title="Eliminar"
            >
              delete
            </button>
          )}
        </div>
      </div>
      <h4 className="text-base font-semibold text-text-primary mb-2">
        {task.title}
      </h4>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
            {initials}
          </div>
          <span className="text-xs font-medium text-text-secondary">
            {task.user?.name || "Sin asignar"}
          </span>
        </div>
        <div className="flex items-center text-text-secondary gap-1">
          <span className="material-symbols-outlined text-[16px]">
            calendar_today
          </span>
          <span className="text-xs font-medium">
            {task.scheduled_at
              ? new Date(task.scheduled_at).toLocaleDateString()
              : "Sin fecha"}
          </span>
        </div>
      </div>
    </div>
  );
}
