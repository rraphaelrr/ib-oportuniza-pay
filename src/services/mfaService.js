import api from "./api";

const TOKEN =
  "5b7a8e4ffbeae77b80085436d2bde1d60b93f3dd7f876a84e0a59eeff5fe8a87dab367cd047af7ef7aaef2b15f31d185";

const config = {
  headers: {
    "X-Partner-Internal-Token": TOKEN,
    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
  },
};

export async function setupPartnerMfa() {
  const { data } = await api.post("/auth/v1/partner/mfa/setup", {}, config);

  return data;
}

export async function confirmPartnerMfa(code) {
  const { data } = await api.post(
    "/auth/v1/partner/mfa/confirm",
    {
      code,
    },
    config,
  );

  return data;
}

export async function validatePartnerMfa(code) {
  const { data } = await api.post(
    "/auth/v1/partner/mfa/confirm",
    {
      code,
    },
    config,
  );

  return data;
}

export async function disablePartnerMfa(code) {
  const { data } = await api.post(
    "/auth/v1/partner/mfa/disable",
    {
      code,
    },
    config,
  );

  return data;
}

export async function getPartnerMfaStatus() {
  const { data } = await api.get("/auth/v1/partner/mfa/status", config);

  return data;
}

export async function regenerateRecoveryCodes() {
  const { data } = await api.post(
    "/auth/v1/partner/mfa/recovery-codes/regenerate",
    {},
    config,
  );

  return data;
}
