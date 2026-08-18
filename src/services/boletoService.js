import { v4 as uuidv4 } from "uuid";
import api from "./api";

/*
|--------------------------------------------------------------------------
| CONFIGURAÇÃO
|--------------------------------------------------------------------------
*/

const USE_MOCK = true;

/*
|--------------------------------------------------------------------------
| HEADERS
|--------------------------------------------------------------------------
*/

function getHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,

    "X-Partner-Internal-Token":
      "5b7a8e4ffbeae77b80085436d2bde1d60b93f3dd7f876a84e0a59eeff5fe8a87dab367cd047af7ef7aaef2b15f31d185",
  };
}

/*
|--------------------------------------------------------------------------
| MOCK CLIENTES
|--------------------------------------------------------------------------
*/

let MOCK_CLIENTES = [
  {
    id: "cli-001",
    name: "João da Silva",
    document: "123.456.789-00",
    email: "joao@example.com",
  },

  {
    id: "cli-002",
    name: "Maria Oliveira",
    document: "987.654.321-00",
    email: "maria@example.com",
  },

  {
    id: "cli-003",
    name: "Empresa ABC Ltda",
    document: "12.345.678/0001-90",
    email: "contato@empresaabc.com",
  },

  {
    id: "cli-004",
    name: "Carlos Mendes",
    document: "456.789.123-00",
    email: "carlos@example.com",
  },
];

/*
|--------------------------------------------------------------------------
| MOCK CONTRATOS
|--------------------------------------------------------------------------
*/

const MOCK_CONTRATOS = [
  {
    id: "ctr-001",
    client_id: "cli-001",
    number: "CTR-2026-001",
    description: "Contrato residencial",
    status: "active",
  },

  {
    id: "ctr-002",
    client_id: "cli-002",
    number: "CTR-2026-002",
    description: "Contrato comercial",
    status: "active",
  },

  {
    id: "ctr-003",
    client_id: "cli-003",
    number: "CTR-2026-003",
    description: "Contrato empresarial",
    status: "active",
  },

  {
    id: "ctr-004",
    client_id: "cli-004",
    number: "CTR-2026-004",
    description: "Contrato residencial",
    status: "active",
  },
];

/*
|--------------------------------------------------------------------------
| MOCK BOLETOS
|--------------------------------------------------------------------------
*/

const MOCK_BOLETOS = [
  {
    id: "b1a2c3d4-0001",
    account_id: "acc-001",
    agency_id: "ag-001",

    amount: "1250.00",
    paid_amount: "0.00",
    currency: "BRL",

    barcode:
      "00190500954014481606906809350314337370000000100",

    digitable_line:
      "00190.50095 40144.816069 06809.350314 3 37370000000100",

    due_date: "2026-08-20",

    external_id: "BOLETO-001",

    installment_id: "inst-001",

    metadata: {
      contrato: "CTR-2026-001",
      cliente: "João da Silva",
      client_id: "cli-001",
      contract_id: "ctr-001",
    },

    nosso_numero: "000000001",

    payer_id: "payer-001",

    provider: "mock-provider",

    provider_reference: "MOCK-REF-001",

    receivable_id: "rec-001",

    registered_at: "2026-08-10T10:00:00.000Z",

    registration_error_code: null,

    registration_error_message: null,

    status: "open",

    created_at: "2026-08-10T09:00:00.000Z",

    updated_at: "2026-08-10T09:00:00.000Z",

    cancelled_at: null,

    paid_at: null,
  },

  {
    id: "b1a2c3d4-0002",
    account_id: "acc-001",
    agency_id: "ag-001",

    amount: "850.00",
    paid_amount: "850.00",
    currency: "BRL",

    barcode:
      "00190500954014481606906809350314337370000000850",

    digitable_line:
      "00190.50095 40144.816069 06809.350314 3 37370000000850",

    due_date: "2026-08-05",

    external_id: "BOLETO-002",

    installment_id: "inst-002",

    metadata: {
      contrato: "CTR-2026-002",
      cliente: "Maria Oliveira",
      client_id: "cli-002",
      contract_id: "ctr-002",
    },

    nosso_numero: "000000002",

    payer_id: "payer-002",

    provider: "mock-provider",

    provider_reference: "MOCK-REF-002",

    receivable_id: "rec-002",

    registered_at: "2026-08-01T10:00:00.000Z",

    registration_error_code: null,

    registration_error_message: null,

    status: "paid",

    created_at: "2026-08-01T09:00:00.000Z",

    updated_at: "2026-08-06T09:00:00.000Z",

    cancelled_at: null,

    paid_at: "2026-08-06T08:30:00.000Z",
  },

  {
    id: "b1a2c3d4-0003",
    account_id: "acc-001",
    agency_id: "ag-001",

    amount: "2300.00",
    paid_amount: "0.00",
    currency: "BRL",

    barcode:
      "00190500954014481606906809350314337370000002300",

    digitable_line:
      "00190.50095 40144.816069 06809.350314 3 37370000002300",

    due_date: "2026-07-25",

    external_id: "BOLETO-003",

    installment_id: "inst-003",

    metadata: {
      contrato: "CTR-2026-003",
      cliente: "Empresa ABC Ltda",
      client_id: "cli-003",
      contract_id: "ctr-003",
    },

    nosso_numero: "000000003",

    payer_id: "payer-003",

    provider: "mock-provider",

    provider_reference: "MOCK-REF-003",

    receivable_id: "rec-003",

    registered_at: "2026-07-20T10:00:00.000Z",

    registration_error_code: null,

    registration_error_message: null,

    status: "overdue",

    created_at: "2026-07-20T09:00:00.000Z",

    updated_at: "2026-07-26T09:00:00.000Z",

    cancelled_at: null,

    paid_at: null,
  },

  {
    id: "b1a2c3d4-0004",
    account_id: "acc-001",
    agency_id: "ag-001",

    amount: "450.00",
    paid_amount: "0.00",
    currency: "BRL",

    barcode:
      "00190500954014481606906809350314337370000000450",

    digitable_line:
      "00190.50095 40144.816069 06809.350314 3 37370000000450",

    due_date: "2026-08-28",

    external_id: "BOLETO-004",

    installment_id: "inst-004",

    metadata: {
      contrato: "CTR-2026-004",
      cliente: "Carlos Mendes",
      client_id: "cli-004",
      contract_id: "ctr-004",
    },

    nosso_numero: "000000004",

    payer_id: "payer-004",

    provider: "mock-provider",

    provider_reference: "MOCK-REF-004",

    receivable_id: "rec-004",

    registered_at: "2026-08-12T10:00:00.000Z",

    registration_error_code: null,

    registration_error_message: null,

    status: "open",

    created_at: "2026-08-12T09:00:00.000Z",

    updated_at: "2026-08-12T09:00:00.000Z",

    cancelled_at: null,

    paid_at: null,
  },
];

/*
|--------------------------------------------------------------------------
| MOCK OVERVIEW
|--------------------------------------------------------------------------
*/

const MOCK_OVERVIEW = {
  currency: "BRL",

  open_amount: "9800.00",
  open_boletos: 43,

  overdue_boletos: 18,

  paid_amount: "52430.00",
  paid_boletos: 91,

  registration_errors: 2,

  total_boletos: 152,
};

/*
|--------------------------------------------------------------------------
| UTILITÁRIOS
|--------------------------------------------------------------------------
*/
function delay(ms = 0) {
  return Promise.resolve();
}

function createMockBoleto(data = {}) {
  const id = uuidv4();

  const client = MOCK_CLIENTES.find(
    (item) =>
      String(item.id) === String(data.client_id),
  );

  const contract = MOCK_CONTRATOS.find(
    (item) =>
      String(item.id) === String(data.contract_id),
  );

  const now = new Date().toISOString();

  return {
    id,

    account_id: "acc-001",
    agency_id: "ag-001",

    amount: Number(data.amount || 100).toFixed(2),

    paid_amount: "0.00",

    currency: data.currency || "BRL",

    barcode:
      data.barcode ||
      "00190500954014481606906809350314337370000000100",

    digitable_line:
      data.digitable_line ||
      "00190.50095 40144.816069 06809.350314 3 37370000000100",

    due_date:
      data.due_date ||
      new Date(
        Date.now() + 15 * 86400000,
      )
        .toISOString()
        .substring(0, 10),

    external_id:
      data.external_id ||
      `BOLETO-${Date.now()}`,

    installment_id:
      data.installment_id ||
      uuidv4(),

    metadata: {
      ...data.metadata,

      cliente:
        client?.name ||
        client?.nome ||
        "Cliente não informado",

      contrato:
        contract?.number ||
        contract?.numero ||
        contract?.contract_number ||
        data.contract_id ||
        "—",

      client_id:
        data.client_id || null,

      contract_id:
        data.contract_id || null,

      description:
        data.description || null,

      discount:
        data.discount || null,

      interest:
        data.interest ?? 0,

      fine:
        data.fine ?? 0,

      instructions:
        data.instructions || null,
    },

    nosso_numero:
      data.nosso_numero ||
      String(
        Math.floor(
          Math.random() * 999999999,
        ),
      ).padStart(9, "0"),

    payer_id:
      data.payer_id ||
      data.client_id ||
      "payer-001",

    provider: "mock-provider",

    provider_reference:
      `MOCK-${Date.now()}`,

    receivable_id:
      data.receivable_id ||
      uuidv4(),

    registered_at: now,

    registration_error_code: null,

    registration_error_message: null,

    status: "open",

    created_at: now,

    updated_at: now,

    cancelled_at: null,

    paid_at: null,
  };
}

/*
|--------------------------------------------------------------------------
| CLIENTES
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| POST /partner/v1/payers
| MOCK - CRIAR CLIENTE
|--------------------------------------------------------------------------
*/

export async function criarCliente(payload) {
  if (USE_MOCK) {
    await delay(700);

    const cliente = {
      id: `cli-${uuidv4()}`,

      name: payload.name,

      document: payload.document_number,

      document_number: payload.document_number,

      document_type:
        payload.document_type || "CPF",

      person_type:
        payload.person_type || "PF",

      email: payload.email || "",

      phone: payload.phone || "",

      external_id:
        payload.external_id || uuidv4(),

      metadata:
        payload.metadata || {},

      contracts: [],

      boletos: [],

      overdue_count: 0,

      created_at:
        new Date().toISOString(),

      updated_at:
        new Date().toISOString(),
    };

    MOCK_CLIENTES.unshift(cliente);

    return {
      ...cliente,
    };
  }

  const response = await api.post(
    "/partner/v1/payers",
    payload,
    {
      headers: {
        ...getHeaders(),

        "Idempotency-Key":
          payload.external_id || uuidv4(),
      },
    }
  );

  return response.data;
}

export async function getClientes() {
  if (USE_MOCK) {
    await delay();

    return [...MOCK_CLIENTES];
  }

  const response = await api.get(
    "/partner/v1/payers",
    {
      headers: getHeaders(),
    },
  );

  return Array.isArray(response.data)
    ? response.data
    : response.data?.data || [];
}

/*
|--------------------------------------------------------------------------
| CONTRATOS
|--------------------------------------------------------------------------
*/

export async function getContratos() {
  if (USE_MOCK) {
    await delay();

    return [...MOCK_CONTRATOS];
  }

  const response = await api.get(
    "/partner/v1/contracts",
    {
      headers: getHeaders(),
    },
  );

  return Array.isArray(response.data)
    ? response.data
    : response.data?.data || [];
}

/*
|--------------------------------------------------------------------------
| GET /partner/v1/boletos
|--------------------------------------------------------------------------
*/

export async function listarBoletos() {
  if (USE_MOCK) {
    await delay();

    return [...MOCK_BOLETOS];
  }

  const response = await api.get(
    "/partner/v1/boletos",
    {
      headers: getHeaders(),
    },
  );

  return Array.isArray(response.data)
    ? response.data
    : response.data?.data || [];
}

/*
|--------------------------------------------------------------------------
| GET /partner/v1/boletos/overview
|--------------------------------------------------------------------------
*/

export async function obterOverviewBoletos() {
  if (USE_MOCK) {
    await delay();

    return {
      ...MOCK_OVERVIEW,
    };
  }

  const response = await api.get(
    "/partner/v1/boletos/overview",
    {
      headers: getHeaders(),
    },
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| GET /partner/v1/boletos/{id}
|--------------------------------------------------------------------------
*/

export async function obterBoleto(id) {
  if (USE_MOCK) {
    await delay();

    const boleto = MOCK_BOLETOS.find(
      (item) => item.id === id,
    );

    if (boleto) {
      return { ...boleto };
    }

    return {
      ...MOCK_BOLETOS[0],
      id,
    };
  }

  const response = await api.get(
    `/partner/v1/boletos/${id}`,
    {
      headers: getHeaders(),
    },
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| GET /partner/v1/boletos/external/{external_id}
|--------------------------------------------------------------------------
*/

export async function obterBoletoPorExternalId(
  externalId,
) {
  if (USE_MOCK) {
    await delay();

    const boleto = MOCK_BOLETOS.find(
      (item) =>
        item.external_id === externalId,
    );

    if (!boleto) {
      throw new Error(
        "Boleto não encontrado.",
      );
    }

    return { ...boleto };
  }

  const response = await api.get(
    `/partner/v1/boletos/external/${encodeURIComponent(
      externalId,
    )}`,
    {
      headers: getHeaders(),
    },
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| GET /partner/v1/boletos/nosso-numero/{nosso_numero}
|--------------------------------------------------------------------------
*/

export async function obterBoletoPorNossoNumero(
  nossoNumero,
) {
  if (USE_MOCK) {
    await delay();

    const boleto = MOCK_BOLETOS.find(
      (item) =>
        item.nosso_numero === nossoNumero,
    );

    if (!boleto) {
      throw new Error(
        "Boleto não encontrado.",
      );
    }

    return { ...boleto };
  }

  const response = await api.get(
    `/partner/v1/boletos/nosso-numero/${encodeURIComponent(
      nossoNumero,
    )}`,
    {
      headers: getHeaders(),
    },
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| POST /partner/v1/boletos
|--------------------------------------------------------------------------
*/

export async function criarBoleto(payload) {
  const externalId =
    payload.external_id ||
    `BOLETO-${Date.now()}`;

  const requestPayload = {
    amount: payload.amount,

    currency:
      payload.currency || "BRL",

    due_date: payload.due_date,

    external_id: externalId,

    installment_id:
      payload.installment_id || null,

    instructions:
      payload.instructions || "",

    metadata: {
      ...(payload.metadata || {}),

      client_id:
        payload.client_id || null,

      contract_id:
        payload.contract_id || null,

      description:
        payload.description || null,

      discount:
        payload.discount || null,

      interest:
        payload.interest ?? 0,

      fine:
        payload.fine ?? 0,

      instructions:
        payload.instructions || null,
    },

    payer_id:
      payload.payer_id ||
      payload.client_id ||
      null,

    protest_days:
      payload.protest_days || 0,

    receivable_id:
      payload.receivable_id || null,

    /*
     * Mantemos os campos abaixo no payload interno
     * para o mock conseguir montar corretamente
     * os dados do cliente e contrato.
     */
    client_id:
      payload.client_id || null,

    contract_id:
      payload.contract_id || null,

    description:
      payload.description || null,

    discount:
      payload.discount || null,

    interest:
      payload.interest ?? 0,

    fine:
      payload.fine ?? 0,
  };

  if (USE_MOCK) {
    await delay(700);

    const boleto =
      createMockBoleto(
        requestPayload,
      );

    MOCK_BOLETOS.unshift(boleto);

    return boleto;
  }

  const response = await api.post(
    "/partner/v1/boletos",
    requestPayload,
    {
      headers: {
        ...getHeaders(),

        "Idempotency-Key":
          externalId,
      },
    },
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| GET /partner/v1/boletos/{id}/payments
|--------------------------------------------------------------------------
*/

export async function listarPagamentosBoleto(
  id,
) {
  if (USE_MOCK) {
    await delay();

    const boleto = MOCK_BOLETOS.find(
      (item) => item.id === id,
    );

    if (!boleto) {
      return [];
    }

    if (boleto.status !== "paid") {
      return [];
    }

    return [
      {
        id: `payment-${id}`,

        account_id:
          boleto.account_id,

        agency_id:
          boleto.agency_id,

        amount:
          boleto.paid_amount,

        boleto_id:
          boleto.id,

        confirmed_at:
          boleto.paid_at,

        created_at:
          boleto.paid_at,

        currency:
          boleto.currency,

        external_id:
          `PAY-${boleto.external_id}`,

        paid_at:
          boleto.paid_at,

        provider:
          boleto.provider,

        provider_reference:
          boleto.provider_reference,

        status: "confirmed",

        updated_at:
          boleto.paid_at,

        metadata: {},
      },
    ];
  }

  const response = await api.get(
    `/partner/v1/boletos/${id}/payments`,
    {
      headers: getHeaders(),
    },
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| GET /partner/v1/boletos/{id}/fees
|--------------------------------------------------------------------------
*/

export async function listarTarifasBoleto(
  id,
) {
  if (USE_MOCK) {
    await delay();

    const boleto = MOCK_BOLETOS.find(
      (item) => item.id === id,
    );

    if (!boleto) {
      return [];
    }

    const baseAmount =
      Number(boleto.amount);

    return [
      {
        id: `fee-${id}`,

        account_id:
          boleto.account_id,

        base_amount:
          baseAmount.toFixed(2),

        boleto_id:
          boleto.id,

        charged_at:
          boleto.registered_at,

        cost_amount: "2.50",

        created_at:
          boleto.registered_at,

        currency: "BRL",

        external_id:
          `FEE-${boleto.external_id}`,

        fee_amount: "2.50",

        fee_code:
          "BOLETO_REGISTRATION",

        guarantee_operation_id:
          null,

        profit_amount: "1.00",

        resolution_level:
          "account",

        status: "charged",

        trigger_event:
          "boleto_created",
      },
    ];
  }

  const response = await api.get(
    `/partner/v1/boletos/${id}/fees`,
    {
      headers: getHeaders(),
    },
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
*/

export async function getDashboard() {
  if (USE_MOCK) {
    await delay();

    const resumo = {
      total:
        Number(
          MOCK_OVERVIEW.total_boletos,
        ) || 0,

      emAberto:
        Number(
          MOCK_OVERVIEW.open_boletos,
        ) || 0,

      pagos:
        Number(
          MOCK_OVERVIEW.paid_boletos,
        ) || 0,

      vencidos:
        Number(
          MOCK_OVERVIEW.overdue_boletos,
        ) || 0,

      valorEmAberto:
        Number(
          MOCK_OVERVIEW.open_amount,
        ) || 0,

      valorRecebido:
        Number(
          MOCK_OVERVIEW.paid_amount,
        ) || 0,

      valorVencido:
        MOCK_BOLETOS.filter(
          (boleto) =>
            boleto.status ===
            "overdue",
        ).reduce(
          (total, boleto) =>
            total +
            (Number(boleto.amount) || 0),
          0,
        ),
    };

    const ultimosBoletos =
      [...MOCK_BOLETOS]
        .sort(
          (a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at),
        )
        .slice(0, 5)
        .map((boleto) => ({
          id: boleto.id,

          cliente:
            boleto.metadata?.cliente ||
            "Cliente não informado",

          contrato:
            boleto.metadata?.contrato ||
            "—",

          valor:
            Number(boleto.amount) || 0,

          vencimento:
            boleto.due_date || "—",

          status:
            boleto.status,
        }));

    return {
      resumo,
      ultimosBoletos,
    };
  }

  const [
    overviewResponse,
    boletosResponse,
  ] = await Promise.all([
    api.get(
      "/partner/v1/boletos/overview",
      {
        headers: getHeaders(),
      },
    ),

    api.get(
      "/partner/v1/boletos",
      {
        headers: getHeaders(),
      },
    ),
  ]);

  const overview =
    overviewResponse.data;

  const boletos =
    Array.isArray(
      boletosResponse.data,
    )
      ? boletosResponse.data
      : boletosResponse.data?.data ||
        [];

  const resumo = {
    total:
      Number(
        overview.total_boletos,
      ) || 0,

    emAberto:
      Number(
        overview.open_boletos,
      ) || 0,

    pagos:
      Number(
        overview.paid_boletos,
      ) || 0,

    vencidos:
      Number(
        overview.overdue_boletos,
      ) || 0,

    valorEmAberto:
      Number(
        overview.open_amount,
      ) || 0,

    valorRecebido:
      Number(
        overview.paid_amount,
      ) || 0,

    valorVencido: 0,
  };

  const ultimosBoletos =
    [...boletos]
      .sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at),
      )
      .slice(0, 5)
      .map((boleto) => ({
        id: boleto.id,

        cliente:
          boleto.metadata?.cliente ||
          "Cliente não informado",

        contrato:
          boleto.metadata?.contrato ||
          "—",

        valor:
          Number(boleto.amount) || 0,

        vencimento:
          boleto.due_date || "—",

        status:
          boleto.status,
      }));

  return {
    resumo,
    ultimosBoletos,
  };
}

/*
|--------------------------------------------------------------------------
| EXPORT DEFAULT
|--------------------------------------------------------------------------
*/

export default {
  getClientes,
  getContratos,

  listarBoletos,
  obterOverviewBoletos,
  obterBoleto,

  obterBoletoPorExternalId,
  obterBoletoPorNossoNumero,

  criarBoleto,
  criarCliente,

  listarPagamentosBoleto,
  listarTarifasBoleto,

  getDashboard,
};