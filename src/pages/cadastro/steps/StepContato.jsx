import React, { useState } from "react";

export default function StepContato({
  data,
  errors,
  onChange,
}) {
  const [emailToken, setEmailToken] =
    useState(false);

  const [smsToken, setSmsToken] =
    useState(false);

  function formatPhone(value) {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2")
      .slice(0, 15);
  }

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  }

  function enviarTokenEmail() {
    if (!validarEmail(data.email)) {
      alert("Informe um e-mail válido.");
      return;
    }

    alert(
      "Token enviado para o e-mail (simulação)."
    );

    setEmailToken(true);
  }

  function enviarTokenSMS() {
    if (
      data.telefone.replace(/\D/g, "").length <
      11
    ) {
      alert("Telefone inválido.");
      return;
    }

    alert(
      "Token enviado por SMS (simulação)."
    );

    setSmsToken(true);
  }

  return (
    <div className="cadastro-step">

      <h2>Contato</h2>

      <p className="step-description">
        Informe seus meios de contato.
      </p>

      <div className="cadastro-grid">

        {/* EMAIL */}

        <div className="input-group full">
          <label>E-mail *</label>

          <input
            type="email"
            placeholder="email@empresa.com"
            value={data.email}
            onChange={(e) =>
              onChange(
                "email",
                e.target.value
              )
            }
          />

          {errors.email && (
            <small>{errors.email}</small>
          )}
        </div>

        <div className="input-group full">
          <label>Confirmar E-mail *</label>

          <div className="token-row">

            <input
              type="email"
              placeholder="Repita o e-mail"
              value={data.confirmarEmail}
              onChange={(e) =>
                onChange(
                  "confirmarEmail",
                  e.target.value
                )
              }
            />

            <button
              type="button"
              onClick={enviarTokenEmail}
            >
              Enviar código
            </button>

          </div>

          {errors.confirmarEmail && (
            <small>
              {errors.confirmarEmail}
            </small>
          )}
        </div>

        {emailToken && (
          <div className="input-group full">

            <label>
              Código recebido por e-mail
            </label>

            <input
              maxLength={6}
              placeholder="000000"
              value={data.codigoEmail}
              onChange={(e) =>
                onChange(
                  "codigoEmail",
                  e.target.value
                )
              }
            />

          </div>
        )}

        {/* TELEFONE */}

        <div className="input-group full">
          <label>Celular *</label>

          <input
            placeholder="(11) 99999-9999"
            value={data.telefone}
            onChange={(e) =>
              onChange(
                "telefone",
                formatPhone(
                  e.target.value
                )
              )
            }
          />

          {errors.telefone && (
            <small>{errors.telefone}</small>
          )}
        </div>

        <div className="input-group full">
          <label>
            Confirmar Celular *
          </label>

          <div className="token-row">

            <input
              placeholder="Repita o telefone"
              value={
                data.confirmarTelefone
              }
              onChange={(e) =>
                onChange(
                  "confirmarTelefone",
                  formatPhone(
                    e.target.value
                  )
                )
              }
            />

            <button
              type="button"
              onClick={enviarTokenSMS}
            >
              Enviar SMS
            </button>

          </div>

          {errors.confirmarTelefone && (
            <small>
              {errors.confirmarTelefone}
            </small>
          )}
        </div>

        {smsToken && (
          <div className="input-group full">

            <label>
              Código recebido por SMS
            </label>

            <input
              maxLength={6}
              placeholder="000000"
              value={data.codigoSMS}
              onChange={(e) =>
                onChange(
                  "codigoSMS",
                  e.target.value
                )
              }
            />

          </div>
        )}

      </div>

    </div>
  );
}