const baseInputClasses =
  "w-full px-4 py-3 bg-surface border border-outline rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

export function Input({
  label,
  error,
  id,
  as: asProp,
  rows = 3,
  className = "",
  ...props
}) {
  const Component = asProp === "textarea" ? "textarea" : "input";

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor={id}>
          {label}
        </label>
      )}
      <Component
        id={id}
        className={`${baseInputClasses} ${asProp === "textarea" ? "resize-none" : ""} ${className}`}
        rows={asProp === "textarea" ? rows : undefined}
        {...props}
      />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
}
