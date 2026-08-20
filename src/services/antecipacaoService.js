import api from "./api";

/*
|--------------------------------------------------------------------------
| CONFIGURAÇÃO
|--------------------------------------------------------------------------
*/

const TOKEN =
  "5b7a8e4ffbeae77b80085436d2bde1d60b93f3dd7f876a84e0a59eeff5fe8a87dab367cd047af7ef7aaef2b15f31d185";

/*
|--------------------------------------------------------------------------
| HEADERS
|--------------------------------------------------------------------------
*/

function getAuthHeaders(extraHeaders = {}) {
  return {
    "X-Partner-Internal-Token": TOKEN,
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    ...extraHeaders,
  };
}

/*
|--------------------------------------------------------------------------
| UTILITÁRIO
|--------------------------------------------------------------------------
| Gera uma chave de idempotência para operações de criação/alteração.
|--------------------------------------------------------------------------
*/

function generateIdempotencyKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/*
|--------------------------------------------------------------------------
| 1. LISTAR SOLICITAÇÕES
|--------------------------------------------------------------------------
| GET
| /partner/v1/receivable-advances
|--------------------------------------------------------------------------
*/

export async function getAntecipacoes() {
  console.log("🚀 getAntecipacoes FOI CHAMADO");

  const token = localStorage.getItem("access_token");

  console.log("🔐 access_token:", token);

  console.log(
    "🌐 URL:",
    "partner/v1/receivable-advances"
  );

  try {
    const response = await api.get(
      "partner/v1/receivable-advances",
      {
        headers: getAuthHeaders(),
      }
    );

    console.log(
      "✅ RESPOSTA ANTECIPAÇÕES:",
      response
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ ERRO AO BUSCAR ANTECIPAÇÕES:",
      error
    );

    console.error(
      "❌ RESPONSE:",
      error?.response
    );

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| 2. CRIAR SOLICITAÇÃO DE ANTECIPAÇÃO
|--------------------------------------------------------------------------
| POST
| /partner/v1/receivable-advances
|--------------------------------------------------------------------------
*/

export async function criarAntecipacao(payload) {
  const { data } = await api.post(
    "partner/v1/receivable-advances",
    payload,
    {
      headers: getAuthHeaders({
        "Idempotency-Key": generateIdempotencyKey(),
      }),
    }
  );

  return data;
}

/*
|--------------------------------------------------------------------------
| 3. SIMULAR ANTECIPAÇÃO
|--------------------------------------------------------------------------
| POST
| /partner/v1/receivable-advances/simulations
|--------------------------------------------------------------------------
| Não cria uma operação.
|--------------------------------------------------------------------------
*/

export async function simularAntecipacao(payload) {
  const { data } = await api.post(
    "partner/v1/receivable-advances/simulations",
    payload,
    {
      headers: getAuthHeaders(),
    }
  );

  return data;
}

/*
|--------------------------------------------------------------------------
| 4. CONSULTAR SOLICITAÇÃO COMPLETA
|--------------------------------------------------------------------------
| GET
| /partner/v1/receivable-advances/{id}
|--------------------------------------------------------------------------
*/

export async function getAntecipacaoById(id) {
  if (!id) {
    throw new Error("ID da antecipação é obrigatório.");
  }

  const { data } = await api.get(
    `partner/v1/receivable-advances/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return data;
}

/*
|--------------------------------------------------------------------------
| 5. VINCULAR DOCUMENTO
|--------------------------------------------------------------------------
| POST
| /partner/v1/receivable-advances/{id}/documents
|--------------------------------------------------------------------------
*/

export async function adicionarDocumento(
  antecipacaoId,
  payload
) {
  if (!antecipacaoId) {
    throw new Error("ID da antecipação é obrigatório.");
  }

  const { data } = await api.post(
    `partner/v1/receivable-advances/${antecipacaoId}/documents`,
    payload,
    {
      headers: getAuthHeaders({
        "Idempotency-Key": generateIdempotencyKey(),
      }),
    }
  );

  return data;
}

/*
|--------------------------------------------------------------------------
| 6. LISTAR OFERTAS
|--------------------------------------------------------------------------
| GET
| /partner/v1/receivable-advances/{id}/offers
|--------------------------------------------------------------------------
*/

export async function getOfertas(antecipacaoId) {
  if (!antecipacaoId) {
    throw new Error("ID da antecipação é obrigatório.");
  }

  const { data } = await api.get(
    `partner/v1/receivable-advances/${antecipacaoId}/offers`,
    {
      headers: getAuthHeaders(),
    }
  );

  return data;
}

/*
|--------------------------------------------------------------------------
| 7. ACEITAR OFERTA
|--------------------------------------------------------------------------
| POST
| /partner/v1/receivable-advances/{id}/offers/{offer_id}/accept
|--------------------------------------------------------------------------
*/

export async function aceitarOferta(
  antecipacaoId,
  offerId
) {
  if (!antecipacaoId) {
    throw new Error("ID da antecipação é obrigatório.");
  }

  if (!offerId) {
    throw new Error("ID da oferta é obrigatório.");
  }

  const { data } = await api.post(
    `partner/v1/receivable-advances/${antecipacaoId}/offers/${offerId}/accept`,
    {},
    {
      headers: getAuthHeaders({
        "Idempotency-Key": generateIdempotencyKey(),
      }),
    }
  );

  return data;
}

/*
|--------------------------------------------------------------------------
| 8. ADICIONAR RECEBÍVEL
|--------------------------------------------------------------------------
| POST
| /partner/v1/receivable-advances/{id}/receivables
|--------------------------------------------------------------------------
*/

export async function adicionarRecebivel(
  antecipacaoId,
  payload
) {
  if (!antecipacaoId) {
    throw new Error("ID da antecipação é obrigatório.");
  }

  const { data } = await api.post(
    `partner/v1/receivable-advances/${antecipacaoId}/receivables`,
    payload,
    {
      headers: getAuthHeaders({
        "Idempotency-Key": generateIdempotencyKey(),
      }),
    }
  );

  return data;
}

/*
|--------------------------------------------------------------------------
| 9. ENVIAR SOLICITAÇÃO PARA ANÁLISE
|--------------------------------------------------------------------------
| POST
| /partner/v1/receivable-advances/{id}/submit
|--------------------------------------------------------------------------
*/

export async function enviarAntecipacao(
  antecipacaoId,
  payload = {}
) {
  if (!antecipacaoId) {
    throw new Error("ID da antecipação é obrigatório.");
  }

  const { data } = await api.post(
    `partner/v1/receivable-advances/${antecipacaoId}/submit`,
    payload,
    {
      headers: getAuthHeaders({
        "Idempotency-Key": generateIdempotencyKey(),
      }),
    }
  );

  return data;
}

/*
|--------------------------------------------------------------------------
| EXPORT DEFAULT
|--------------------------------------------------------------------------
*/

const antecipacaoService = {
  getAntecipacoes,
  criarAntecipacao,
  simularAntecipacao,
  getAntecipacaoById,
  adicionarDocumento,
  getOfertas,
  aceitarOferta,
  adicionarRecebivel,
  enviarAntecipacao,
};

export default antecipacaoService;