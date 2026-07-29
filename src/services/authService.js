// src/services/authService.js

import { v4 as uuidv4 } from "uuid";
import api from "./api";

const TOKEN =
  "5b7a8e4ffbeae77b80085436d2bde1d60b93f3dd7f876a84e0a59eeff5fe8a87dab367cd047af7ef7aaef2b15f31d185";

export async function loginPartner({ email, password, mfaOtp }) {
  const body = {
    email,
    password,
  };

  if (mfaOtp) {
    body.mfa_otp = mfaOtp;
  }

  const { data } = await api.post("/auth/v1/partner/login", body);

  return data;
}
