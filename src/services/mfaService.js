import api from "./api";

const TOKEN =
  "5b7a8e4ffbeae77b80085436d2bde1d60b93f3dd7f876a84e0a59eeff5fe8a87dab367cd047af7ef7aaef2b15f31d185";

/*
 * =========================================================
 * CONFIGURAÇÃO DE AUTENTICAÇÃO
 * =========================================================
 */

function getAuthConfig() {
  const accessToken =
    localStorage.getItem("access_token");

  if (!accessToken) {
    throw new Error(
      "Access token não encontrado."
    );
  }

  return {
    headers: {
      "X-Partner-Internal-Token": TOKEN,
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

/*
 * =========================================================
 * SETUP MFA
 * =========================================================
 *
 * POST /auth/v1/partner/mfa/setup
 *
 * Gera a configuração inicial:
 * - secret
 * - QR Code
 */

export async function setupPartnerMfa() {
  const config = getAuthConfig();

  console.log(
    "Iniciando setup MFA..."
  );

  const { data } = await api.post(
    "/auth/v1/partner/mfa/setup",
    {},
    config
  );

  console.log(
    "Resposta setup MFA:",
    data
  );

  return data;
}

/*
 * =========================================================
 * CONFIRMAR MFA
 * =========================================================
 *
 * POST /auth/v1/partner/mfa/confirm
 *
 * Usado no primeiro acesso, depois que o usuário
 * configura o autenticador.
 */

export async function confirmPartnerMfa(code) {
  if (!code) {
    throw new Error(
      "Código MFA não informado."
    );
  }

  const normalizedCode =
    String(code)
      .replace(/\D/g, "")
      .slice(0, 6);

  if (normalizedCode.length !== 6) {
    throw new Error(
      "O código MFA deve possuir 6 dígitos."
    );
  }

  const config = getAuthConfig();

  console.log(
    "Confirmando MFA..."
  );

  const { data } = await api.post(
    "/auth/v1/partner/mfa/confirm",
    {
      code: normalizedCode,
    },
    config
  );

  console.log(
    "Resposta confirmação MFA:",
    data
  );

  return data;
}

/*
 * =========================================================
 * STATUS MFA
 * =========================================================
 *
 * GET /auth/v1/mfa/status
 *
 * IMPORTANTE:
 *
 * Este é o endpoint correto informado pela documentação
 * da API.
 *
 * Não utilizar:
 *
 * /auth/v1/partner/mfa/status
 */

export async function getPartnerMfaStatus() {
  const config = getAuthConfig();

  console.log(
    "Consultando status MFA..."
  );

  const { data } = await api.get(
    "/auth/v1/mfa/status",
    config
  );

  console.log(
    "Resposta status MFA:",
    data
  );

  return data;
}

/*
 * =========================================================
 * VALIDAR MFA
 * =========================================================
 *
 * Caso a API possua endpoint específico para validação.
 *
 * No login normal, entretanto, o código deve continuar
 * sendo enviado através de:
 *
 * loginPartner({
 *   email,
 *   password,
 *   mfaOtp: code
 * })
 */

export async function validatePartnerMfa(code) {
  if (!code) {
    throw new Error(
      "Código MFA não informado."
    );
  }

  const normalizedCode =
    String(code)
      .replace(/\D/g, "")
      .slice(0, 6);

  if (normalizedCode.length !== 6) {
    throw new Error(
      "O código MFA deve possuir 6 dígitos."
    );
  }

  const config = getAuthConfig();

  const { data } = await api.post(
    "/auth/v1/mfa/validate",
    {
      code: normalizedCode,
    },
    config
  );

  return data;
}

/*
 * =========================================================
 * DESABILITAR MFA
 * =========================================================
 */

export async function disablePartnerMfa(code) {
  if (!code) {
    throw new Error(
      "Código MFA não informado."
    );
  }

  const normalizedCode =
    String(code)
      .replace(/\D/g, "")
      .slice(0, 6);

  if (normalizedCode.length !== 6) {
    throw new Error(
      "O código MFA deve possuir 6 dígitos."
    );
  }

  const config = getAuthConfig();

  const { data } = await api.post(
    "/auth/v1/mfa/disable",
    {
      code: normalizedCode,
    },
    config
  );

  return data;
}

/*
 * =========================================================
 * REGENERAR CÓDIGOS DE RECUPERAÇÃO
 * =========================================================
 */

export async function regenerateRecoveryCodes() {
  const config = getAuthConfig();

  const { data } = await api.post(
    "/auth/v1/mfa/recovery-codes/regenerate",
    {},
    config
  );

  return data;
}