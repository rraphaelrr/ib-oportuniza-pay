import React from "react";

import Input from "../../../components/Input";

import "./CadastroSteps.css";

function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  switch (score) {
    case 0:
    case 1:
      return {
        score,
        label: "Muito fraca",
        color: "#dc2626",
      };

    case 2:
      return {
        score,
        label: "Fraca",
        color: "#ea580c",
      };

    case 3:
      return {
        score,
        label: "Média",
        color: "#ca8a04",
      };

    case 4:
      return {
        score,
        label: "Forte",
        color: "#16a34a",
      };

    case 5:
      return {
        score,
        label: "Muito forte",
        color: "#15803d",
      };

    default:
      return {
        score: 0,
        label: "",
        color: "#ddd",
      };
  }
}

export default function StepSenha({
  values = {},
  updateField,
  errors = {},
  next,
  back,
}) {
  const password = values.numericPassword || "";
  const confirmPassword = values.confirmNumericPassword || "";

  const strength = getPasswordStrength(password);

  const isStrong = strength.score >= 4;

  const handleNext = () => {
    if (
      isStrong &&
      password === confirmPassword
    ) {
      next();
    }
  };

  return (
    <div className="cadastro-step">

      <h2>Senha de Acesso</h2>

      <p className="step-description">
        Crie uma senha segura para acessar sua conta.
      </p>

      <Input
        label="Senha"
        type="password"
        autoComplete="new-password"
        maxLength={30}
        value={password}
        onChange={(e) =>
          updateField("numericPassword", e.target.value)
        }
        error={errors.numericPassword}
      />

      <div className="password-strength">

        <div className="password-strength-bar">
          <div
            className="password-strength-fill"
            style={{
              width: `${strength.score * 20}%`,
              background: strength.color,
            }}
          />
        </div>

        <span
          className="password-strength-label"
          style={{ color: strength.color }}
        >
          {strength.label}
        </span>

      </div>

      <ul className="password-rules">
        <li className={password.length >= 8 ? "ok" : ""}>
          Mínimo de 8 caracteres
        </li>

        <li className={/[A-Z]/.test(password) ? "ok" : ""}>
          Uma letra maiúscula
        </li>

        <li className={/[a-z]/.test(password) ? "ok" : ""}>
          Uma letra minúscula
        </li>

        <li className={/\d/.test(password) ? "ok" : ""}>
          Um número
        </li>

        <li className={/[^A-Za-z0-9]/.test(password) ? "ok" : ""}>
          Um caractere especial
        </li>
      </ul>

      <Input
        label="Confirmar Senha"
        type="password"
        autoComplete="new-password"
        maxLength={30}
        value={confirmPassword}
        onChange={(e) =>
          updateField(
            "confirmNumericPassword",
            e.target.value
          )
        }
        error={errors.confirmNumericPassword}
      />

      {confirmPassword &&
        password !== confirmPassword && (
          <span className="field-error">
            As senhas não conferem.
          </span>
      )}

      <div className="step-buttons">
        <button
          type="button"
          className="btn-secondary"
          onClick={back}
        >
          Voltar
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={handleNext}
          disabled={
            !isStrong ||
            password !== confirmPassword
          }
        >
          Continuar
        </button>
      </div>

    </div>
  );
}