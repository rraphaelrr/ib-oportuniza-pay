import api from "./api";
import { v4 as uuidv4 } from "uuid";

const TOKEN =
  "5b7a8e4ffbeae77b80085436d2bde1d60b93f3dd7f876a84e0a59eeff5fe8a87dab367cd047af7ef7aaef2b15f31d185";

// =====================================
// CONFIGURAÇÃO DE HEADERS
// =====================================

function pixHeaders() {
  return {
    "X-Partner-Internal-Token": TOKEN,

    "Idempotency-Key": uuidv4(),

    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  };
}

// =====================================
// MOCKS
// =====================================

export async function gerarQRCodePixMock(dados) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    account_id: "123456",

    agency_id: "0001",

    amount: Number(dados.valor).toFixed(2),

    currency_code: "BRL",

    external_id: crypto.randomUUID(),

    id: crypto.randomUUID(),

    operation: "PIX_DYNAMIC",

    pix_key: "pix@empresa.com.br",

    pix_key_type: "EMAIL",

    provider: "Mock",

    provider_transaction_id: crypto.randomUUID(),

    qr_code: `00020126580014BR.GOV.BCB.PIX0136pix@empresa.com.br520400005303986540${Number(
      dados.valor,
    ).toFixed(2)}5802BR5913Empresa Teste6009SAO PAULO62070503***6304ABCD`,

    status: "CREATED",

    tx_id: crypto.randomUUID(),
  };
}

export async function consultarChavePixMock(chave) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    info: {
      key: chave,

      key_type: "EMAIL",

      holder_name: "Empresa Teste LTDA",

      holder_document: "12.345.678/0001-90",

      bank_name: "Banco Mock",

      branch: "0001",

      account: "12345678",
    },
  };
}

export async function consultarQRCodeMock() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    info: {
      amount: "100.00",

      merchant_name: "Empresa Teste",

      pix_key: "pix@empresa.com.br",
    },
  };
}

export async function pagarPixMock(payload) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    sucesso: true,

    pagamento: {
      id: crypto.randomUUID(),

      amount: payload.amount || "10.00",

      pix_key: payload.pix_key || "pix@empresa.com.br",

      end_to_end_id: "E1234567890123456789012345678901",
    },
  };
}

// =====================================
// API REAL
// =====================================

// =====================================
// GERAR QR CODE PIX DINÂMICO
// POST /partner/v1/pix/dynamic
// =====================================

export async function gerarQRCodePixReal({
  accountId,

  agencyId,

  valor,

  descricao,
}) {
  const { data } = await api.post(
    "/partner/v1/pix/dynamic",

    {
      account_id: accountId,

      agency_id: agencyId,

      amount: Number(valor).toFixed(2),

      currency_code: "BRL",

      description: descricao,

      expires_in: 3600,

      external_id: uuidv4(),
    },

    {
      headers: pixHeaders(),
    },
  );

  return data;
}

// =====================================
// CONSULTAR CHAVE PIX
// GET /partner/v1/pix/keys/{pixKey}/info
// =====================================

export async function consultarChavePixReal(pixKey) {
  const { data } = await api.get(
    `/partner/v1/pix/keys/${encodeURIComponent(pixKey)}/info`,

    {
      headers: pixHeaders(),
    },
  );

  return data;
}

// =====================================
// CONSULTAR QR CODE PIX
// POST /partner/v1/pix/payments/qrc/info
// =====================================

export async function consultarQRCodeReal(payload) {
  const { data } = await api.post(
    "/partner/v1/pix/payments/qrc/info",

    payload,

    {
      headers: pixHeaders(),
    },
  );

  return data;
}

// =====================================
// PAGAR PIX POR QR CODE
// POST /partner/v1/pix/payments/qrc
// =====================================

export async function pagarPixQRCodeReal(payload) {
  const { data } = await api.post(
    "/partner/v1/pix/payments/qrc",

    payload,

    {
      headers: pixHeaders(),
    },
  );

  return data;
}

// =====================================
// PAGAR PIX POR CHAVE DICT
// POST /partner/v1/pix/out/dict
// =====================================

export async function pagarPixDictReal(payload) {
  const { data } = await api.post(
    "/partner/v1/pix/out/dict",

    payload,

    {
      headers: pixHeaders(),
    },
  );

  return data;
}

const USE_MOCK = true;

// ========================
// EXPORTS
// ========================

export const gerarQRCodePix = USE_MOCK
  ? gerarQRCodePixMock
  : gerarQRCodePixReal;

export const consultarChavePix = USE_MOCK
  ? consultarChavePixMock
  : consultarChavePixReal;

export const consultarQRCode = USE_MOCK
  ? consultarQRCodeMock
  : consultarQRCodeReal;

export const pagarPixQRCode = USE_MOCK ? pagarPixMock : pagarPixQRCodeReal;

export const pagarPixDict = USE_MOCK ? pagarPixMock : pagarPixDictReal;
