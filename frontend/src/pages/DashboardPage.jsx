export default function DashboardPage() {
  return (
    <>
      <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-primary">Buenos días, Familia.</h2>
          <p className="text-base text-text-secondary">Aquí tienes el resumen de tu hogar para hoy.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 bg-surface rounded-xl border border-outline p-4 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text-primary">Resumen de gastos</h3>
              <span className="text-xs font-medium px-3 py-1 bg-surface-variant rounded-full">Octubre 2023</span>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-around gap-4 py-4">
              <div
                className="relative w-48 h-48 rounded-full border-[16px] border-primary flex items-center justify-center"
                style={{ borderRightColor: '#d0e1fb', borderBottomColor: '#64748B', borderLeftColor: '#1E40AF' }}
              >
                <div className="text-center">
                  <span className="text-xl font-bold block">$2,450</span>
                  <span className="text-xs text-neutral">Total Mes</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <div className="flex justify-between w-full lg:w-48">
                    <span className="text-sm">Vivienda</span>
                    <span className="text-xs font-medium font-bold text-primary">$1,200</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <div className="flex justify-between w-full lg:w-48">
                    <span className="text-sm">Alimentación</span>
                    <span className="text-xs font-medium font-bold text-primary">$650</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <div className="flex justify-between w-full lg:w-48">
                    <span className="text-sm">Servicios</span>
                    <span className="text-xs font-medium font-bold text-primary">$400</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                  <div className="flex justify-between w-full lg:w-48">
                    <span className="text-sm">Otros</span>
                    <span className="text-xs font-medium font-bold text-primary">$200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="bg-error-bg text-error-text rounded-xl p-4 shadow-sm border border-error/10 flex items-start gap-4">
              <span className="material-symbols-outlined text-error">warning</span>
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold">Pago Urgente</span>
                <p className="text-sm">Electricidad vence en 2 días.</p>
                <span className="text-lg font-semibold mt-1">$85.00</span>
              </div>
            </div>
            <div className="bg-surface border border-outline rounded-xl p-4 shadow-sm flex flex-col gap-2 flex-1">
              <h3 className="text-base font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">event_upcoming</span>
                Próximos Pagos
              </h3>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-surface-variant">
                  <span className="text-sm">Internet</span>
                  <span className="text-xs bg-surface-variant px-2 py-0.5 rounded">Oct 28</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-surface-variant">
                  <span className="text-sm">Seguro Auto</span>
                  <span className="text-xs bg-surface-variant px-2 py-0.5 rounded">Nov 02</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 bg-surface rounded-xl border border-outline p-4 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Tareas pendientes</h3>
              <button className="text-primary text-xs font-medium hover:underline">Ver todas</button>
            </div>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant border border-transparent hover:border-outline transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">shopping_cart</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Compra semanal</p>
                    <p className="text-xs text-neutral">Responsable: Carlos</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-neutral cursor-pointer hover:text-primary">check_circle</span>
              </li>
              <li className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant border border-transparent hover:border-outline transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-text-secondary">cleaning_services</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Limpiar filtro AC</p>
                    <p className="text-xs text-neutral">Responsable: Maria</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-neutral cursor-pointer hover:text-primary">check_circle</span>
              </li>
              <li className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant border border-transparent hover:border-outline transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-text-secondary">pets</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Cita Veterinaria</p>
                    <p className="text-xs text-neutral">Responsable: Carlos</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-neutral cursor-pointer hover:text-primary">check_circle</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-6 bg-surface rounded-xl border border-outline p-4 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Metas de ahorro</h3>
              <span className="material-symbols-outlined text-primary">trending_up</span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-semibold">Vacaciones Verano</p>
                    <p className="text-xs text-neutral">Meta: $5,000</p>
                  </div>
                  <span className="text-lg font-semibold text-primary">75%</span>
                </div>
                <div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-semibold">Fondo Emergencia</p>
                    <p className="text-xs text-neutral">Meta: $10,000</p>
                  </div>
                  <span className="text-lg font-semibold text-text-primary">40%</span>
                </div>
                <div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-semibold">Mantenimiento Hogar</p>
                    <p className="text-xs text-neutral">Meta: $2,000</p>
                  </div>
                  <span className="text-lg font-semibold text-primary">90%</span>
                </div>
                <div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-12 relative h-48 rounded-2xl overflow-hidden shadow-md mt-4">
            <img alt="Modern Kitchen" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7wD2JISQHrSaz_lJANQCD392ZHIAapQgrl2mQdzEXNX_qVE_RN3X9yd4SSQDvpTHxg1F59745-2IOOZSglQheqdMr2vBPuQ37s4JI_jZMPCWnWuDPCeOiZweQErcWbO6NGWbV-JCyFuWYSMqVzx_dedCNgsm13999mHj5GpEw5zgMa9evaTHrqIrulSN8icy72IoykcqIxY1oQLesAo50XGfZQRxtv0yZi94U-aT_EPocEFo8X7GDUifVWL6STQpdBJL8iQ53Yjg" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex flex-col justify-center px-12 text-on-primary">
              <h4 className="text-2xl font-bold">Gestiona tu hogar con calma</h4>
              <p className="text-base">Cada tarea completada es un paso hacia la tranquilidad.</p>
            </div>
          </div>
        </div>
      </div>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-outline flex justify-around items-center z-50">
        <a className="flex flex-col items-center gap-1 text-primary" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="text-[10px] font-bold">Dashboard</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-text-secondary" href="#">
          <span className="material-symbols-outlined">assignment</span>
          <span className="text-[10px]">Tasks</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-text-secondary" href="#">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="text-[10px]">Finances</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-text-secondary" href="#">
          <span className="material-symbols-outlined">calendar_month</span>
          <span className="text-[10px]">Calendar</span>
        </a>
      </nav>
    </>
  )
}
