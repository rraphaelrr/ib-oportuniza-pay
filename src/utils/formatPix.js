// src/utils/formatPix.js

/**
 * Formata valor para moeda brasileira.
 */
export function formatCurrency(valor = 0) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Remove máscara monetária.
 */
export function currencyToNumber(valor = "") {
  if (!valor) return 0;

  return Number(
    valor
      .replace(/[R$\s]/g, "")
      .replace(/\./g, "")
      .replace(",", ".")
  );
}

/**
 * CPF
 */
export function formatCPF(valor = "") {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/**
 * CNPJ
 */
export function formatCNPJ(valor = "") {
  return valor
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

/**
 * Telefone
 */
export function formatPhone(valor = "") {
  const numero = valor.replace(/\D/g, "");

  if (numero.length <= 10) {
    return numero.replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return numero.replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

/**
 * Formata qualquer chave PIX.
 */
export function formatPixKey(chave = "") {
  const numeros = chave.replace(/\D/g, "");

  if (numeros.length === 11) {
    return formatCPF(chave);
  }

  if (numeros.length === 14) {
    return formatCNPJ(chave);
  }

  if (numeros.length >= 10 && numeros.length <= 13) {
    return formatPhone(chave);
  }

  return chave;
}

/**
 * Mascara CPF.
 */
export function maskCPF(cpf = "") {
  const n = cpf.replace(/\D/g, "");

  return n.replace(/^(\d{3})\d{5}(\d{3})$/, "$1*****$2");
}

/**
 * Mascara CNPJ.
 */
export function maskCNPJ(cnpj = "") {
  const n = cnpj.replace(/\D/g, "");

  return n.replace(/^(\d{2})\d{8}(\d{4})$/, "$1********$2");
}

/**
 * Mascara telefone.
 */
export function maskPhone(phone = "") {
  const n = phone.replace(/\D/g, "");

  if (n.length < 4) return phone;

  return `(**) *****-${n.slice(-4)}`;
}

/**
 * Mascara email.
 */
export function maskEmail(email = "") {
  const [usuario, dominio] = email.split("@");

  if (!dominio) return email;

  return `${usuario.substring(0, 2)}*****@${dominio}`;
}

/**
 * Formata data.
 */
export function formatDate(data) {
  return new Date(data).toLocaleString("pt-BR");
}