import { useState } from "react";

import {
  gerarQRCodePix,
  consultarChavePix,
  consultarQRCode,
  pagarPixDict,
  pagarPixQRCode,
} from "../services/pixService";

import { detectarTipoChave } from "../utils/pixValidator";

export default function usePix() {
  // ==============================
  // DADOS DO USUÁRIO
  // ==============================

  const user = JSON.parse(localStorage.getItem("user"));

  const accountId = user?.user?.account_id;

  // ==============================
  // ESTADOS
  // ==============================

  const [loading, setLoading] = useState(false);

  const [comprovante, setComprovante] = useState(null);

  // ==============================
  // GERAR QR CODE
  // ==============================

  async function gerarQRCode(dados) {
    try {
      setLoading(true);

      return await gerarQRCodePix({
        accountId,
        agencyId: 123,
        valor: dados.valor,
        descricao: dados.descricao,
      });
    } finally {
      setLoading(false);
    }
  }

  // ==============================
  // CONSULTAR PIX
  // ==============================

  async function consultarPix(dados) {
    try {
      setLoading(true);

      const chave = dados.chavePix.trim();

      const tipo = detectarTipoChave(chave);

      switch (tipo) {
        case "qrcode": {
          const resposta = await consultarQRCode({
            qr_code: chave,
          });

          return {
            tipo,
            info: resposta.info || resposta,
          };
        }

        case "cpf":
        case "cnpj":
        case "email":
        case "telefone":
        case "aleatoria": {
          const resposta = await consultarChavePix(chave);

          return {
            tipo,
            info: resposta.info || resposta,
          };
        }

        default:
          throw new Error("Chave Pix inválida.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ==============================
  // ENVIAR PIX
  // ==============================

  async function enviarPix(dados) {
    try {
      setLoading(true);

      if (dados.tipo === "qrcode") {
        const pagamento = await pagarPixQRCode({
          qr_code: dados.chavePix,
          valor: formatAmount(dados.valor),
        });

        setComprovante(pagamento);

        return {
          sucesso: true,
          pagamento,
        };
      }

      const chave = dados.chavePix.trim();

      const chaveInfo = dados.chaveInfo;

      const payload = {
        account_id: accountId,

        agency_id: 123,

        amount: formatAmount(dados.valor),

        currency_code: "BRL",

        description: dados.descricao || "Pagamento Pix",

        external_id: crypto.randomUUID(),

        person_type:
          chaveInfo.holder?.person_type === "individual" ? "PF" : "PJ",

        pix_key: chave,

        pix_key_lookup_id: chaveInfo.lookup_id,

        pix_key_type: chaveInfo.key_type,
      };
      const pagamento = await pagarPixDict(payload);

      const comprovantePix = {
        id: pagamento.id,

        tipo: "pix enviado",

        descricao: dados.descricao || "Pagamento Pix",

        nome: dados.chaveInfo?.holder?.name || "Cliente Pix",

        valor: pagamento.amount,

        data: new Date().toISOString(),

        ...pagamento,
      };

      setComprovante(comprovantePix);

      return {
        sucesso: true,
        pagamento,
      };
    } finally {
      setLoading(false);
    }
  }

  // ==============================
  // RETORNO DO HOOK
  // ==============================

  return {
    loading,

    comprovante,

    gerarQRCode,

    consultarPix,

    enviarPix,
  };
}

// ==============================
// HELPERS
// ==============================

function formatAmount(value) {
  if (!value) {
    return "0.00";
  }

  let stringValue = String(value).replace("R$", "").trim();

  // Se já está no formato decimal americano
  if (stringValue.includes(".") && !stringValue.includes(",")) {
    return Number(stringValue).toFixed(2);
  }

  // Formato brasileiro
  stringValue = stringValue.replace(/\./g, "").replace(",", ".");

  const number = Number(stringValue);

  if (Number.isNaN(number)) {
    return "0.00";
  }

  return number.toFixed(2);
}
