import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import useSWR from "swr";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: users = [], mutate } = useSWR(
    user?.role === "admin" ? "/admin/users" : null,
    fetcher
  );

  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleToggleRole = useCallback(
    async (targetUser) => {
      const newRole = targetUser.role === "admin" ? "user" : "admin";
      setUpdatingId(targetUser.id);
      try {
        await api.patch(`/admin/users/${targetUser.id}/role`, { role: newRole });
        mutate();
      } catch (err) {
        setError(err.response?.data?.message || "Error al actualizar rol");
      } finally {
        setUpdatingId(null);
      }
    },
    [mutate]
  );

  const handleChangePassword = useCallback(async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    setPasswordSubmitting(true);
    try {
      await api.post("/auth/change-password", passwordData);
      setPasswordSuccess("Contraseña actualizada con éxito");
      setPasswordData({ current_password: "", new_password: "", new_password_confirmation: "" });
      setPasswordOpen(false);
    } catch (err) {
      const fields = err.response?.data?.errors;
      setPasswordError(
        fields ? Object.values(fields).flat().join("\n") : err.response?.data?.message || "Error al cambiar la contraseña"
      );
    } finally {
      setPasswordSubmitting(false);
    }
  }, [passwordData]);

  const handleDeleteMyAccount = useCallback(async () => {
    if (!window.confirm("¿Estás seguro de eliminar tu cuenta?\n\nEsta acción no se puede deshacer. Todos tus datos serán eliminados permanentemente.")) return;
    try {
      await api.delete("/auth/account");
      await logout();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar la cuenta");
    }
  }, [logout, navigate]);

  const handleAdminDeleteUser = useCallback(
    async (targetUser) => {
      if (!window.confirm(`¿Eliminar a "${targetUser.name}"?\n\nEsta acción no se puede deshacer. Todos sus datos serán eliminados.`)) return;
      setDeletingId(targetUser.id);
      try {
        await api.delete(`/admin/users/${targetUser.id}`);
        mutate();
      } catch (err) {
        setError(err.response?.data?.message || "Error al eliminar usuario");
      } finally {
        setDeletingId(null);
      }
    },
    [mutate]
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Configuración</h1>
        <p className="text-sm text-text-secondary mt-1">Administración de tu cuenta y usuarios</p>
      </div>
      {error && (
        <div className="bg-error-bg border border-error-border text-error-text text-sm rounded-lg p-3 whitespace-pre-line flex items-start justify-between gap-2">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="underline hover:no-underline shrink-0">Cerrar</button>
        </div>
      )}
      <div className="bg-surface rounded-xl border border-outline p-5 space-y-4">
        <h2 className="text-base font-semibold text-text-primary">Mi Cuenta</h2>
        <div className="flex items-center gap-4 pb-4 border-b border-outline">
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{user?.name || "Usuario"}</p>
            <p className="text-xs text-text-secondary">{user?.email}</p>
            <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${user?.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-surface-variant text-text-secondary"}`}>
              {user?.role === "admin" ? "Administrador" : "Usuario"}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => { setPasswordOpen(!passwordOpen); setPasswordError(null); setPasswordSuccess(null); }} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-surface-variant transition-colors text-sm text-text-primary">
            <span className="material-symbols-outlined text-[20px] text-text-secondary">lock</span>
            Cambiar contraseña
            <span className="material-symbols-outlined text-[18px] text-text-secondary ml-auto transition-transform">{passwordOpen ? "expand_less" : "expand_more"}</span>
          </button>
          {passwordOpen && (
            <form onSubmit={handleChangePassword} className="ml-9 pl-4 border-l-2 border-outline space-y-3 pb-2">
              {passwordSuccess && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg p-3">{passwordSuccess}</div>}
              {passwordError && <div className="bg-error-bg border border-error-border text-error-text text-sm rounded-lg p-3 whitespace-pre-line">{passwordError}</div>}
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">Contraseña actual</label>
                <input type="password" value={passwordData.current_password} onChange={(e) => setPasswordData((p) => ({ ...p, current_password: e.target.value }))} className="w-full px-3 py-2 bg-surface border border-outline rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">Nueva contraseña</label>
                <input type="password" value={passwordData.new_password} onChange={(e) => setPasswordData((p) => ({ ...p, new_password: e.target.value }))} className="w-full px-3 py-2 bg-surface border border-outline rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">Confirmar nueva contraseña</label>
                <input type="password" value={passwordData.new_password_confirmation} onChange={(e) => setPasswordData((p) => ({ ...p, new_password_confirmation: e.target.value }))} className="w-full px-3 py-2 bg-surface border border-outline rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" required />
              </div>
              <button type="submit" disabled={passwordSubmitting} className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-hover disabled:opacity-50 transition-all">
                {passwordSubmitting ? "Actualizando..." : "Actualizar contraseña"}
              </button>
            </form>
          )}
          <button onClick={handleDeleteMyAccount} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-error/5 transition-colors text-sm text-error">
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
            Eliminar mi cuenta
          </button>
        </div>
      </div>
      {user?.role === "admin" && (
        <div className="bg-surface rounded-xl border border-outline overflow-hidden">
          <div className="px-5 py-4 border-b border-outline flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary">Administrar Usuarios</h2>
              <p className="text-xs text-text-secondary mt-0.5">{users.length} usuario{users.length !== 1 ? "s" : ""} registrado{users.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => mutate()} className="material-symbols-outlined text-text-secondary hover:text-primary transition-colors" title="Recargar">refresh</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline bg-surface-variant/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Usuario</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Email</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Salario</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Rol</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-variant/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold">{u.name?.charAt(0).toUpperCase() || "?"}</div>
                        <span className="font-medium text-text-primary">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-text-secondary">{u.email}</td>
                    <td className="px-5 py-4 text-right text-text-primary font-medium">{u.salary ? `$${Number(u.salary).toLocaleString()}` : "—"}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-surface-variant text-text-secondary"}`}>{u.role === "admin" ? "Admin" : "User"}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleToggleRole(u)} disabled={updatingId === u.id || u.id === user?.id} title={u.id === user?.id ? "No puedes cambiar tu propio rol" : updatingId === u.id ? "Actualizando..." : u.role === "admin" ? "Cambiar a usuario" : "Cambiar a administrador"} className="px-3 py-1.5 text-xs font-medium border border-outline rounded-lg hover:bg-surface-variant disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                          {updatingId === u.id ? "Actualizando..." : u.role === "admin" ? "Revocar Admin" : "Hacer Admin"}
                        </button>
                        {u.id !== user?.id && (
                          <button onClick={() => handleAdminDeleteUser(u)} disabled={deletingId === u.id} title={deletingId === u.id ? "Eliminando..." : "Eliminar usuario"} className="p-1.5 text-text-secondary hover:text-error transition-colors disabled:opacity-40">
                            {deletingId === u.id ? "..." : <span className="material-symbols-outlined text-[18px]">delete</span>}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {user?.role !== "admin" && (
        <div className="bg-surface rounded-xl border border-outline p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-text-secondary mb-3">admin_panel_settings</span>
          <p className="text-sm text-text-secondary">Solo los administradores pueden gestionar usuarios.</p>
        </div>
      )}
    </div>
  );
}
