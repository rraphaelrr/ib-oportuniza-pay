import React, { useEffect, useState } from "react";

import {
  ArrowLeft,
  FilePlus2,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import "./Solicitar.css";

import DashboardLayout from "../../../layout/DashboardLayout";
import useAntecipacao from "../../../hooks/useAntecipacao";

/* =========================================================
   CONSTANTES
========================================================= */

const SEGMENTS = [
  {
    value: "MEDICAL",
    label: "Médico",
  },
  {
    value: "BOLETO",
    label: "Boleto",
  },
  {
    value: "OTHER",
    label: "Outros",
  },
];

/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatCurrencyInput(value) {
  const numbers = String(value || "").replace(/\D/g, "");

  if (!numbers) {
    return "";
  }

  const number = Number(numbers) / 100;

  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseCurrency(value) {
  if (!value) {
    return 0;
  }

  return Number(
    String(value)
      .replace(/\./g, "")
      .replace(",", ".")
  );
}

/* =========================================================
   ERROS DA API
========================================================= */

function getApiErrorMessage(error) {
  if (!error) {
    return "Não foi possível criar a solicitação.";
  }

  const responseData =
    error?.response?.data ||
    error?.data ||
    error;

  if (typeof responseData === "string") {
    return responseData;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.error?.message) {
    return responseData.error.message;
  }

  if (
    responseData?.error &&
    typeof responseData.error === "string"
  ) {
    return responseData.error;
  }

  if (responseData?.detail) {
    return responseData.detail;
  }

  if (responseData?.errors) {
    if (Array.isArray(responseData.errors)) {
      return responseData.errors
        .map(
          (item) =>
            item?.message ||
            item?.detail ||
            String(item)
        )
        .join(" ");
    }

    if (typeof responseData.errors === "object") {
      return Object.values(responseData.errors)
        .flat()
        .map((item) =>
          typeof item === "string"
            ? item
            : item?.message || String(item)
        )
        .join(" ");
    }
  }

  switch (error?.response?.status || error?.status) {
    case 400:
      return "Os dados enviados são inválidos.";

    case 401:
      return "Sua sessão expirou. Faça login novamente.";

    case 403:
      return "Você não possui permissão para criar uma solicitação.";

    case 404:
      return "Não foi possível encontrar os dados necessários para criar a solicitação.";

    case 409:
      return "Já existe uma solicitação com os dados informados.";

    case 422:
      return "Existem dados inválidos. Verifique as informações preenchidas.";

    case 429:
      return "Muitas tentativas. Aguarde alguns instantes e tente novamente.";

    case 500:
    case 502:
    case 503:
    case 504:
      return "O serviço está temporariamente indisponível. Tente novamente em alguns instantes.";

    default:
      return "Não foi possível criar a solicitação. Tente novamente.";
  }
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function Solicitar({
  onBack,
  accountId,
}) {
  const {
    criarAntecipacao,
    loading,
    error,
    advance,
  } = useAntecipacao();

  /* =========================================================
     CONTA DO USUÁRIO
  ========================================================= */

  const [resolvedAccountId, setResolvedAccountId] =
    useState(accountId || "");

  useEffect(() => {
    if (accountId) {
      setResolvedAccountId(accountId);
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return;
      }

      const user = JSON.parse(storedUser);

      const storedAccountId =
        user?.user?.account_id ||
        user?.account_id;

      if (storedAccountId) {
        setResolvedAccountId(storedAccountId);
      }
    } catch (err) {
      console.error(
        "Não foi possível recuperar os dados do usuário:",
        err
      );
    }
  }, [accountId]);

  /* =========================================================
     FORM
  ========================================================= */

  const initialForm = {
    account_id: accountId || "",
    agency_id: "",
    average_term_days: "30",
    currency_code: "BRL",
    external_id: "",
    notes: "",
    origin_partner_id: "",
    requested_amount: "",
    segment: "MEDICAL",
  };

  const [form, setForm] = useState(initialForm);

  const [created, setCreated] = useState(null);

  const [fieldErrors, setFieldErrors] = useState({});

  const [submitError, setSubmitError] = useState("");

  /* =========================================================
     ATUALIZA ACCOUNT ID
  ========================================================= */

  useEffect(() => {
    if (resolvedAccountId) {
      setForm((prev) => ({
        ...prev,
        account_id: resolvedAccountId,
      }));

      setFieldErrors((prev) => ({
        ...prev,
        account_id: "",
      }));
    }
  }, [resolvedAccountId]);

  /* =========================================================
     ALTERAÇÃO DOS CAMPOS
  ========================================================= */

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSubmitError("");
  }

  /* =========================================================
     VALOR
  ========================================================= */

  function handleAmountChange(event) {
    const formatted = formatCurrencyInput(
      event.target.value
    );

    setForm((prev) => ({
      ...prev,
      requested_amount: formatted,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      requested_amount: "",
    }));

    setSubmitError("");
  }

  /* =========================================================
     VALIDAÇÃO
  ========================================================= */

  function validateForm() {
    const errors = {};

    if (!form.account_id) {
      errors.account_id =
        "Não foi possível identificar a conta.";
    }

    const requestedAmount = parseCurrency(
      form.requested_amount
    );

    if (!form.requested_amount) {
      errors.requested_amount =
        "Informe o valor solicitado.";
    } else if (
      !requestedAmount ||
      requestedAmount <= 0
    ) {
      errors.requested_amount =
        "Informe um valor maior que zero.";
    }

    if (!form.average_term_days) {
      errors.average_term_days =
        "Informe o prazo médio.";
    } else if (
      Number(form.average_term_days) <= 0
    ) {
      errors.average_term_days =
        "O prazo deve ser maior que zero.";
    }

    if (!form.segment) {
      errors.segment =
        "Selecione um segmento.";
    }

    if (!form.external_id.trim()) {
      errors.external_id =
        "Informe o identificador externo.";
    }

    if (!form.agency_id.trim()) {
      errors.agency_id =
        "Informe a agência.";
    }

    if (!form.origin_partner_id.trim()) {
      errors.origin_partner_id =
        "Informe o Partner de origem.";
    }

    return errors;
  }

  /* =========================================================
     SUBMIT
  ========================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    setFieldErrors({});
    setSubmitError("");

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);

      const firstErrorField =
        Object.keys(errors)[0];

      requestAnimationFrame(() => {
        document
          .getElementById(firstErrorField)
          ?.focus();
      });

      return;
    }

    const requestedAmount = parseCurrency(
      form.requested_amount
    );

    const payload = {
      account_id: form.account_id,
      agency_id: form.agency_id.trim(),
      average_term_days: Number(
        form.average_term_days
      ),
      currency_code: form.currency_code,
      external_id: form.external_id.trim(),
      notes: form.notes.trim(),
      origin_partner_id:
        form.origin_partner_id.trim(),
      requested_amount:
        requestedAmount.toFixed(2),
      segment: form.segment,
    };

    try {
      const result =
        await criarAntecipacao(payload);

      setCreated(result || advance || true);
    } catch (err) {
      console.error(
        "Erro ao criar solicitação:",
        err
      );

      setCreated(null);

      setSubmitError(
        getApiErrorMessage(err)
      );
    }
  }

  /* =========================================================
     NOVA SOLICITAÇÃO
  ========================================================= */

  function handleNewRequest() {
    setCreated(null);

    setFieldErrors({});

    setSubmitError("");

    setForm({
      ...initialForm,
      account_id:
        resolvedAccountId || accountId || "",
    });
  }

  /* =========================================================
     SUCESSO
  ========================================================= */

  if (created) {
    const createdAdvance =
      typeof created === "object"
        ? created
        : advance;

    return (
      <DashboardLayout>
        <div className="solicitar-page">
          <div className="solicitar-success">
            <div className="solicitar-success-icon">
              <CheckCircle2 size={32} />
            </div>

            <h1>Solicitação criada</h1>

            <p>
              A solicitação de antecipação foi
              criada com sucesso. Agora você
              poderá adicionar os recebíveis e
              documentos necessários antes de
              enviá-la para análise.
            </p>

            {createdAdvance?.id && (
              <div className="solicitar-success-id">
                <span>
                  ID da solicitação
                </span>

                <strong>
                  {createdAdvance.id}
                </strong>
              </div>
            )}

            {createdAdvance?.external_id && (
              <div className="solicitar-success-id">
                <span>
                  Identificador externo
                </span>

                <strong>
                  {createdAdvance.external_id}
                </strong>
              </div>
            )}

            <div className="solicitar-success-actions">
              <button
                type="button"
                className="solicitar-secondary-button"
                onClick={handleNewRequest}
              >
                Nova solicitação
              </button>

              <button
                type="button"
                className="solicitar-primary-button"
                onClick={onBack}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <DashboardLayout>
      <div className="solicitar-page">
        {/* HEADER */}

        <div className="solicitar-header">
          <button
            type="button"
            className="solicitar-back-button"
            onClick={onBack}
            disabled={loading}
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <div className="solicitar-title-wrapper">
            <div className="solicitar-icon">
              <FilePlus2 size={22} />
            </div>

            <div>
              <h1>
                Solicitar antecipação
              </h1>

              <p>
                Crie uma nova solicitação para
                antecipar seus recebíveis.
              </p>
            </div>
          </div>
        </div>

        {/* CONTEÚDO */}

        <div className="solicitar-content">
          <form
            className="solicitar-form-card"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="solicitar-card-header">
              <div>
                <h2>
                  Dados da solicitação
                </h2>

                <p>
                  Informe os dados básicos da
                  antecipação.
                </p>
              </div>
            </div>

            <div className="solicitar-form-grid">
              {/* VALOR */}

              <div className="solicitar-field solicitar-field-full">
                <label htmlFor="requested_amount">
                  Valor solicitado
                </label>

                <div
                  className={
                    `solicitar-input-prefix ${
                      fieldErrors.requested_amount
                        ? "has-error"
                        : ""
                    }`
                  }
                >
                  <span>R$</span>

                  <input
                    id="requested_amount"
                    name="requested_amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={
                      form.requested_amount
                    }
                    onChange={
                      handleAmountChange
                    }
                    disabled={loading}
                    aria-invalid={
                      !!fieldErrors.requested_amount
                    }
                  />
                </div>

                {fieldErrors.requested_amount && (
                  <span className="field-error">
                    {
                      fieldErrors.requested_amount
                    }
                  </span>
                )}
              </div>

              {/* PRAZO */}

              <div className="solicitar-field">
                <label htmlFor="average_term_days">
                  Prazo médio
                </label>

                <div
                  className={
                    `solicitar-input-suffix ${
                      fieldErrors.average_term_days
                        ? "has-error"
                        : ""
                    }`
                  }
                >
                  <input
                    id="average_term_days"
                    name="average_term_days"
                    type="number"
                    min="1"
                    value={
                      form.average_term_days
                    }
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={
                      !!fieldErrors.average_term_days
                    }
                  />

                  <span>dias</span>
                </div>

                {fieldErrors.average_term_days && (
                  <span className="field-error">
                    {
                      fieldErrors.average_term_days
                    }
                  </span>
                )}
              </div>

              {/* SEGMENTO */}

              <div className="solicitar-field">
                <label htmlFor="segment">
                  Segmento
                </label>

                <select
                  id="segment"
                  name="segment"
                  value={form.segment}
                  onChange={handleChange}
                  disabled={loading}
                  aria-invalid={
                    !!fieldErrors.segment
                  }
                  className={
                    fieldErrors.segment
                      ? "input-error"
                      : ""
                  }
                >
                  {SEGMENTS.map(
                    (segment) => (
                      <option
                        key={segment.value}
                        value={segment.value}
                      >
                        {segment.label}
                      </option>
                    )
                  )}
                </select>

                {fieldErrors.segment && (
                  <span className="field-error">
                    {fieldErrors.segment}
                  </span>
                )}
              </div>

              {/* ID EXTERNO */}

              <div className="solicitar-field">
                <label htmlFor="external_id">
                  Identificador externo
                </label>

                <input
                  id="external_id"
                  name="external_id"
                  type="text"
                  placeholder="Ex.: advance-2026-0001"
                  value={form.external_id}
                  onChange={handleChange}
                  disabled={loading}
                  aria-invalid={
                    !!fieldErrors.external_id
                  }
                  className={
                    fieldErrors.external_id
                      ? "input-error"
                      : ""
                  }
                />

                <small>
                  Identificador utilizado pelo
                  seu sistema para localizar
                  esta solicitação.
                </small>

                {fieldErrors.external_id && (
                  <span className="field-error">
                    {fieldErrors.external_id}
                  </span>
                )}
              </div>

              {/* AGENCY */}

              <div className="solicitar-field">
                <label htmlFor="agency_id">
                  Agência
                </label>

                <input
                  id="agency_id"
                  name="agency_id"
                  type="text"
                  placeholder="ID da agência"
                  value={form.agency_id}
                  onChange={handleChange}
                  disabled={loading}
                  aria-invalid={
                    !!fieldErrors.agency_id
                  }
                  className={
                    fieldErrors.agency_id
                      ? "input-error"
                      : ""
                  }
                />

                {fieldErrors.agency_id && (
                  <span className="field-error">
                    {fieldErrors.agency_id}
                  </span>
                )}
              </div>

              {/* PARTNER */}

              <div className="solicitar-field solicitar-field-full">
                <label htmlFor="origin_partner_id">
                  Partner de origem
                </label>

                <input
                  id="origin_partner_id"
                  name="origin_partner_id"
                  type="text"
                  placeholder="ID do Partner"
                  value={
                    form.origin_partner_id
                  }
                  onChange={handleChange}
                  disabled={loading}
                  aria-invalid={
                    !!fieldErrors.origin_partner_id
                  }
                  className={
                    fieldErrors.origin_partner_id
                      ? "input-error"
                      : ""
                  }
                />

                {fieldErrors.origin_partner_id && (
                  <span className="field-error">
                    {
                      fieldErrors.origin_partner_id
                    }
                  </span>
                )}
              </div>

              {/* OBSERVAÇÕES */}

              <div className="solicitar-field solicitar-field-full">
                <label htmlFor="notes">
                  Observações

                  <span className="solicitar-optional">
                    opcional
                  </span>
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  placeholder="Adicione informações relevantes sobre a antecipação..."
                  value={form.notes}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* ERRO DA API */}

            {submitError && (
              <div
                className="solicitar-error"
                role="alert"
              >
                <div className="solicitar-error-icon">
                  !
                </div>

                <div className="solicitar-error-content">
                  <strong>
                    Não foi possível criar a
                    solicitação
                  </strong>

                  <span>
                    {submitError}
                  </span>
                </div>

                <button
                  type="button"
                  className="solicitar-error-close"
                  onClick={() =>
                    setSubmitError("")
                  }
                  aria-label="Fechar mensagem"
                >
                  ×
                </button>
              </div>
            )}

            {/* ERRO DO HOOK */}

            {!submitError && error && (
              <div
                className="solicitar-error"
                role="alert"
              >
                <div className="solicitar-error-icon">
                  !
                </div>

                <div className="solicitar-error-content">
                  <strong>
                    Não foi possível criar a
                    solicitação
                  </strong>

                  <span>
                    {getApiErrorMessage(error)}
                  </span>
                </div>

                <button
                  type="button"
                  className="solicitar-error-close"
                  onClick={() =>
                    setSubmitError("")
                  }
                  aria-label="Fechar mensagem"
                >
                  ×
                </button>
              </div>
            )}

            {/* ERRO DE CONTA */}

            {fieldErrors.account_id && (
              <div
                className="solicitar-error"
                role="alert"
              >
                <div className="solicitar-error-icon">
                  !
                </div>

                <div className="solicitar-error-content">
                  <strong>
                    Conta não identificada
                  </strong>

                  <span>
                    {fieldErrors.account_id}
                  </span>
                </div>
              </div>
            )}

            {/* FOOTER */}

            <div className="solicitar-footer">
              <div className="solicitar-info">
                <CheckCircle2 size={16} />

                <span>
                  Criar a solicitação não
                  significa que a antecipação
                  foi aprovada.
                </span>
              </div>

              <button
                type="submit"
                className="solicitar-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="solicitar-loading"
                    />

                    Criando...
                  </>
                ) : (
                  <>
                    <FilePlus2 size={18} />

                    Criar solicitação
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}