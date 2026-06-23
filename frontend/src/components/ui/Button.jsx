const variantClasses = {
  primary:
    "bg-primary text-on-primary rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-all flex items-center gap-2",
  secondary:
    "text-text-secondary border border-outline rounded-lg hover:bg-surface-variant transition-all",
  danger:
    "bg-error text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all flex items-center gap-2",
  ghost:
    "text-text-secondary hover:text-text-primary transition-colors",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs font-medium",
  md: "px-5 py-2.5 text-sm font-medium",
  lg: "px-6 py-3 text-base font-medium",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className = "",
  ...props
}) {
  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {icon && !loading && (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
      {children}
    </button>
  );
}
