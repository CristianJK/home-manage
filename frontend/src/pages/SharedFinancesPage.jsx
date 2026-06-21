import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";
import { SharedFinancesTable } from "../features/shared-finances/SharedFinancesTable";
import { SharedFinanceSummary } from "../features/shared-finances/SharedFinanceSummary";
import { SharedFinanceBreakdown } from "../features/shared-finances/SharedFinanceBreakdown";

export default function SharedFinancesPage() {
  const navigate = useNavigate();
  const [sharedFinances, setSharedFinances] = useState([]);

  const fetchShared = useCallback(() => {
    api
      .get("/shared-expense")
      .then((res) => setSharedFinances(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching shared expenses:", err));
  }, []);

  useEffect(() => {
    fetchShared();
  }, [fetchShared]);

  return (
    <>
      <SharedFinanceSummary
        totalMonth={4250}
        balance={-145.5}
        nextSettlement="2026-11-30"
        onSettle={() => {
          // TODO: implement liquidation logic
          console.log('Liquidar deudas')
        }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-base font-semibold">Gastos Comunes</h3>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => navigate('/payments')}
                className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all"
              >
                Ver Pagos
              </button>
              <button className="p-2 border border-outline rounded-lg hover:bg-surface-variant transition-colors material-symbols-outlined">
                filter_list
              </button>
              <button className="p-2 border border-outline rounded-lg hover:bg-surface-variant transition-colors material-symbols-outlined">
                download
              </button>
            </div>
          </div>
          <SharedFinancesTable sharedFinances={sharedFinances} maxRows={5} />
        </section>
        <SharedFinanceBreakdown
          users={[
            { user_id: 1, name: 'Usuario A', initials: 'UA', percentage: 60, shouldPay: 2550, hasPaid: 2820, balance: 270, color: '#1E40AF' },
            { user_id: 2, name: 'Usuario B', initials: 'UB', percentage: 40, shouldPay: 1700, hasPaid: 1430, balance: -270, color: '#64748B' },
          ]}
          salaryInfo="Basado en ingresos declarados de $3.000 y $2.000 respectivamente."
          onAdjustPercentages={() => navigate('/shared-finances/percentages')}
        />
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
              style={{ height: "60%" }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Jun</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-variant rounded-t-lg relative"
              style={{ height: "45%" }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Jul</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-variant rounded-t-lg relative"
              style={{ height: "80%" }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Ago</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-variant rounded-t-lg relative"
              style={{ height: "70%" }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Sep</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-variant rounded-t-lg relative"
              style={{ height: "55%" }}
            >
              <div className="absolute inset-0 bg-primary opacity-20"></div>
            </div>
            <span className="text-xs font-medium text-text-secondary">Oct</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-primary rounded-t-lg"
              style={{ height: "90%" }}
            ></div>
            <span className="text-xs font-medium text-primary font-bold">
              Nov
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
