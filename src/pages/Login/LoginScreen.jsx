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

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showMfaModal, setShowMfaModal] =
    useState(false);

  const [mfaMode, setMfaMode] =
    useState("validate");

  /*
   * Guarda os dados temporários do login.
   *
   * No primeiro acesso também guardamos a resposta
   * que contém o access_token.
   */

  const [loginData, setLoginData] =
    useState(null);

  /*
   * =========================================================
   * FINALIZAR LOGIN
   * =========================================================
   */

  async function finishLogin(response) {
    if (!response?.access_token) {
      throw new Error(
        "Access token não encontrado."
      );
    }

    console.log(
      "Finalizando autenticação..."
    );

    /*
     * SOMENTE AQUI o usuário entra no AuthContext.
     */

    await login({
      ...response.user,

      accessToken:
        response.access_token,

      refreshToken:
        response.refresh_token,

      sessionId:
        response.session_id,
    });

    /*
     * Limpa estado temporário.
     */

    setShowMfaModal(false);

    setLoginData(null);

    setError("");

    /*
     * Agora sim pode ir para home.
     */

    navigate("/home", {
      replace: true,
    });
  }

  /*
   * =========================================================
   * LOGIN
   * =========================================================
   */

  async function handleLogin(mfaOtp = null) {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      /*
       * Se estamos no MFA, usamos os dados salvos.
       */

      const email =
        loginData?.email ??
        document.trim();

      const senha =
        loginData?.password ??
        password;

      if (!email || !senha) {
        setError(
          "Informe seu e-mail e sua senha."
        );

        return;
      }

      console.log(
        "Tentando login:",
        {
          email,
          mfaOtp,
        }
      );

      /*
       * =====================================================
       * LOGIN API
       * =====================================================
       */

      const response =
        await loginPartner({
          email,
          password: senha,
          mfaOtp,
        });

      console.log(
        "Resposta login:",
        response
      );

      /*
       * =====================================================
       * MFA REQUIRED
       * =====================================================
       *
       * Usuário já possui MFA.
       */

      const mfaRequired =
        response?.error?.code ===
          "mfa_required";

      if (
        mfaRequired &&
        !mfaOtp
      ) {
        console.log(
          "Usuário possui MFA. Solicitando código."
        );

        setLoginData({
          email,
          password: senha,
        });

        setMfaMode("validate");

        setShowMfaModal(true);

        return;
      }

      /*
       * =====================================================
       * TOKEN
       * =====================================================
       */

      if (!response?.access_token) {
        throw new Error(
          "A API não retornou um access_token."
        );
      }

      /*
       * =====================================================
       * SALVAR TOKEN TEMPORÁRIO
       * =====================================================
       *
       * Precisamos dele para:
       *
       * setupPartnerMfa()
       * confirmPartnerMfa()
       * getPartnerMfaStatus()
       */

      localStorage.setItem(
        "access_token",
        response.access_token
      );

      if (response.refresh_token) {
        localStorage.setItem(
          "refresh_token",
          response.refresh_token
        );
      }

      localStorage.setItem(
        "user",
        JSON.stringify(response)
      );

      /*
       * =====================================================
       * PRIMEIRO ACESSO
       * =====================================================
       *
       * A API retornou token e:
       *
       * user.mfa_enabled === false
       */

      if (
        response?.user?.mfa_enabled === false
      ) {
        console.log(
          "Primeiro acesso: MFA não configurado."
        );

        /*
         * Guardamos a resposta.
         *
         * Ainda NÃO chamamos login().
         */

        setLoginData({
          email,
          password: senha,
          response,
        });

        setMfaMode("setup");

        setShowMfaModal(true);

        return;
      }

      /*
       * =====================================================
       * LOGIN NORMAL
       * =====================================================
       *
       * Se chegou aqui:
       *
       * - MFA não é necessário
       *
       * OU
       *
       * - o login já foi enviado com mfaOtp
       */

      await finishLogin(response);

    } catch (err) {
      console.error(
        "Erro login:",
        err
      );

      console.error(
        "Resposta API:",
        err.response?.data
      );

      const apiError =
        err.response?.data?.error;

      /*
       * =====================================================
       * MFA REQUIRED PELO CATCH
       * =====================================================
       */

      if (
        apiError?.code ===
          "mfa_required" &&
        !mfaOtp
      ) {
        const email =
          loginData?.email ??
          document.trim();

        const senha =
          loginData?.password ??
          password;

        setLoginData({
          email,
          password: senha,
        });

        setMfaMode("validate");

        setShowMfaModal(true);

        return;
      }

      /*
       * =====================================================
       * ERRO NORMAL
       * =====================================================
       */

      setError(
        apiError?.message ||
          err.response?.data?.message ||
          err.message ||
          "Erro ao realizar login."
      );

    } finally {
      setLoading(false);
    }
  }

  /*
   * =========================================================
   * MFA - PRIMEIRO ACESSO
   * =========================================================
   */

  async function handleMfaSetupSuccess(result) {
    console.log(
      "MFA configurado:",
      result
    );

    /*
     * Recupera a resposta original do login.
     */

    const response =
      loginData?.response;

    if (!response?.access_token) {
      setError(
        "A sessão temporária não foi encontrada. Faça o login novamente."
      );

      setShowMfaModal(false);

      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "refresh_token"
      );

      return;
    }

    /*
     * Agora o MFA foi:
     *
     * 1. configurado
     * 2. confirmado
     * 3. consultado no endpoint de status
     * 4. confirmado como ativo
     *
     * Portanto podemos finalizar o login.
     */

    try {
      await finishLogin(response);
    } catch (err) {
      console.error(
        "Erro ao finalizar login após MFA:",
        err
      );

      setError(
        err.message ||
          "Não foi possível finalizar o login."
      );
    }
  }

  /*
   * =========================================================
   * MFA - LOGIN NORMAL
   * =========================================================
   */

  async function handleMfaValidationSuccess(code) {
    console.log(
      "Código MFA recebido."
    );

    /*
     * Faz uma nova chamada ao login:
     *
     * email
     * password
     * mfaOtp
     */

    await handleLogin(code);
  }

  return (
    <>
      <div className="login">

        {/* =====================================================
            ESQUERDA
        ====================================================== */}

        <section className="login-left">

          <img
            src={logoWhite}
            className="login-left-logo"
            alt=""
          />

          <div className="login-left-content">

            <h1>
              O banco digital com foco total para
              serviços e profissionais da saúde.
            </h1>

            <p>
              Conta, Pix, cartões, antecipação de
              honorários, Wallet USDT e gestão
              financeira.
            </p>

          </div>

          <div className="login-left-footer">

            <div>
              <strong>
                R$ 4,2 bi
              </strong>

              <span>
                transacionados
              </span>
            </div>

            <div>
              <strong>
                +12 mil
              </strong>

              <span>
                profissionais
              </span>
            </div>

            <div>
              <strong>
                LGPD
              </strong>

              <span>
                criptografia avançada
              </span>
            </div>

          </div>

        </section>

        {/* =====================================================
            DIREITA
        ====================================================== */}

        <section className="login-right">

          <div className="login-box">

            <img
              src={logo}
              className="login-logo"
              alt=""
            />

            <h2>
              Acesse sua conta
            </h2>

            <p>
              Internet Banking Oportuniza Pay
            </p>

            {/* =================================================
                E-MAIL
            ================================================== */}

            <div className="form-group">

              <label>
                E-Mail
              </label>

              <input
                type="email"
                value={document}
                onChange={(e) =>
                  setDocument(
                    e.target.value
                  )
                }
                placeholder="exemplo@exemplo.com.br"
                autoComplete="username"
                disabled={
                  loading ||
                  showMfaModal
                }
              />

            </div>

            {/* =================================================
                SENHA
            ================================================== */}

            <div className="form-group password-group">

              <label>
                Senha
              </label>

              <div className="password-input-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="********"
                  autoComplete="current-password"
                  disabled={
                    loading ||
                    showMfaModal
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      handleLogin();
                    }
                  }}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (old) => !old
                    )
                  }
                  disabled={loading}
                >
                  {showPassword
                    ? "Ocultar"
                    : "Visualizar"}
                </button>

              </div>

            </div>

            {/* =================================================
                ERRO
            ================================================== */}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* =================================================
                LOGIN
            ================================================== */}

            <button
              className="login-button"
              disabled={
                loading ||
                showMfaModal
              }
              onClick={() =>
                handleLogin()
              }
            >
              {loading
                ? "Entrando..."
                : "Entrar →"}
            </button>

            {/* =================================================
                CADASTRO
            ================================================== */}

            <button
              type="button"
              className="open-account-button"
              disabled={
                loading ||
                showMfaModal
              }
              onClick={() =>
                navigate("/cadastro")
              }
            >
              Abrir minha conta
            </button>

          </div>

        </section>

      </div>

      {/* =======================================================
          MFA
      ======================================================== */}

      <MfaModal
        open={showMfaModal}
        mode={mfaMode}
        onSuccess={
          mfaMode === "setup"
            ? handleMfaSetupSuccess
            : handleMfaValidationSuccess
        }
      />
    </>
  );
}