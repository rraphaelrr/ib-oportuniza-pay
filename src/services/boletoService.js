import api from "./api";

/**
 * Lista os boletos da Account autenticada.
 *
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.limit
 * @param {string} params.status
 * @param {string} params.search
 * @param {string} params.start_date
 * @param {string} params.end_date
 */
export async function listarBoletos(params = {}) {
  const response = await api.get("/partner/v1/boletos", {
    params,
  });

  return response.data;
}

/**
 * Busca um boleto específico.
 *
 * @param {string} id
 */
export async function buscarBoleto(id) {
  const response = await api.get(`/partner/v1/boletos/${id}`);

  return response.data;
}

/**
 * Cria/emite um boleto.
 *
 * @param {Object} data
 */
export async function criarBoleto(data) {
  const response = await api.post("/partner/v1/boletos", data);

  return response.data;
}

/**
 * Atualiza os dados de um boleto.
 *
 * @param {string} id
 * @param {Object} data
 */
export async function atualizarBoleto(id, data) {
  const response = await api.patch(
    `/partner/v1/boletos/${id}`,
    data
  );

  return response.data;
}

/**
 * Cancela um boleto.
 *
 * @param {string} id
 */
export async function cancelarBoleto(id) {
  const response = await api.post(
    `/partner/v1/boletos/${id}/cancel`
  );

  return response.data;
}

/**
 * Obtém o PDF do boleto.
 *
 * @param {string} id
 */
export async function obterBoletoPDF(id) {
  const response = await api.get(
    `/partner/v1/boletos/${id}/pdf`,
    {
      responseType: "blob",
    }
  );

  return response.data;
}

/**
 * Gera vários boletos.
 *
 * @param {Object} data
 */
export async function gerarBoletosLote(data) {
  const response = await api.post(
    "/partner/v1/boletos/batch",
    data
  );

  return response.data;
}

/**
 * Consulta pagamentos/liquidações dos boletos.
 *
 * @param {Object} params
 */
export async function listarPagamentos(params = {}) {
  const response = await api.get(
    "/partner/v1/boletos/payments",
    {
      params,
    }
  );

  return response.data;
}

/**
 * Consulta clientes/pagadores.
 *
 * @param {Object} params
 */
export async function listarPagadores(params = {}) {
  const response = await api.get(
    "/partner/v1/payers",
    {
      params,
    }
  );

  return response.data;
}

/**
 * Busca um pagador específico.
 *
 * @param {string} id
 */
export async function buscarPagador(id) {
  const response = await api.get(
    `/partner/v1/payers/${id}`
  );

  return response.data;
}

/**
 * Lista contratos.
 *
 * @param {Object} params
 */
export async function listarContratos(params = {}) {
  const response = await api.get(
    "/partner/v1/contracts",
    {
      params,
    }
  );

  return response.data;
}

/**
 * Busca um contrato.
 *
 * @param {string} id
 */
export async function buscarContrato(id) {
  const response = await api.get(
    `/partner/v1/contracts/${id}`
  );

  return response.data;
}

/**
 * Lista boletos/parcelas inadimplentes.
 *
 * @param {Object} params
 */
export async function listarInadimplentes(params = {}) {
  const response = await api.get(
    "/partner/v1/collections/inadimplencia",
    {
      params,
    }
  );

  return response.data;
}