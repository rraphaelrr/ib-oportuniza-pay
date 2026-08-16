import React, { useRef, useState } from "react";

import Input from "../../../components/Input";
import PhoneInput from "../../../components/PhoneInput";

import "./CadastroSteps.css";

export default function StepContato({
  values,
  updateField,
  errors = {},
  next,
  back,
}) {
  const emailInputRef = useRef(null);

  const [localError, setLocalError] = useState("");

  /* =========================================================
     NORMALIZAÇÃO
  ========================================================= */

  function normalizeEmail(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  /* =========================================================
     VALIDAÇÃO
  ========================================================= */

  function validateEmail(email) {
    if (!email) {
      return "Informe seu e-mail.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return "Informe um endereço de e-mail válido.";
    }

    return "";
  }

  /* =========================================================
     ALTERAÇÃO DO E-MAIL
  ========================================================= */

  function handleEmailChange(e) {
    const value = e.target.value;

    /*
     * Mantém o estado React sincronizado enquanto
     * o usuário digita.
     */
    updateField("email", value);

    /*
     * Limpa o erro enquanto o usuário corrige.
     */
    if (localError) {
      setLocalError("");
    }
  }

  /* =========================================================
     BLUR
  ========================================================= */

  function handleEmailBlur(e) {
    /*
     * Lê diretamente o valor atual do input.
     *
     * Isso ajuda a evitar inconsistências causadas
     * por autofill do navegador.
     */
    const realValue = e.currentTarget.value;

    const normalizedEmail =
      normalizeEmail(realValue);

    /*
     * Atualiza o estado com o valor real do campo.
     */
    updateField(
      "email",
      normalizedEmail
    );

    const validationError =
      validateEmail(normalizedEmail);

    setLocalError(
      validationError
    );
  }

  /* =========================================================
     CONTINUAR
  ========================================================= */

  function handleNext() {
    /*
     * Primeiro tenta obter o valor REAL do input.
     *
     * Não confiamos somente em values.email.
     */
    const inputValue =
      emailInputRef.current?.value ?? "";

    const normalizedEmail =
      normalizeEmail(inputValue);

    /*
     * Validação.
     */
    const validationError =
      validateEmail(normalizedEmail);

    if (validationError) {
      setLocalError(
        validationError
      );

      /*
       * Mantém o estado sincronizado mesmo
       * em caso de erro.
       */
      updateField(
        "email",
        normalizedEmail
      );

      return;
    }

    /*
     * Aqui o estado React recebe exatamente o
     * valor que estava no input.
     */
    updateField(
      "email",
      normalizedEmail
    );

    setLocalError("");

    /*
     * Avança somente depois da sincronização.
     */
    next();
  }

  /* =========================================================
     ERRO FINAL
  ========================================================= */

  const emailError =
    localError ||
    errors.email;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="step">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="step-header">
        <h2 className="step-title">
          Contato
        </h2>

        <p className="step-description">
          Informe seus meios de contato.
        </p>
      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <div className="form-grid">

        {/* ===================================================
            E-MAIL
        =================================================== */}

        <Input
          ref={emailInputRef}
          label="E-mail"
          name="email"
          type="email"
          value={values.email || ""}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          autoComplete="email"
          placeholder="email@empresa.com"
          error={emailError}
          required
        />

        {/* ===================================================
            TELEFONE
        =================================================== */}

        <PhoneInput
          label="Celular"
          value={values.telefone || ""}
          onChange={(e) =>
            updateField(
              "telefone",
              e.target.value
            )
          }
          error={errors.telefone}
          required
        />
      </div>

      {/* =====================================================
          BOTÕES
      ===================================================== */}

      <div className="step-buttons">

        <button
          type="button"
          className="btn btn-secondary"
          onClick={back}
        >
          Voltar
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNext}
        >
          Continuar
        </button>

      </div>
    </div>
  );
}