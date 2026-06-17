export default function TaskPage() {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gestión de Tareas</h2>
          <p className="text-sm text-text-secondary">
            Centraliza las responsabilidades domésticas con precisión.
          </p>
        </div>
        <div className="flex bg-surface-variant p-1 rounded-lg">
          <button className="px-4 py-1.5 bg-surface shadow-sm rounded-md text-xs font-medium text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              view_kanban
            </span>{" "}
            Kanban
          </button>
          <button className="px-4 py-1.5 text-xs font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">list</span>{" "}
            Lista
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="kanban-column flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">Por hacer</h3>
              <span className="bg-surface-variant px-2 py-0.5 rounded-full text-xs font-medium">
                3
              </span>
            </div>
            <span className="material-symbols-outlined text-text-secondary cursor-pointer">
              more_horiz
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-error/10 text-error px-2 py-0.5 rounded-full text-xs font-medium">
                  Alta
                </span>
                <span className="material-symbols-outlined text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                  edit
                </span>
              </div>
              <h4 className="text-base font-semibold text-text-primary mb-2">
                Renovar seguro de vivienda
              </h4>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <img
                    className="w-6 h-6 rounded-full object-cover border border-outline"
                    alt="Carlos"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-qVLmeXsVNz1ze6G5VV0TVKF2443zTUcTo-minNVfn-nZnhGXbvxMarWQGZcguNyzVci6298agjvA5w7z6wyUsV30j_843RrdRelTkcYt8RdY3uWivwz4OtPIyturQ1Mi1vaVGacGdjaw8hASQiyH1fhxLglmG8Va49rk_isNSxRLmCnKMh2DxcUvpQJSZ_DAOc-BRF1ypTL5gmwVDdG_hwdbpKfS3bp-z2o9zEsN84Jmb2V0i7iK6kOr2Fz6XJThw6sMD9Hplzw"
                  />
                  <span className="text-xs font-medium text-text-secondary">
                    Carlos
                  </span>
                </div>
                <div className="flex items-center text-text-secondary gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    calendar_today
                  </span>
                  <span className="text-xs font-medium">Hoy</span>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-surface-variant text-text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                  Media
                </span>
                <span className="material-symbols-outlined text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                  edit
                </span>
              </div>
              <h4 className="text-base font-semibold text-text-primary mb-2">
                Organizar trastero sótano
              </h4>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <img
                    className="w-6 h-6 rounded-full object-cover border border-outline"
                    alt="Elena"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe3yGipgAu1VsTK6gDoYY7yxK3-oQaVfZp6h0zG6zzLo-qWcbsX531p2xzprR_b7JT9mwwfs0M9rRf1aS7zDtRi7O_AJW_0JQJb6czrlz5XGnIBub2kUAoJE8odR_UYiZ4BXGxhrFPoWTCSApRzEdZWMtJB_d1aKgIjzXURnb9IwzZdh24XiB7voxHdNwEsjEYz3093zUl_3n_ibaJSU7Q3bQzylrbubiPGSB9i5YWYS7ycZDOMs0sjdz4jA88GGatqGWdl6QVN2I"
                  />
                  <span className="text-xs font-medium text-text-secondary">
                    Elena
                  </span>
                </div>
                <div className="flex items-center text-text-secondary gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    calendar_today
                  </span>
                  <span className="text-xs font-medium">Mañana</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <input
                className="w-full bg-transparent border-2 border-dashed border-outline rounded-xl p-4 text-sm text-text-secondary hover:border-primary/50 focus:border-primary focus:ring-0 transition-all cursor-pointer text-center"
                placeholder="+ Añadir tarea rápida..."
                type="text"
              />
            </div>
          </div>
        </div>

        <div className="kanban-column flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">En progreso</h3>
              <span className="bg-surface-variant px-2 py-0.5 rounded-full text-xs font-medium">
                1
              </span>
            </div>
            <span className="material-symbols-outlined text-text-secondary cursor-pointer">
              more_horiz
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-surface border-l-4 border-primary border-y border-r border-outline p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-surface-variant text-text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                  Media
                </span>
                <span className="material-symbols-outlined text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                  edit
                </span>
              </div>
              <h4 className="text-base font-semibold text-text-primary mb-2">
                Comparativa de hipotecas
              </h4>
              <div className="w-full bg-surface-variant h-1.5 rounded-full mt-2 mb-4">
                <div className="bg-primary h-full w-2/3 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    className="w-6 h-6 rounded-full object-cover border border-outline"
                    alt="Carlos"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeSQO1-Wj7Zcgh7Y4qmNO_96CjMJQrk3wjSUF_3RCbw37oRnKmFcfMQPT9LWMF2bpiqlu0Kpp3AOKkeKVx3x7lzhRJ8Q62cLWZXPnXsiLUlbfHRO9yYo3zloD8U_G5z43TuapOzLmk8e8g5WtGi2-2qDKyGk8Z3V-OU-FVsJsDzqGqwobK3lRqRRpZLOs6OU6g8hWWv-1CDih6gzob1_ti2v8_lOthJulpj1PKUflqd6VjnIt-eeESnTr-o3VeYc01r6UUQ6jZ_M8"
                  />
                  <span className="text-xs font-medium text-text-secondary">
                    Carlos
                  </span>
                </div>
                <span className="text-xs font-medium text-primary">60%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="kanban-column flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">Completado</h3>
              <span className="bg-surface-variant px-2 py-0.5 rounded-full text-xs font-medium">
                2
              </span>
            </div>
            <span className="material-symbols-outlined text-text-secondary cursor-pointer">
              more_horiz
            </span>
          </div>
          <div className="flex flex-col gap-4 opacity-60">
            <div className="bg-surface-variant border border-outline p-4 rounded-xl shadow-none line-through decoration-gray-400">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-primary-light text-text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                  Baja
                </span>
                <span
                  className="material-symbols-outlined text-primary text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <h4 className="text-base font-semibold text-text-secondary mb-2">
                Compra semanal de frescos
              </h4>
              <div className="flex items-center gap-2 mt-4">
                <img
                  className="w-6 h-6 rounded-full object-cover border border-outline grayscale"
                  alt="Elena"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8utNtT34j6tVZLYgxEqXMb7n4zG8QdIEclgaOO2yah2lBs4NQVWrHZB51gcBbLuE-d659w0tQPaQzJsCVUIa9nnhdhCx47GSxLcknRljK9V1AXAJWCGfkGm9ryHwAC_duBIKYZJK-3eyP04kmxAtc5HBD3larJ_0qGI5HOUavA_PMx-RUwNPRQ7ByQ_XJH6l1MhlFSs1I_d_QcuhwGoWjzua0QCDORHHFH3ht1_Tuph7rp5rJ8DY2uM_wBHTaA5nxE0N63vxe9FE"
                />
                <span className="text-xs font-medium text-text-secondary">
                  Elena
                </span>
              </div>
            </div>
            <div className="bg-surface-variant border border-outline p-4 rounded-xl shadow-none line-through decoration-gray-400">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-error/10 text-error px-2 py-0.5 rounded-full text-xs font-medium">
                  Alta
                </span>
                <span
                  className="material-symbols-outlined text-primary text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <h4 className="text-base font-semibold text-text-secondary mb-2">
                Pago de impuestos trimestrales
              </h4>
              <div className="flex items-center gap-2 mt-4">
                <img
                  className="w-6 h-6 rounded-full object-cover border border-outline grayscale"
                  alt="Carlos"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNmDoxog0x6o1d31osEuAs5WNzLgfa4ibA7x2nWXVrpxUMDpI74fra9wS0peuIlrnE5mAifRPw0OUSfQe9P63lGFICh_i8l1lKWne9HSSIeEnRYlrX_llqdW0JHqmoj1Jv2syJj12mogr7rdHJJlL_as8iC1VZjR650HrFkQLgpjzX0PdUG_BkLOxhdojuCUyGtFvB_3yoUmrt8itPsTnQFhqtVmL9UNkPAKIZFFlygPZyQ3ZXOXX0nI9UeJ7irxcq8rR4oFnZD-0"
                />
                <span className="text-xs font-medium text-text-secondary">
                  Carlos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
