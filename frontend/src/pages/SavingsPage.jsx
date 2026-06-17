export default function SavingsPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Ahorros y Planeación
        </h1>
        <p className="text-base text-text-secondary">
          Visualiza el futuro de tu hogar con precisión financiera.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-light rounded-lg">
              <span className="material-symbols-outlined text-primary">
                account_balance
              </span>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-surface-variant rounded text-text-secondary">
              Largo Plazo
            </span>
          </div>
          <h3 className="text-base font-semibold mb-2">
            Fondo de Emergencia
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            Seguridad financiera para imprevistos.
          </p>
          <div className="flex justify-between items-end mb-2">
            <span className="text-base font-semibold text-primary">
              $12,450.00
            </span>
            <span className="text-xs font-medium text-text-secondary">
              Meta: $20,000.00
            </span>
          </div>

          <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-primary h-full transition-all duration-1000"
              style={{ width: '62%' }}
            ></div>
          </div>
          <p className="text-xs font-medium text-right text-text-secondary">
            62% Completado
          </p>
        </div>

        <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-variant rounded-lg">
              <span className="material-symbols-outlined text-text-primary">
                flight_takeoff
              </span>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-surface-variant rounded text-text-primary">
              Meta Próxima
            </span>
          </div>
          <h3 className="text-base font-semibold mb-2">
            Vacaciones 2024
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            Viaje familiar a la costa italiana.
          </p>
          <div className="flex justify-between items-end mb-2">
            <span className="text-base font-semibold text-primary">
              $4,800.00
            </span>
            <span className="text-xs font-medium text-text-secondary">
              Meta: $5,000.00
            </span>
          </div>

          <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-emerald-500 h-full transition-all duration-1000"
              style={{ width: '96%' }}
            ></div>
          </div>
          <p className="text-xs font-medium text-right text-text-secondary">
            96% Completado
          </p>
        </div>

        <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-variant rounded-lg">
              <span className="material-symbols-outlined text-text-primary">home</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-surface-variant rounded text-text-primary">
              Inversión
            </span>
          </div>
          <h3 className="text-base font-semibold mb-2">
            Enganche Casa
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            Nuestro primer patrimonio compartido.
          </p>
          <div className="flex justify-between items-end mb-2">
            <span className="text-base font-semibold text-primary">
              $35,000.00
            </span>
            <span className="text-xs font-medium text-text-secondary">
              Meta: $150,000.00
            </span>
          </div>
          <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-primary h-full transition-all duration-1000"
              style={{ width: '23%' }}
            ></div>
          </div>
          <p className="text-xs font-medium text-right text-text-secondary">
            23% Completado
          </p>
        </div>
      </section>

      <section className="bg-surface border border-outline rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline flex justify-between items-center bg-surface-variant/30">
          <div>
            <h2 className="text-base font-semibold">
              Gastos Recurrentes
            </h2>
            <p className="text-sm text-text-secondary">
              Administra tus suscripciones y pagos fijos.
            </p>
          </div>
          <button className="flex items-center gap-2 text-primary text-xs font-medium hover:bg-primary-light/10 p-2 rounded-lg transition-colors">
            <span className="material-symbols-outlined">add_circle</span>
            Nuevo Gasto
          </button>
        </div>
        <div className="divide-y divide-outline">
          <div className="p-4 flex items-center justify-between hover:bg-surface-variant transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-surface-variant rounded-full">
                <span className="material-symbols-outlined text-text-secondary">
                  tv
                </span>
              </div>
              <div>
                <h4 className="text-base font-semibold text-base font-bold">
                  Netflix Premium
                </h4>
                <p className="text-xs font-medium text-text-secondary">
                  Entretenimiento
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-bold text-text-primary">$18.99</p>
                <span className="text-xs font-medium px-2 py-0.5 bg-surface-variant text-text-primary rounded-full">
                  Mensual
                </span>
              </div>
              <span className="material-symbols-outlined text-text-secondary group-hover:text-primary cursor-pointer transition-colors">
                more_vert
              </span>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-surface-variant transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-surface-variant rounded-full">
                <span className="material-symbols-outlined text-text-secondary">
                  apartment
                </span>
              </div>
              <div>
                <h4 className="text-base font-semibold text-base font-bold">
                  Renta Apartamento
                </h4>
                <p className="text-xs font-medium text-text-secondary">
                  Vivienda
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-bold text-text-primary">
                  $1,250.00
                </p>
                <span className="text-xs font-medium px-2 py-0.5 bg-surface-variant text-text-primary rounded-full">
                  Mensual
                </span>
              </div>
              <span className="material-symbols-outlined text-text-secondary group-hover:text-primary cursor-pointer transition-colors">
                more_vert
              </span>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-surface-variant transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-surface-variant rounded-full">
                <span className="material-symbols-outlined text-text-secondary">
                  health_and_safety
                </span>
              </div>
              <div>
                <h4 className="text-base font-semibold text-base font-bold">
                  Seguro de Vida Anual
                </h4>
                <p className="text-xs font-medium text-text-secondary">
                  Salud y Seguridad
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-bold text-text-primary">$840.00</p>
                <span className="text-xs font-medium px-2 py-0.5 bg-primary-light text-text-primary rounded-full">
                  Anual
                </span>
              </div>
              <span className="material-symbols-outlined text-text-secondary group-hover:text-primary cursor-pointer transition-colors">
                more_vert
              </span>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-surface-variant transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-surface-variant rounded-full">
                <span className="material-symbols-outlined text-text-secondary">
                  bolt
                </span>
              </div>
              <div>
                <h4 className="text-base font-semibold text-base font-bold">
                  Luz y Energía
                </h4>
                <p className="text-xs font-medium text-text-secondary">
                  Servicios Básicos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-bold text-text-primary">$85.20</p>
                <span className="text-xs font-medium px-2 py-0.5 bg-surface-variant text-text-primary rounded-full">
                  Mensual
                </span>
              </div>
              <span className="material-symbols-outlined text-text-secondary group-hover:text-primary cursor-pointer transition-colors">
                more_vert
              </span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-surface-variant/20 flex justify-center">
          <button className="text-xs font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
            Ver todos los gastos recurrentes
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </button>
        </div>
      </section>

      <section className="mt-6 relative overflow-hidden rounded-2xl h-48 flex items-center p-6 bg-surface border border-outline">
        <div className="z-10 relative max-w-md">
          <h2 className="text-xl font-bold text-primary mb-2">
            Tu ahorro creció un 12% este mes
          </h2>
          <p className="text-sm text-text-secondary">
            Sigue así y alcanzarás tu meta de "Vacaciones 2024" antes de lo
            esperado.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none">
          <img
            alt="Savings growth illustration"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCexKzJlR2rGiTUmrVxFkNKWpS72Dm0g3HvBgiFheTqflTIQmAlzeVq5DI8lZEAp7dvak71M5eY8j4bqoeaMGzh1zTgTCmqCFFXiXNXUPDt4Aaxj9YECXrlkK6RMLW8k0IoY_lr6LgQXkMWrYcP19-wY-jWZdEBSKDU5FmuhFDToDbslJHEhkkJXC-y1t-PeNnProFXxJkJU6lGsw_RkBnsB4HDZn0r1tw1YmINkRc09cwdJQlZ-jMO0eWyf8tIGiFWSwDYm2u5V1c"
          />
        </div>
      </section>
    </>
  );
}
