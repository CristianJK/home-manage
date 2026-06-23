export function formatCurrency(amount, fractionDigits = 2) {
  return Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatDate(
  dateStr,
  options = { day: "numeric", month: "short", year: "numeric" },
) {
  return new Date(dateStr).toLocaleDateString("es-ES", options);
}

export function formatDateShort(dateStr) {
  return formatDate(dateStr, { day: "numeric", month: "short" });
}

export function daysUntilDue(dueDate) {
  const diff = Math.ceil(
    (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) {
    const daysOverdue = Math.abs(diff);
    return `Vencido por ${daysOverdue} ${daysOverdue === 1 ? "día" : "días"}`;
  }

  if (diff === 0) return "Hoy";
  if (diff === 1) return "Mañana";

  return `${diff} días`;
}

export function getMonthStart() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

export function isSameMonth(dateStr, monthStart) {
  if (!dateStr) return false;
  return dateStr.slice(0, 7) === monthStart.slice(0, 7);
}
