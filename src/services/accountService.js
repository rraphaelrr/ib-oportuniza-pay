import api from "./api";
import { v4 as uuidv4 } from "uuid";

const TOKEN =
  "5b7a8e4ffbeae77b80085436d2bde1d60b93f3dd7f876a84e0a59eeff5fe8a87dab367cd047af7ef7aaef2b15f31d185";

function onlyNumbers(value = "") {
  return String(value).replace(/\D/g, "");
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };

    reader.onerror = reject;
  });
}

export async function createAccount(form) {
  const isPJ = form.tipoConta?.toUpperCase() === "PJ";

  const payload = {
    account_type: "payment",

    agency_id: form.agencyId,

    country_code: "BR",

    default_currency: "BRL",

    external_id: uuidv4(),
    
    credentials: {
      email: form.email,
      password: form.numericPassword,
    },
    person_type: isPJ ? "company" : "individual",

    profile: {
      first_name: isPJ ? "" : form.nome.trim().split(" ")[0],

      last_name: isPJ ? "" : form.nome.trim().split(" ").slice(1).join(" "),

      company_name: isPJ ? form.razaoSocial : "",

      trade_name: isPJ ? form.nomeFantasia : "",

      birth_date: isPJ ? null : form.dataNascimento,

      incorporation_date: isPJ ? form.fundacao : null,

      email: form.email,

      phone: `+55${onlyNumbers(form.telefone)}`,
    },

    documents: [
      {
        country_code: "BR",

        document_number: isPJ ? onlyNumbers(form.cnpj) : onlyNumbers(form.cpf),

        document_type: isPJ ? "cnpj" : "cpf",

        is_primary: true,
      },
    ],

    contacts: [
      {
        contact_type: "email",

        contact_value: form.email,

        is_primary: true,
      },
      {
        contact_type: "phone",

        contact_value: `+55${onlyNumbers(form.telefone)}`,

        is_primary: false,
      },
    ],

    addresses: [
      {
        address_type: "main",

        postal_code: onlyNumbers(form.cep),

        street: form.rua,

        number: String(form.numero),

        complement: form.complemento || "",

        district: form.bairro,

        city: form.cidade,

        state: form.estado,

        country_code: "BR",
      },
    ],

    attachments: [],

    metadata: {},
  };

  const response = await api.post("/partner/v1/accounts", payload, {
    headers: {
      "X-Partner-Internal-Token": TOKEN,
      "Idempotency-Key": uuidv4(),
    },
  });

  return response.data;
}

export async function uploadAccountAttachment(
  accountId,
 attachments,
) {
  const files = Array.isArray(attachments)
    ? attachments
    : [attachments];

  const payload = await Promise.all(
    files.map(async (item) => ({
      attachment_type: item.attachmentType,
      file_name: item.file.name,
      mime_type: item.file.type,
      description: item.description,
      data_base64: await fileToBase64(item.file),
    }))
  );

  return api.post(
    `/partner/v1/accounts/${accountId}/attachments/upload`,
    payload.length === 1 ? payload[0] : payload,
    {
      headers: {
        "X-Partner-Internal-Token": TOKEN,
        "Idempotency-Key": uuidv4(),
      },
    }
  );
}
