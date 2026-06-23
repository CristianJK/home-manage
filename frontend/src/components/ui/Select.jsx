export function Select({
  label,
  error,
  id,
  options,
  placeholder = "Selecciona una opción",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        id={id}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
}
