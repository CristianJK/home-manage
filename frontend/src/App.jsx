import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { SWRConfig } from "swr";
import { AuthProvider } from "./context/AuthContext";
import GuestRoute from "./features/auth/GuestRoute";
import AppLayout from "./components/layout/AppLayout";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const TaskPage = lazy(() => import("./pages/TaskPage"));
const AllTasksPage = lazy(() => import("./pages/AllTasksPage"));
const SharedFinancesPage = lazy(() => import("./pages/SharedFinancesPage"));
const SharedPercentagePage = lazy(() => import("./pages/SharedPercentagePage"));
const PaymentsPage = lazy(() => import("./pages/PaymentsPage"));
const SharedFinancesAllPage = lazy(() => import("./pages/SharedFinancesAllPage"));
const SavingsPage = lazy(() => import("./pages/SavingsPage"));
const PersonalExpensesPage = lazy(() => import("./pages/PersonalExpensesPage"));
const CalendarPage = lazy(() => import("./pages/LogisticsCalendarPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

function App() {
  return (
    <SWRConfig value={{ dedupingInterval: 30000, revalidateOnFocus: false }}>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
                  <LoginPage />
                </Suspense>
              </GuestRoute>
            }
          />
          <Route
            path="/*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/tasks" element={<TaskPage />} />
                  <Route path="/tasks/all" element={<AllTasksPage />} />
                  <Route path="/shared-finances" element={<SharedFinancesPage />} />
                  <Route path="/shared-finances/percentages" element={<SharedPercentagePage />} />
                  <Route path="/savings" element={<SavingsPage />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/shared-finances/all" element={<SharedFinancesAllPage />} />
                  <Route path="/savings/expenses" element={<PersonalExpensesPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
