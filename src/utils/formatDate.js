/**
 * dd/MM/yyyy
 */
export function formatDate(date) {
  if (!date) return "-";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("pt-BR");
}

/**
 * dd/MM/yyyy HH:mm
 */
export function formatDateTime(date) {
  if (!date) return "-";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * dd/MM/yyyy HH:mm:ss
 */
export function formatFullDateTime(date) {
  if (!date) return "-";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Apenas hora
 */
export function formatTime(date) {
  if (!date) return "-";

  const d = new Date(date);

  return d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Hoje, Ontem ou data
 */
export function formatRelativeDate(date) {
  if (!date) return "-";

  const d = new Date(date);

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return `Hoje • ${formatTime(d)}`;
  }

  if (d.toDateString() === yesterday.toDateString()) {
    return `Ontem • ${formatTime(d)}`;
  }

  return formatDateTime(d);
}

/**
 * yyyy-MM-dd
 * Ideal para inputs type="date"
 */
export function formatInputDate(date) {
  if (!date) return "";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "";

  return d.toISOString().split("T")[0];
}

/**
 * Primeiro dia do mês
 */
export function firstDayOfMonth() {
  const d = new Date();

  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
 * Último dia do mês
 */
export function lastDayOfMonth() {
  const d = new Date();

  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/**
 * Últimos X dias
 */
export function lastDays(days = 7) {
  const end = new Date();

  const start = new Date();

  start.setDate(start.getDate() - days);

  return {
    start,
    end,
  };
}