export function buildSharedExpensePayload(data, isAdmin) {
  const mapped = Object.entries(data).map(([key, value]) => [
    key,
    key === "amount"
      ? Number(value)
      : key === "is_paid"
        ? value === "1"
        : value === ""
          ? null
          : value,
  ]);
  return Object.fromEntries(
    isAdmin ? mapped : mapped.filter(([key]) => key !== "is_paid")
  );
}

export function buildPayload(data, numericFields = ["amount"]) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      numericFields.includes(key) ? Number(value) : value,
    ])
  );
}
