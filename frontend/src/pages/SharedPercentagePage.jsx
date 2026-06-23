import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import api from "../services/api";
import { sharedPercentageSchema } from "../features/shared-finances/sharedPercentageSchema";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function SharedPercentagePage() {
  const navigate = useNavigate();
  const { data, isLoading, mutate } = useSWR("/shared-finances/percentages", fetcher);

  const usersFromApi = Array.isArray(data) ? data : data?.users || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(sharedPercentageSchema),
    defaultValues: { users: [] },
  });

  useEffect(() => {
    if (usersFromApi.length > 0) {
      reset({
        users: usersFromApi.map((u) => ({
          user_id: u.user_id,
          name: u.name,
          percentage: String(u.percentage),
        })),
      });
    }
  }, [usersFromApi, reset]);

  const watchedUsers = watch("users") || [];
  const total = watchedUsers.reduce((sum, u) => sum + (parseFloat(u?.percentage) || 0), 0);
  const isValid = Math.abs(total - 100) < 0.01;

  const onSubmit = useCallback(
    async (formData) => {
      try {
        await api.put("/shared-finances/percentages", {
          users: formData.users.map((u) => ({
            user_id: u.user_id,
            percentage: parseFloat(u.percentage),
          })),
        });
        mutate();
        navigate("/shared-finances");
      } catch (err) {
        console.error("Error saving percentages:", err);
      }
    },
    [mutate, navigate]
  );

  return (
    <>
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={() => navigate("/shared-finances")}
            className="material-symbols-outlined text-text-secondary hover:text-primary transition-colors text-[20px]"
            title="Volver"
          >
            arrow_back
          </button>
          <h1 className="text-2xl font-bold text-text-primary">
            Ajustar Porcentajes
          </h1>
        </div>
        <p className="text-base text-text-secondary">
          Asigna el porcentaje que cada usuario debe aportar a las finanzas compartidas.
        </p>
      </header>

      {errors.users && (
        <div className="bg-error-bg border border-error-border text-error-text text-sm rounded-lg p-3 mb-4 whitespace-pre-line">
          {errors.users.message || errors.users.root?.message}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-text-secondary">Cargando usuarios...</div>
      ) : watchedUsers.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          No hay usuarios con salario registrado.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="bg-surface border border-outline rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline bg-surface-variant/30">
              <h2 className="text-base font-semibold">Usuarios</h2>
            </div>
            <div className="divide-y divide-outline">
              {watchedUsers.map((_, index) => (
                <div
                  key={index}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <input type="hidden" {...register(`users.${index}.user_id`)} />
                  <input type="hidden" {...register(`users.${index}.name`)} />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary text-sm">
                      {watchedUsers[index]?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="text-sm font-semibold">
                      {watchedUsers[index]?.name || "Usuario"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      {...register(`users.${index}.percentage`)}
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-20 px-3 py-2 bg-surface border border-outline rounded-lg text-text-primary text-right text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                    <span className="text-sm font-medium text-text-secondary">%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-outline bg-surface-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-secondary">Total:</span>
                <span
                  className={`text-sm font-bold ${isValid ? "text-primary" : "text-error"}`}
                >
                  {total.toFixed(2)}%
                </span>
                {!isValid && (
                  <span className="text-xs text-error">Debe sumar 100%</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/shared-finances")}
                  className="px-4 py-2 text-sm font-medium text-text-secondary border border-outline rounded-lg hover:bg-surface-variant transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </section>
        </form>
      )}
    </>
  );
}
