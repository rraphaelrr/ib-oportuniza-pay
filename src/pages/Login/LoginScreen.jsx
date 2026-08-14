import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginPartner } from "../../services/authService";

import MfaModal from "../../components/MfaModal/MfaModal";

import "./LoginScreen.css";

import logo from "../../assets/privateAssets/logo.png";
import logoWhite from "../../assets/privateAssets/logoWhite.png";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showMfaModal, setShowMfaModal] = useState(false);

  const [loginData, setLoginData] = useState(null);

  async function handleLogin(mfaOtp = null) {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // Primeira chamada usa os campos da tela.
      // Segunda chamada (após MFA) usa os dados salvos.
      const email = loginData?.email ?? document;
      const senha = loginData?.password ?? password;

      console.log("Enviando login:", {
        email,
        password: senha,
        mfaOtp,
      });

      const response = await loginPartner({
        email,
        password: senha,
        mfaOtp,
      });

      console.log("Resposta:", response);

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
      localStorage.setItem("user", JSON.stringify(response));

      login({
        ...response.user,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        sessionId: response.session_id,
      });

      setShowMfaModal(false);

      navigate("/home");
    } catch (err) {
      console.error("Erro login:", err);
      console.error("Resposta API:", err.response?.data);

      const apiError = err.response?.data?.error;

      if (apiError?.code === "mfa_required" && !mfaOtp) {
        setLoginData({
          email: document,
          password,
        });

        setShowMfaModal(true);
        return;
      }

      setError(apiError?.message || "Erro ao realizar login.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className="login">
        <section className="login-left">
          <img src={logoWhite} className="login-left-logo" alt="" />

          <div className="login-left-content">
            <h1>
              O banco digital com foco total para serviços e profissionais da
              saúde.
            </h1>

            <p>
              Conta, Pix, cartões, antecipação de honorários, Wallet USDT e
              gestão financeira.
            </p>
          </div>

          <div className="login-left-footer">
            <div>
              <strong>R$ 4,2 bi</strong>

              <span>transacionados</span>
            </div>

            <div>
              <strong>+12 mil</strong>

              <span>profissionais</span>
            </div>

            <div>
              <strong>LGPD</strong>

              <span>criptografia avançada</span>
            </div>
          </div>
        </section>

        <section className="login-right">
          <div className="login-box">
            <img src={logo} className="login-logo" alt="" />

            <h2>Acesse sua conta</h2>

            <p>Internet Banking Oportuniza Pay</p>

            <div className="form-group">
              <label>E-Mail</label>

              <input
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                placeholder="exemplo@exemplo.com.br"
              />
            </div>

            <div className="form-group password-group">
              <label>Senha</label>

              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((old) => !old)}
                  aria-label={
                    showPassword ? "Ocultar senha" : "Visualizar senha"
                  }
                >
                  {showPassword ? "Ocultar" : "Visualizar"}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              className="login-button"
              disabled={loading}
              onClick={() => handleLogin()}
            >
              {loading ? "Entrando..." : "Entrar →"}
            </button>
            <button
              type="button"
              className="open-account-button"
              onClick={() => navigate("/cadastro")}
            >
              Abrir minha conta
            </button>
          </div>
        </section>
      </div>

      <MfaModal
        open={showMfaModal}
        mode="validate"
        onSuccess={(code) => handleLogin(code)}
      />
    </>
  );
}
