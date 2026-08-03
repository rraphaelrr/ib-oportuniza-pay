export function identificarPix(valor) {

    valor = valor.trim();

    if (valor.startsWith("000201")) {
        return "QRCODE";
    }

    if (/^\d{11}$/.test(valor))
        return "CPF";

    if (/^\d{14}$/.test(valor))
        return "CNPJ";

    if (/^\+?55\d{10,11}$/.test(valor))
        return "PHONE";

    if (valor.includes("@"))
        return "EMAIL";

    return "RANDOM";
}