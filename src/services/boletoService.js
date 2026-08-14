import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import api from "./api"
/*
|--------------------------------------------------------------------------
| CONFIGURAÇÃO
|--------------------------------------------------------------------------
*/



const USE_MOCK = true;


/*
|--------------------------------------------------------------------------
| AXIOS
|--------------------------------------------------------------------------
*/




/*
|--------------------------------------------------------------------------
| HEADERS
|--------------------------------------------------------------------------
|
| Todos os endpoints Partner exigem:
|
| Authorization: Bearer <access_token>
| X-Partner-Internal-Token: <TOKEN>
|
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
| MOCK DATA
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

function delay(ms = 400) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


function createMockBoleto(data = {}) {
  const id = uuidv4();

  return {
    id,

    account_id: "acc-001",
    agency_id: "ag-001",

    amount: data.amount || "100.00",
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
      new Date(Date.now() + 15 * 86400000)
        .toISOString()
        .substring(0, 10),

    external_id: data.external_id || `BOLETO-${Date.now()}`,

    installment_id: data.installment_id || uuidv4(),

    metadata: data.metadata || {},

    nosso_numero:
      data.nosso_numero ||
      String(Math.floor(Math.random() * 999999999)).padStart(9, "0"),

    payer_id: data.payer_id || "payer-001",

    provider: "mock-provider",

    provider_reference: `MOCK-${Date.now()}`,

    receivable_id: data.receivable_id || uuidv4(),

    registered_at: new Date().toISOString(),

    registration_error_code: null,

    registration_error_message: null,

    status: "open",

    created_at: new Date().toISOString(),

    updated_at: new Date().toISOString(),

    cancelled_at: null,

    paid_at: null,
  };
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
    }
  );

  return response.data;
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
    }
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
      (item) => item.id === id
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
    }
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| GET /partner/v1/boletos/external/{external_id}
|--------------------------------------------------------------------------
*/

export async function obterBoletoPorExternalId(externalId) {
  if (USE_MOCK) {
    await delay();

    const boleto = MOCK_BOLETOS.find(
      (item) => item.external_id === externalId
    );

    if (!boleto) {
      throw new Error("Boleto não encontrado.");
    }

    return { ...boleto };
  }

  const response = await api.get(
    `/partner/v1/boletos/external/${encodeURIComponent(
      externalId
    )}`,
    {
      headers: getHeaders(),
    }
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| GET /partner/v1/boletos/nosso-numero/{nosso_numero}
|--------------------------------------------------------------------------
*/

export async function obterBoletoPorNossoNumero(nossoNumero) {
  if (USE_MOCK) {
    await delay();

    const boleto = MOCK_BOLETOS.find(
      (item) => item.nosso_numero === nossoNumero
    );

    if (!boleto) {
      throw new Error("Boleto não encontrado.");
    }

    return { ...boleto };
  }

  const response = await api.get(
    `/partner/v1/boletos/nosso-numero/${encodeURIComponent(
      nossoNumero
    )}`,
    {
      headers: getHeaders(),
    }
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
    payload.external_id || `BOLETO-${Date.now()}`;

  const requestPayload = {
    amount: payload.amount,
    currency: payload.currency || "BRL",
    due_date: payload.due_date,

    external_id: externalId,

    installment_id:
      payload.installment_id || null,

    instructions:
      payload.instructions || "",

    metadata:
      payload.metadata || {},

    payer_id: payload.payer_id,

    protest_days:
      payload.protest_days || 0,

    receivable_id:
      payload.receivable_id || null,
  };

  if (USE_MOCK) {
    await delay(700);

    const boleto = createMockBoleto(
      requestPayload
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

        "Idempotency-Key": externalId,
      },
    }
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| GET /partner/v1/boletos/{id}/payments
|--------------------------------------------------------------------------
*/

export async function listarPagamentosBoleto(id) {
  if (USE_MOCK) {
    await delay();

    const boleto = MOCK_BOLETOS.find(
      (item) => item.id === id
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

        account_id: boleto.account_id,
        agency_id: boleto.agency_id,

        amount: boleto.paid_amount,

        boleto_id: boleto.id,

        confirmed_at: boleto.paid_at,

        created_at: boleto.paid_at,

        currency: boleto.currency,

        external_id: `PAY-${boleto.external_id}`,

        paid_at: boleto.paid_at,

        provider: boleto.provider,

        provider_reference:
          boleto.provider_reference,

        status: "confirmed",

        updated_at: boleto.paid_at,

        metadata: {},
      },
    ];
  }

  const response = await api.get(
    `/partner/v1/boletos/${id}/payments`,
    {
      headers: getHeaders(),
    }
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| GET /partner/v1/boletos/{id}/fees
|--------------------------------------------------------------------------
*/

export async function listarTarifasBoleto(id) {
  if (USE_MOCK) {
    await delay();

    const boleto = MOCK_BOLETOS.find(
      (item) => item.id === id
    );

    if (!boleto) {
      return [];
    }

    const baseAmount = Number(boleto.amount);

    return [
      {
        id: `fee-${id}`,

        account_id: boleto.account_id,

        base_amount:
          baseAmount.toFixed(2),

        boleto_id: boleto.id,

        charged_at:
          boleto.registered_at,

        cost_amount: "2.50",

        created_at:
          boleto.registered_at,

        currency: "BRL",

        external_id:
          `FEE-${boleto.external_id}`,

        fee_amount: "2.50",

        fee_code: "BOLETO_REGISTRATION",

        guarantee_operation_id: null,

        profit_amount: "1.00",

        resolution_level: "account",

        status: "charged",

        trigger_event: "boleto_created",
      },
    ];
  }

  const response = await api.get(
    `/partner/v1/boletos/${id}/fees`,
    {
      headers: getHeaders(),
    }
  );

  return response.data;
}


/*
|--------------------------------------------------------------------------
| EXPORT DEFAULT
|--------------------------------------------------------------------------
*/

export default {
  listarBoletos,
  obterOverviewBoletos,
  obterBoleto,
  obterBoletoPorExternalId,
  obterBoletoPorNossoNumero,
  criarBoleto,
  listarPagamentosBoleto,
  listarTarifasBoleto,
};