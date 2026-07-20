// src/utils/cep.js

export function limparCEP(cep = "") {
  return cep.replace(/\D/g, "");
}

export function formatarCEP(cep = "") {
  return limparCEP(cep)
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
}

export function validarCEP(cep = "") {
  return /^\d{5}-?\d{3}$/.test(cep);
}