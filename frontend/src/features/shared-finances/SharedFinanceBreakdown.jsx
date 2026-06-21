export function SharedFinanceBreakdown({ users, salaryInfo, onAdjustPercentages }) {
  if (!users || users.length === 0) {
    return (
      <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm">
        <h3 className="text-base font-semibold px-2 mb-4">Desglose Proporcional</h3>
        <p className="text-sm text-text-secondary text-center py-8">
          No hay usuarios registrados para calcular el desglose.
        </p>
      </div>
    )
  }

  const totalPercentage = users.reduce((sum, u) => sum + u.percentage, 0)

  return (
    <section className="lg:col-span-4 flex flex-col gap-4">
      <h3 className="text-base font-semibold px-2">Desglose Proporcional</h3>
      <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-text-secondary">
            Metodología: Porcentaje Salarial
          </p>
          <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden flex">
            {users.map((user, i) => (
              <div
                key={user.user_id || i}
                className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                style={{
                  width: `${(user.percentage / totalPercentage) * 100}%`,
                  backgroundColor: user.color || '#1E40AF',
                }}
              />
            ))}
          </div>
        </div>

        {users.map((user, i) => {
          const isCredit = user.balance >= 0
          return (
            <div
              key={user.user_id || i}
              className="p-4 rounded-lg bg-surface-variant border border-outline flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white"
                    style={{ backgroundColor: user.color || '#1E40AF' }}
                  >
                    {user.initials}
                  </div>
                  <span className="text-sm font-bold">{user.name}</span>
                </div>
                <span
                  className="text-white px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: user.color || '#1E40AF', opacity: 0.85 }}
                >
                  {user.percentage}% Cuota
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-sm text-text-secondary">Debe aportar:</span>
                <span className="text-base font-semibold text-text-primary">
                  ${Number(user.shouldPay).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-text-secondary">Ha pagado:</span>
                <span className={`text-sm font-bold ${isCredit ? 'text-primary' : 'text-error'}`}>
                  ${Number(user.hasPaid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t border-outline mt-2 pt-2 flex justify-between items-baseline">
                <span className="text-xs font-medium text-text-secondary">
                  {isCredit ? 'Crédito a favor:' : 'Deuda pendiente:'}
                </span>
                <span className={`text-xs font-bold ${isCredit ? 'text-primary' : 'text-error'}`}>
                  {isCredit ? '+' : '-'}${Number(Math.abs(user.balance)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )
        })}

        {salaryInfo && (
          <div className="mt-2">
            <p className="text-sm text-text-secondary italic mb-4">{salaryInfo}</p>
          </div>
        )}

        <button
          onClick={onAdjustPercentages}
          className="w-full py-2 text-primary text-xs font-medium border border-primary rounded-lg hover:bg-primary-light transition-colors"
        >
          Ajustar porcentajes
        </button>
      </div>
    </section>
  )
}
