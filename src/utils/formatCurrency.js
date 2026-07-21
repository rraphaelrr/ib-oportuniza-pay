export function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return "R$ 0,00";
  }

  const number =
    typeof value === "string"
      ? Number(value.toString().replace(",", "."))
      : Number(value);

  if (isNaN(number)) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(number);
}

/**
 * Remove máscara monetária
 */
export function currencyToNumber(value) {
  if (!value) return 0;

  return Number(
    value
      .replace(/[R$\s]/g, "")
      .replace(/\./g, "")
      .replace(",", ".")
  );
}

/**
 * Máscara monetária enquanto digita
 */
export function maskCurrency(value) {
  const numbers = value.replace(/\D/g, "");

  const amount = Number(numbers) / 100;

  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}