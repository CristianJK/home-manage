import { Suspense } from "react";
import { SideNavBar } from "./sideNavBar";
import { Header } from "./Header";
import ProtectedRoute from "../../features/auth/ProtectedRoute";

export default function AppLayout({ children }) {
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
