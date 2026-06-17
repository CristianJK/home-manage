export default function LogisticsCalendarPage() {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex-grow">
          <div className="bg-surface rounded-xl border border-outline shadow-sm overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-outline">
              <div>
                <h2 className="text-xl font-bold text-primary">
                  Octubre 2023
                </h2>
                <p className="text-sm text-text-secondary">
                  4 eventos pendientes para esta semana
                </p>
              </div>
              <div className="flex items-center gap-2 bg-surface-variant p-1 rounded-lg">
                <button className="p-2 hover:bg-surface rounded-md transition-colors material-symbols-outlined">
                  chevron_left
                </button>
                <button className="px-4 py-2 bg-surface text-xs font-medium rounded-md shadow-sm">
                  Hoy
                </button>
                <button className="p-2 hover:bg-surface rounded-md transition-colors material-symbols-outlined">
                  chevron_right
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-outline bg-surface-variant">
              <div className="p-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                Lun
              </div>
              <div className="p-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                Mar
              </div>
              <div className="p-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                Mié
              </div>
              <div className="p-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                Jue
              </div>
              <div className="p-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                Vie
              </div>
              <div className="p-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                Sáb
              </div>
              <div className="p-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider text-error">
                Dom
              </div>
            </div>

            <div className="grid grid-cols-7 bg-surface-variant/20">
              <div className="p-2 border-r border-b border-outline bg-surface-variant/30"></div>
              <div className="p-2 border-r border-b border-outline bg-surface-variant/30"></div>
              <div className="p-2 border-r border-b border-outline bg-surface-variant/30"></div>

              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors cursor-pointer group">
                <span className="block text-right text-xs font-medium text-text-secondary group-hover:text-primary">
                  1
                </span>
                <div className="mt-2 flex flex-col gap-1">
                  <div className="px-2 py-1 rounded bg-surface-variant/50 text-[10px] font-bold text-text-primary flex items-center gap-1 border border-outline">
                    <span className="material-symbols-outlined !text-[12px]">
                      check_circle
                    </span>
                    <span className="truncate">Limpiar cocina</span>
                  </div>
                </div>
              </div>

              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors cursor-pointer group">
                <span className="block text-right text-xs font-medium text-text-secondary">
                  2
                </span>
              </div>

              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors cursor-pointer group border-primary/20 bg-primary/5">
                <span className="block text-right text-xs font-medium font-bold text-primary">
                  3
                </span>
                <div className="mt-2 flex flex-col gap-1">
                  <div className="px-2 py-1 rounded bg-error/10 text-[10px] font-bold text-error flex items-center gap-1 border border-error/30 shadow-sm">
                    <span
                      className="material-symbols-outlined !text-[12px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      payments
                    </span>
                    <span className="truncate">Pago de Luz</span>
                  </div>
                  <div className="px-2 py-1 rounded bg-surface-variant/50 text-[10px] font-bold text-text-primary flex items-center gap-1 border border-outline">
                    <span className="material-symbols-outlined !text-[12px]">
                      check_circle
                    </span>
                    <span className="truncate">Lavandería</span>
                  </div>
                </div>
              </div>

              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium">4</span>
              </div>
              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium">5</span>
              </div>
              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium">6</span>
                <div className="mt-2">
                  <div className="px-2 py-1 rounded bg-error/10 text-[10px] font-bold text-error flex items-center gap-1 border border-error/30">
                    <span
                      className="material-symbols-outlined !text-[12px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      payments
                    </span>
                    <span className="truncate">Alquiler</span>
                  </div>
                </div>
              </div>
              <div className="p-2 border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium text-error">7</span>
              </div>

              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium">8</span>
              </div>

              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium">9</span>
              </div>
              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium">10</span>
              </div>
              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium">11</span>
              </div>
              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium">12</span>
              </div>
              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium">13</span>
              </div>
              <div className="p-2 border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium text-error">
                  14
                </span>
              </div>
              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium">15</span>
              </div>
              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium">16</span>
              </div>
              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors border-primary/20 bg-primary/5">
                <span className="block text-right text-xs font-medium font-bold text-primary">
                  17
                </span>
                <div className="mt-2">
                  <div className="px-2 py-1 rounded bg-surface-variant/50 text-[10px] font-bold text-text-primary flex items-center gap-1 border border-outline">
                    <span className="material-symbols-outlined !text-[12px]">
                      check_circle
                    </span>
                    <span className="truncate">Mantenimiento Jardín</span>
                  </div>
                </div>
              </div>
              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium">18</span>
              </div>
              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium">19</span>
              </div>
              <div className="p-2 border-r border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium">20</span>
              </div>
              <div className="p-2 border-b border-outline bg-surface hover:bg-surface-variant transition-colors">
                <span className="block text-right text-xs font-medium text-error">
                  21
                </span>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:w-80 flex flex-col gap-4">
          <div className="bg-surface rounded-xl border border-outline shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-primary">
                Detalle del Evento
              </h3>
              <button className="material-symbols-outlined text-text-secondary hover:text-text-primary">
                close
              </button>
            </div>
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden h-32 mb-4 bg-surface-variant">
                <img
                  className="w-full h-full object-cover"
                  alt="Limpiar cocina"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9d1jE469GWsW7XuNPBV4AGPdeM-sFvwMK8v_Ne70eQijYkX35NY4MXMrWp_LYuCTr4IdouJgzSP_pKUtNg7JKTmuqMEFyk2KqjF7PqIzCUdZEJc69l958VkoqkAmthVo421r8PdxLF-KtLT-M5tgLSr_isgUJRvVuPn7X_KJKlrup0pZA-za3PKaX-ArJFzsN-KN8lhFpL3pwuQNv-145eEyvqGoKwHoqrFa6ji_RzCk3XHchT9wLZ014O8uBabpi-RhchCOHjyQ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3">
                  <span className="text-white font-bold text-xs font-medium px-2 py-1 bg-primary/80 rounded">
                    Tarea Doméstica
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-semibold text-text-primary">
                  Limpiar cocina profunda
                </h4>
                <div className="flex items-center gap-2 text-text-secondary">
                  <span className="material-symbols-outlined !text-[18px]">
                    calendar_today
                  </span>
                  <span className="text-sm">Hoy, 3 de Octubre</span>
                </div>
              </div>
              <div className="bg-surface-variant p-3 rounded-lg border border-outline">
                <p className="text-sm text-text-secondary italic mb-2">
                  "Recordar limpiar detrás de la nevera y descalcificar la
                  cafetera."
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xs">
                    JD
                  </div>
                  <span className="text-xs font-medium">
                    Asignado a: Juan
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h5 className="text-xs font-medium uppercase text-text-secondary">
                  Checklist
                </h5>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary !text-[20px]">
                    check_box
                  </span>
                  <span className="text-sm">Superficies y encimeras</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-text-secondary !text-[20px]">
                    check_box_outline_blank
                  </span>
                  <span className="text-sm">Interior del horno</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-text-secondary !text-[20px]">
                    check_box_outline_blank
                  </span>
                  <span className="text-sm">Fregadero y grifería</span>
                </div>
              </div>
              <button className="w-full bg-primary text-white py-3 rounded-lg text-base font-semibold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">done_all</span>
                Marcar como completada
              </button>
            </div>
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
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-white/10 p-2 rounded border border-white/20">
                <span className="text-sm">Pago de Luz</span>
                <span className="font-bold">$45.00</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 p-2 rounded border border-white/20 opacity-70">
                <span className="text-sm">Alquiler</span>
                <span className="font-bold">$850.00</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-surface text-primary py-2 rounded-lg text-xs font-medium hover:bg-surface transition-colors">
              Gestionar Finanzas
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
