export default function SharedFinancesPage() {
  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm">
          <p className="text-xs font-medium text-text-secondary mb-1">
            Gasto Total del Mes
          </p>
          <h2 className="text-2xl font-bold text-primary">
            $4.250,00
          </h2>
          <div className="flex items-center gap-1 text-text-primary mt-2">
            <span className="material-symbols-outlined text-[16px]">
              trending_up
            </span>
            <span className="text-xs font-medium">12% vs mes anterior</span>
          </div>
        </div>
        <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm">
          <p className="text-xs font-medium text-text-secondary mb-1">Tu Balance</p>
          <h2 className="text-2xl font-bold text-error">-$145,50</h2>
          <p className="text-sm text-text-secondary mt-2">
            Debes liquidar con Usuario A
          </p>
        </div>
        <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-text-secondary mb-1">
              Siguiente Liquidación
            </p>
            <h2 className="text-base font-semibold text-text-primary">
              30 de Noviembre
            </h2>
          </div>
          <button className="mt-4 w-full bg-primary text-white py-3 rounded-lg text-xs font-medium hover:bg-primary-light transition-colors active:scale-95">
            Liquidar deudas
          </button>
        </div>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-base font-semibold">Gastos Comunes</h3>
            <div className="flex gap-2">
              <button className="p-2 border border-outline rounded-lg hover:bg-surface-variant transition-colors material-symbols-outlined">
                filter_list
              </button>
              <button className="p-2 border border-outline rounded-lg hover:bg-surface-variant transition-colors material-symbols-outlined">
                download
              </button>
            </div>
          </div>
          <div className="bg-surface border border-outline rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-variant border-b border-outline">
                <tr>
                  <th className="p-4 text-xs font-medium text-text-secondary">
                    Fecha
                  </th>
                  <th className="p-4 text-xs font-medium text-text-secondary">
                    Descripción
                  </th>
                  <th className="p-4 text-xs font-medium text-text-secondary">
                    Pagador
                  </th>
                  <th className="p-4 text-xs font-medium text-text-secondary text-right">
                    Monto Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                <tr className="hover:bg-surface-variant transition-colors cursor-pointer group">
                  <td className="p-4 text-sm">15 Nov, 2023</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          shopping_cart
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        Supermercado Quincenal
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-[10px] font-bold text-text-primary">
                        UA
                      </div>
                      <span className="text-sm">Usuario A</span>
                    </div>
                  </td>
                  <td className="p-4 text-right text-sm font-bold">$320,00</td>
                </tr>
                <tr className="hover:bg-surface-variant transition-colors cursor-pointer">
                  <td className="p-4 text-sm">12 Nov, 2023</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          bolt
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        Factura de Luz
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center text-[10px] font-bold text-text-primary">
                        UB
                      </div>
                      <span className="text-sm">Usuario B</span>
                    </div>
                  </td>
                  <td className="p-4 text-right text-sm font-bold">
                    $1.150,00
                  </td>
                </tr>
                <tr className="hover:bg-surface-variant transition-colors cursor-pointer">
                  <td className="p-4 text-sm">10 Nov, 2023</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          home_repair_service
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        Reparación Aire Acondicionado
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-[10px] font-bold text-text-primary">
                        UA
                      </div>
                      <span className="text-sm">Usuario A</span>
                    </div>
                  </td>
                  <td className="p-4 text-right text-sm font-bold">
                    $2.500,00
                  </td>
                </tr>
                <tr className="hover:bg-surface-variant transition-colors cursor-pointer">
                  <td className="p-4 text-sm">08 Nov, 2023</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-error text-[18px]">
                          restaurant
                        </span>
                      </div>
                      <span className="text-sm font-medium">Cena Fuera</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center text-[10px] font-bold text-text-primary">
                        UB
                      </div>
                      <span className="text-sm">Usuario B</span>
                    </div>
                  </td>
                  <td className="p-4 text-right text-sm font-bold">$280,00</td>
                </tr>
              </tbody>
            </table>
            <div className="p-4 bg-surface border-t border-outline flex justify-center">
              <button className="text-primary text-xs font-medium flex items-center gap-1 hover:underline">
                Ver todos los movimientos
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </section>
        <section className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="text-base font-semibold px-2">
            Desglose Proporcional
          </h3>
          <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-text-secondary">
                Metodología: Porcentaje Salarial
              </p>
              <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden flex">
                <div className="h-full bg-primary" style={{ width: '60%' }}></div>
                <div
                  className="h-full bg-surface-variant"
                  style={{ width: '40%' }}
                ></div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-surface-variant border border-outline flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-text-primary">
                    UA
                  </div>
                  <span className="text-sm font-bold">Usuario A</span>
                </div>
                <span className="bg-primary-light text-text-primary px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  60% Cuota
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-sm text-text-secondary">
                  Debe aportar:
                </span>
                <span className="text-base font-semibold text-text-primary">$2.550,00</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-text-secondary">
                  Ha pagado:
                </span>
                <span className="text-sm text-primary font-bold">
                  $2.820,00
                </span>
              </div>
              <div className="border-t border-outline mt-2 pt-2 flex justify-between items-baseline">
                <span className="text-xs font-medium text-text-secondary">
                  Crédito a favor:
                </span>
                <span className="text-xs font-medium text-text-primary font-bold">
                  $270,00
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-surface-variant border border-outline flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center font-bold text-text-primary">
                    UB
                  </div>
                  <span className="text-sm font-bold">Usuario B</span>
                </div>
                <span className="bg-surface-variant text-text-primary px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  40% Cuota
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-sm text-text-secondary">
                  Debe aportar:
                </span>
                <span className="text-base font-semibold text-text-primary">$1.700,00</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-text-secondary">
                  Ha pagado:
                </span>
                <span className="text-sm text-error font-bold">$1.430,00</span>
              </div>
              <div className="border-t border-outline mt-2 pt-2 flex justify-between items-baseline">
                <span className="text-xs font-medium text-text-secondary">
                  Deuda pendiente:
                </span>
                <span className="text-xs font-medium text-error font-bold">$270,00</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-text-secondary italic mb-4">
                Basado en ingresos declarados de $3.000 y $2.000
                respectivamente.
              </p>
              <button className="w-full py-2 text-primary text-xs font-medium border border-primary rounded-lg hover:bg-primary-light transition-colors">
                Ajustar porcentajes
              </button>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-surface border border-outline p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-semibold">Tendencia de Gastos</h3>
          <select className="bg-transparent border-none text-xs font-medium text-primary focus:ring-0 cursor-pointer">
            <option>Últimos 6 meses</option>
            <option>Este año</option>
          </select>
        </div>
        <div className="h-48 w-full flex items-end gap-4 px-4">
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-variant rounded-t-lg relative"
              style={{ height: '60%' }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Jun</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-variant rounded-t-lg relative"
              style={{ height: '45%' }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Jul</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-variant rounded-t-lg relative"
              style={{ height: '80%' }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Ago</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-variant rounded-t-lg relative"
              style={{ height: '70%' }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Sep</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-variant rounded-t-lg relative"
              style={{ height: '55%' }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Oct</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-primary rounded-t-lg"
              style={{ height: '90%' }}
            ></div>
            <span className="text-xs font-medium text-primary font-bold">Nov</span>
          </div>
        </div>
      </section>
    </>
  );
}
