// src/utils/masks.js

export function onlyNumbers(value = "") {
  return value.replace(/\D/g, "");
}

export function cpfMask(value = "") {
  return onlyNumbers(value)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

export function cnpjMask(value = "") {
  return onlyNumbers(value)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}

export function cepMask(value = "") {
  return onlyNumbers(value)
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
}

export function phoneMask(value = "") {
  return onlyNumbers(value)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2")
    .slice(0, 15);
}

export function rgMask(value = "") {
  return onlyNumbers(value)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1-$2")
    .slice(0, 12);
}

export function moneyMask(value = "") {
  let v = onlyNumbers(value);

  if (!v) return "";

  v = (parseInt(v, 10) / 100).toFixed(2);

  return Number(v).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function cardMask(value = "") {
  return onlyNumbers(value)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .slice(0, 19);
}

export function cvvMask(value = "") {
  return onlyNumbers(value).slice(0, 4);
}

export function dateMask(value = "") {
  return onlyNumbers(value)
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
}