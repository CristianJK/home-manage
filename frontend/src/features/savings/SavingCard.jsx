const categoryConfig = {
  emergency: {
    icon: 'account_balance',
    label: 'Fondo de Emergencia',
    bg: 'bg-primary-light',
    color: 'text-primary',
    bar: 'bg-primary',
  },
  travel: {
    icon: 'flight_takeoff',
    label: 'Viajes',
    bg: 'bg-surface-variant',
    color: 'text-text-primary',
    bar: 'bg-emerald-500',
  },
  housing: {
    icon: 'home',
    label: 'Vivienda',
    bg: 'bg-surface-variant',
    color: 'text-text-primary',
    bar: 'bg-primary',
  },
  education: {
    icon: 'school',
    label: 'Educación',
    bg: 'bg-surface-variant',
    color: 'text-text-primary',
    bar: 'bg-violet-500',
  },
  health: {
    icon: 'favorite',
    label: 'Salud',
    bg: 'bg-surface-variant',
    color: 'text-text-primary',
    bar: 'bg-rose-500',
  },
  investment: {
    icon: 'trending_up',
    label: 'Inversión',
    bg: 'bg-surface-variant',
    color: 'text-text-primary',
    bar: 'bg-amber-500',
  },
  other: {
    icon: 'savings',
    label: 'Otro',
    bg: 'bg-surface-variant',
    color: 'text-text-primary',
    bar: 'bg-primary',
  },
}

export function SavingCard({ saving, onEdit, onDelete }) {
  const cat = categoryConfig[saving.category] || categoryConfig.other
  const progress = saving.target_amount > 0
    ? Math.round((saving.current_amount / saving.target_amount) * 100)
    : 0

  return (
    <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${cat.bg} rounded-lg`}>
          <span className={`material-symbols-outlined ${cat.color}`}>{cat.icon}</span>
        </div>
        <div className="flex items-center gap-1">
          {saving.deadline && (
            <span className="text-xs font-medium px-2 py-1 bg-surface-variant rounded text-text-secondary">
              {new Date(saving.deadline).toLocaleDateString()}
            </span>
          )}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(saving) }}
                className="material-symbols-outlined text-text-secondary hover:text-primary transition-colors text-[18px]"
                title="Editar"
              >
                edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(saving) }}
                className="material-symbols-outlined text-text-secondary hover:text-error transition-colors text-[18px]"
                title="Eliminar"
              >
                delete
              </button>
            )}
          </div>
        </div>
      </div>
      <h3 className="text-base font-semibold mb-1">{saving.target_name}</h3>
      {saving.category && (
        <p className="text-xs font-medium text-text-secondary mb-4">{cat.label}</p>
      )}
      <div className="flex justify-between items-end mb-2">
        <span className="text-base font-semibold text-primary">
          ${Number(saving.current_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-xs font-medium text-text-secondary">
          Meta: ${Number(saving.target_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mb-2">
        <div
          className={`${cat.bar} h-full transition-all duration-1000`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-xs font-medium text-right text-text-secondary">
        {progress}% Completado
      </p>
    </div>
  )
}
