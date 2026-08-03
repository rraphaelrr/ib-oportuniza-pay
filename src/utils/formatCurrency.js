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
  if (!value) return "";

  const number = Number(
    value
      .replace(/[^\d,.-]/g, "")
      .replace(",", ".")
  );

  if (isNaN(number)) {
    return "";
  }

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}