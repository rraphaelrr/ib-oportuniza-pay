export function formatarChavePix(valor = "") {
  if (!valor) return "";

  // Não altera e-mail
  if (valor.includes("@")) {
    return valor;
  }

  // Não altera QR Code Copia e Cola
  if (valor.startsWith("000201")) {
    return valor;
  }

  // Não altera chave aleatória (UUID)
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      valor,
    )
  ) {
    return valor;
  }

  const numeros = valor.replace(/\D/g, "");

  // CPF
  

  // Telefone brasileiro (com DDD)
  if (
    (numeros.length === 10 || numeros.length === 11) &&
    Number(numeros.substring(0, 2)) >= 11 &&
    Number(numeros.substring(0, 2)) <= 99
  ) {
    return numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4,5})(\d{4})$/, "$1-$2");
  }

  // Telefone com +55
  if (
    numeros.startsWith("55") &&
    (numeros.length === 12 || numeros.length === 13)
  ) {
    return numeros
      .replace(/^55(\d{2})(\d)/, "+55 ($1) $2")
      .replace(/(\d{4,5})(\d{4})$/, "$1-$2");
  }

  // CPF
  if (numeros.length <= 11) {
    return numeros
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
      .replace(/(-\d{2})\d+$/, "$1");
  }

  // CNPJ
  return numeros
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}
