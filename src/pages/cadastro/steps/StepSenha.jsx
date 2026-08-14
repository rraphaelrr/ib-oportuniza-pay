import React, { useState } from "react";

import Input from "../../../components/Input";

import "./CadastroSteps.css";

function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 12) score++;
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = values.numericPassword || "";
  const confirmPassword = values.confirmNumericPassword || "";

  const strength = getPasswordStrength(password);

  // MÍNIMO de 12 caracteres
  const hasValidLength = password.length >= 12;

  // Regras da senha
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const isStrong =
    hasValidLength &&
    hasLowercase &&
    hasUppercase &&
    hasNumber &&
    hasSpecial;

  // A confirmação também precisa ter pelo menos 12 caracteres
  const passwordsMatch =
    password === confirmPassword &&
    confirmPassword.length >= 12;

  const handleNext = () => {
    if (isStrong && passwordsMatch) {
      next();
    }
  };

  return (
    <div className="cadastro-step">

      <h2>Senha de Acesso</h2>

      <p className="step-description">
        Crie uma senha segura com no mínimo 12 caracteres.
      </p>

      {/* SENHA */}
      <div className="password-input-wrapper">
        <Input
          label="Senha"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={password}
          onChange={(e) =>
            updateField("numericPassword", e.target.value)
          }
          error={errors.numericPassword}
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={
            showPassword
              ? "Ocultar senha"
              : "Visualizar senha"
          }
        >
          {showPassword ? (
            // Olho riscado
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3l18 18" />
              <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
              <path d="M9.88 4.24A9.77 9.77 0 0 1 12 4c5 0 9 4 10 8a10.6 10.6 0 0 1-2.17 4.19" />
              <path d="M6.61 6.61C4.93 7.73 3.63 9.43 2 12c1 4 5 8 10 8a9.77 9.77 0 0 0 4.24-.88" />
            </svg>
          ) : (
            // Olho
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      {/* FORÇA DA SENHA */}
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

      {/* REGRAS */}
      <ul className="password-rules">

        <li className={hasValidLength ? "ok" : ""}>
          Mínimo de 12 caracteres
        </li>

        <li className={hasUppercase ? "ok" : ""}>
          Uma letra maiúscula
        </li>

        <li className={hasLowercase ? "ok" : ""}>
          Uma letra minúscula
        </li>

        <li className={hasNumber ? "ok" : ""}>
          Um número
        </li>

        <li className={hasSpecial ? "ok" : ""}>
          Um caractere especial
        </li>

      </ul>

      {/* CONFIRMAR SENHA */}
      <div className="password-input-wrapper">

        <Input
          label="Confirmar Senha"
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) =>
            updateField(
              "confirmNumericPassword",
              e.target.value
            )
          }
          error={errors.confirmNumericPassword}
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
          aria-label={
            showConfirmPassword
              ? "Ocultar senha"
              : "Visualizar senha"
          }
        >
          {showConfirmPassword ? (
            // Olho riscado
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3l18 18" />
              <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
              <path d="M9.88 4.24A9.77 9.77 0 0 1 12 4c5 0 9 4 10 8a10.6 10.6 0 0 1-2.17 4.19" />
              <path d="M6.61 6.61C4.93 7.73 3.63 9.43 2 12c1 4 5 8 10 8a9.77 9.77 0 0 0 4.24-.88" />
            </svg>
          ) : (
            // Olho
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>

      </div>

      {/* ERRO DE CONFIRMAÇÃO */}
      {confirmPassword &&
        password !== confirmPassword && (
          <span className="field-error">
            As senhas não conferem.
          </span>
        )}

      {/* BOTÕES */}
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
          disabled={!isStrong || !passwordsMatch}
        >
          Continuar
        </button>

      </div>

    </div>
  );
}