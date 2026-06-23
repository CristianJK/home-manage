export const conceptConfig = {
  rent: { icon: "home", label: "Renta", color: "bg-primary" },
  water: { icon: "water_drop", label: "Agua", color: "bg-sky-500" },
  electricity: { icon: "bolt", label: "Electricidad", color: "bg-amber-500" },
  internet: { icon: "wifi", label: "Internet", color: "bg-violet-500" },
  gas: { icon: "local_fire_department", label: "Gas", color: "bg-orange-500" },
  other: { icon: "more_horiz", label: "Otro", color: "bg-slate-500" },
};

export const frequencyLabels = {
  unique: "Único",
  monthly: "Mensual",
  yearly: "Anual",
  biweekly: "Quincenal",
  semiannual: "Semestral",
};

export const categoryConfig = {
  food: { icon: "restaurant_menu", label: "Comida", color: "bg-primary" },
  transportation: { icon: "directions_car", label: "Transporte", color: "bg-amber-500" },
  housing: { icon: "home", label: "Vivienda", color: "bg-violet-500" },
  entertainment: { icon: "movie", label: "Entretenimiento", color: "bg-pink-500" },
  health: { icon: "favorite", label: "Salud", color: "bg-rose-500" },
  other: { icon: "more_horiz", label: "Otro", color: "bg-slate-500" },
};

export const conceptOptions = [
  { value: "rent", label: "Renta" },
  { value: "water", label: "Agua" },
  { value: "electricity", label: "Electricidad" },
  { value: "internet", label: "Internet" },
  { value: "gas", label: "Gas" },
  { value: "other", label: "Otro" },
];

export const frequencyOptions = [
  { value: "unique", label: "Único" },
  { value: "monthly", label: "Mensual" },
  { value: "yearly", label: "Anual" },
  { value: "biweekly", label: "Quincenal" },
  { value: "semiannual", label: "Semestral" },
];

export const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
