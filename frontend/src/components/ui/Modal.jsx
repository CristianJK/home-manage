import { useEffect } from "react";

export function Modal({
  isOpen,
  onClose,
  title,
  serverError,
  children,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="material-symbols-outlined text-text-secondary hover:text-text-primary transition-colors"
          >
            close
          </button>
        </div>

        {serverError && (
          <div className="bg-error-bg border border-error-border text-error-text text-sm rounded-lg p-3 whitespace-pre-line">
            {serverError}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
