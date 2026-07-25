import api from "./api";
import { v4 as uuidv4 } from "uuid";

const AGENCY_ID = "8f2e7b8e-2f64-4fd1-b5d7-7b2a2fd3e111";

function onlyNumbers(value = "") {
  return value.replace(/\D/g, "");
}

export async function createAccount(form) {
  const isPJ = form.tipoConta?.toUpperCase() === "PJ";

  const payload = {
    account_type: form.tipoConta,
    agency_id: AGENCY_ID,
    country_code: "BR",
    default_currency: "BRL",

    document_number: isPJ
      ? onlyNumbers(form.cnpj)
      : onlyNumbers(form.cpf),

    document_type: isPJ ? "CNPJ" : "CPF",

    email: form.email,

    external_id: uuidv4(),

    name: isPJ ? form.razaoSocial : form.nome,

    person_type: isPJ ? "company" : "individual",

    phone: `+55${onlyNumbers(form.telefone)}`,

    tax_id: isPJ
      ? onlyNumbers(form.cnpj)
      : onlyNumbers(form.cpf),

    trade_name: isPJ ? form.nomeFantasia : form.nome,
  };

  console.log("Payload enviado:", payload);

  const response = await api.post(
    "/partner/v1/accounts",
    payload,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("partner_token")}`,
        "X-Request-ID": uuidv4(),
        "X-Idempotency-Key": uuidv4(),
      },
    }
  );

  return response.data;
}