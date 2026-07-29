import React, { useEffect, useState } from "react";

import "./MfaModal.css";

import {
  setupPartnerMfa,
  confirmPartnerMfa,
  validatePartnerMfa,
} from "../../services/mfaService";

export default function MfaModal({ open, mode, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState("");

  const [error, setError] = useState("");

  const [secret, setSecret] = useState("");

  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    if (!open) return;

    if (mode !== "setup") return;

    loadSetup();
  }, [open]);

  async function loadSetup() {
    try {
      setLoading(true);

      const response = await setupPartnerMfa();

      setSecret(response.secret);

      setQrCode(
        response.qr_code_base64 ||
          response.qr_code_base64 ||
          response.qr_code_base64 ||
          "",
      );
    } catch (e) {
      setError("Não foi possível iniciar o MFA.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (code.length !== 6) return;

    try {
      setLoading(true);
      setError("");

      if (mode === "setup") {
        await confirmPartnerMfa(code);
      }

      // apenas devolve o código
      onSuccess?.(code);
    } catch (e) {
      setError(e.response?.data?.message || "Código inválido.");
    } finally {
      setLoading(false);
    }
  }
  if (!open) return null;

  return (
    <div className="mfa-overlay">
      <div className="mfa-modal">
        <h2>
          {mode === "setup"
            ? "Ativar autenticação em duas etapas"
            : "Confirmar autenticação"}
        </h2>

        {mode === "setup" && (
          <>
            <p>Escaneie o QR Code abaixo utilizando o Google Authenticator.</p>

            {qrCode && (
              <img src={qrCode} alt="QR Code" className="mfa-qrcode" />
            )}

            {/* {secret && (
              <div className="mfa-secret">
                <span>Secret</span>

                <strong>{secret}</strong>
              </div>
            )} */}
          </>
        )}

        {mode === "validate" && (
          <p>Abra o Google Authenticator e informe o código de 6 dígitos.</p>
        )}

        <input
          type="text"
          maxLength={6}
          value={code}
          placeholder="000000"
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />

        {error && <div className="mfa-error">{error}</div>}

        <button onClick={handleSubmit} disabled={loading || code.length < 6}>
          {loading
            ? "Validando..."
            : mode === "setup"
              ? "Ativar MFA"
              : "Validar"}
        </button>
      </div>
    </div>
  );
}
