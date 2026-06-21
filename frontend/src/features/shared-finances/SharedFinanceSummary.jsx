export function SharedFinanceSummary({ totalMonth, balance, nextSettlement, onSettle }) {
  const balanceColor = balance >= 0 ? 'text-primary' : 'text-error'
  const balanceText = balance >= 0
    ? 'Tienes saldo a favor'
    : 'Debes liquidar con los demás'

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm">
        <p className="text-xs font-medium text-text-secondary mb-1">
          Gasto Total del Mes
        </p>
        <h2 className="text-2xl font-bold text-primary">
          ${Number(totalMonth).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
      </div>
      <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm">
        <p className="text-xs font-medium text-text-secondary mb-1">
          Tu Balance
        </p>
        <h2 className={`text-2xl font-bold ${balanceColor}`}>
          {balance >= 0 ? '+' : ''}${Number(Math.abs(balance)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <p className="text-sm text-text-secondary mt-2">
          {balanceText}
        </p>
      </div>
      <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm flex flex-col justify-between">
        <div>
          <p className="text-xs font-medium text-text-secondary mb-1">
            Siguiente Liquidación
          </p>
          <h2 className="text-base font-semibold text-text-primary">
            {nextSettlement
              ? new Date(nextSettlement).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
              : '—'}
          </h2>
        </div>
        <button
          onClick={onSettle}
          className="mt-4 w-full bg-primary text-white py-3 rounded-lg text-xs font-medium hover:bg-primary-hover transition-colors active:scale-95"
        >
          Liquidar deudas
        </button>
      </div>
    </section>
  )
}
