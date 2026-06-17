import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import { Header } from "./components/Header";
import { SideNavBar } from "./components/sideNavBar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const TaskPage = lazy(() => import("./pages/TaskPage"));
const SharedFinancesPage = lazy(() => import("./pages/SharedFinancesPage"));
const SavingsPage = lazy(() => import("./pages/SavingsPage"));
const CalendarPage = lazy(() => import("./pages/LogisticsCalendarPage"));
/*const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const HelpPage = lazy(() => import('./pages/HelpPage'))*/

function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <SideNavBar />
      <div className="md:ml-64">
        <Header />
        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
          <main className="p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
            {children}
          </main>
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Suspense
                fallback={<div className="p-4 text-center">Loading...</div>}
              >
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
                <Route
                  path="/shared-finances"
                  element={<SharedFinancesPage />}
                />
                <Route path="/savings" element={<SavingsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
