// src/utils/cpf.js

export function limparCPF(cpf = "") {
  return cpf.replace(/\D/g, "");
}

export function formatarCPF(cpf = "") {
  return limparCPF(cpf)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

export function mascararCPF(cpf = "") {
  cpf = formatarCPF(cpf);

  if (cpf.length !== 14) return cpf;

  return cpf.replace(
    /^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/,
    "***.$2.$3-**"
  );
}

export function validarCPF(cpf = "") {
  cpf = limparCPF(cpf);

  if (cpf.length !== 11) return false;

  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(cpf.charAt(i)) * (10 - i);
  }

  let resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;

  if (resto !== Number(cpf.charAt(9))) return false;

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(cpf.charAt(i)) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;

  return resto === Number(cpf.charAt(10));
}