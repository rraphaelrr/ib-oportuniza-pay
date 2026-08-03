// src/utils/pixValidator.js

/**
 * Detecta automaticamente o tipo da chave PIX.
 */
export function detectarTipoChave(chave = "") {
  const valor = chave.trim();

  if (!valor) return null;
  if (
    valor.startsWith("000201") &&
    valor.length > 50 &&
    valor.includes("6304")
  ) {
    return "qrcode";
  }
  const numeros = valor.replace(/\D/g, "");

  // Email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
    return "email";
  }

  // CPF
  if (numeros.length === 11) {
    return "cpf";
  }

  // CNPJ
  if (numeros.length === 14) {
    return "cnpj";
  }

  // Telefone
  if (
    numeros.length >= 10 &&
    numeros.length <= 13 &&
    (numeros.startsWith("55") || numeros.length === 10 || numeros.length === 11)
  ) {
    return "telefone";
  }

  // Chave Aleatória UUID
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      valor,
    )
  ) {
    return "aleatoria";
  }

  return "desconhecida";
}

export function validarQRCode(qr = "") {
  qr = qr.trim();

  return qr.startsWith("000201") && qr.length > 50 && qr.includes("6304");
}

/**
 * Valida CPF.
 */
export function validarCPF(cpf = "") {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) return false;

  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }

  let resto = (soma * 10) % 11;

  if (resto === 10) resto = 0;

  if (resto !== Number(cpf[9])) return false;

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10) resto = 0;

  return resto === Number(cpf[10]);
}

/**
 * Valida CNPJ.
 */
export function validarCNPJ(cnpj = "") {
  cnpj = cnpj.replace(/\D/g, "");

  if (cnpj.length !== 14) return false;

  if (/^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = 12;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);

  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros[tamanho - i] * pos--;

    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

  if (resultado !== Number(digitos[0])) return false;

  tamanho = 13;
  numeros = cnpj.substring(0, tamanho);

  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros[tamanho - i] * pos--;

    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

  return resultado === Number(digitos[1]);
}

/**
 * Valida Email.
 */
export function validarEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida telefone brasileiro.
 */
export function validarTelefone(telefone = "") {
  const numero = telefone.replace(/\D/g, "");

  return numero.length >= 10 && numero.length <= 13;
}

/**
 * Valida chave PIX automaticamente.
 */
export function validarChave(chave = "") {
  const tipo = detectarTipoChave(chave);

  switch (tipo) {
    case "cpf":
      return validarCPF(chave);

    case "cnpj":
      return validarCNPJ(chave);

    case "email":
      return validarEmail(chave);

    case "telefone":
      return validarTelefone(chave);

    case "aleatoria":
      return true;

    case "qrcode":
      return validarQRCode(chave);

    default:
      return false;
  }
}


export function isQRCodePix(value = "") {
  return (
    value.startsWith("000201") ||
    value.length > 50
  );
}