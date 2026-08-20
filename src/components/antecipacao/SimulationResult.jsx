import React from "react";

import "./SimulationResult.css";

/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatCurrency(value, currency = "BRL") {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(numericValue);
}

function formatPercentage(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  /*
   * A API retorna:
   *
   * 8.00000000
   *
   * como percentual efetivo.
   *
   * Portanto, não usamos Intl percent aqui,
   * pois 8 significa 8%, e não 800%.
   */
  return `${numericValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })}%`;
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatTerm(days) {
  const numericDays = Number(days);

  if (!Number.isFinite(numericDays)) {
    return "—";
  }

  return `${numericDays} ${numericDays === 1 ? "dia" : "dias"}`;
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function SimulationResult({
  simulation,
  onContinue,
  onBack,
  onNewSimulation,
  loading = false,
  showActions = true,
  className = "",
}) {
  if (!simulation) {
    return null;
  }

  const {
    gross_amount,
    fund_cost_amount,
    oportuniza_fee_amount,
    total_cost_amount,
    client_net_amount,
    fund_net_amount,
    total_effective_percentage,
    actual_term_days,
    pricing_term_days,
    due_date,
    business_date,
    generated_at,
    valid_until,
    currency_code = "BRL",
    oportuniza_fee_scope,
  } = simulation;

  return (
    <section
      className={`simulation-result ${className}`.trim()}
    >
      {/* =====================================================
          CABEÇALHO
      ====================================================== */}

      <header className="simulation-result__header">
        <div>
          <span className="simulation-result__eyebrow">
            Simulação
          </span>

          <h2 className="simulation-result__title">
            Resultado da antecipação
          </h2>

          <p className="simulation-result__description">
            Confira os valores estimados antes de criar sua
            solicitação de antecipação.
          </p>
        </div>

        {valid_until && (
          <div className="simulation-result__validity">
            <span>Válida até</span>

            <strong>
              {formatDateTime(valid_until)}
            </strong>
          </div>
        )}
      </header>

      {/* =====================================================
          VALOR PRINCIPAL
      ====================================================== */}

      <div className="simulation-result__highlight">
        <span className="simulation-result__highlight-label">
          Valor líquido para você
        </span>

        <strong className="simulation-result__highlight-value">
          {formatCurrency(
            client_net_amount,
            currency_code
          )}
        </strong>

        <span className="simulation-result__highlight-helper">
          Valor estimado após os custos da antecipação
        </span>
      </div>

      {/* =====================================================
          RESUMO
      ====================================================== */}

      <div className="simulation-result__summary">
        <div className="simulation-result__summary-item">
          <span>Valor bruto</span>

          <strong>
            {formatCurrency(
              gross_amount,
              currency_code
            )}
          </strong>
        </div>

        <div className="simulation-result__summary-item">
          <span>Recebimento pelo fundo</span>

          <strong>
            {formatCurrency(
              fund_net_amount,
              currency_code
            )}
          </strong>
        </div>

        <div className="simulation-result__summary-item">
          <span>Custo do fundo</span>

          <strong>
            {formatCurrency(
              fund_cost_amount,
              currency_code
            )}
          </strong>
        </div>

        <div className="simulation-result__summary-item">
          <span>Taxa Oportuniza</span>

          <strong>
            {formatCurrency(
              oportuniza_fee_amount,
              currency_code
            )}
          </strong>
        </div>

        <div className="simulation-result__summary-item simulation-result__summary-item--total">
          <span>Custo total</span>

          <strong>
            {formatCurrency(
              total_cost_amount,
              currency_code
            )}
          </strong>
        </div>

        <div className="simulation-result__summary-item">
          <span>Taxa efetiva total</span>

          <strong>
            {formatPercentage(
              total_effective_percentage
            )}
          </strong>
        </div>
      </div>

      {/* =====================================================
          PRAZO
      ====================================================== */}

      <div className="simulation-result__terms">
        <div className="simulation-result__term">
          <span>Prazo considerado</span>

          <strong>
            {formatTerm(actual_term_days)}
          </strong>
        </div>

        <div className="simulation-result__term">
          <span>Prazo de precificação</span>

          <strong>
            {formatTerm(pricing_term_days)}
          </strong>
        </div>

        <div className="simulation-result__term">
          <span>Vencimento</span>

          <strong>
            {formatDate(due_date)}
          </strong>
        </div>

        {business_date && (
          <div className="simulation-result__term">
            <span>Data-base</span>

            <strong>
              {formatDate(business_date)}
            </strong>
          </div>
        )}
      </div>

      {/* =====================================================
          INFORMAÇÕES DA TAXA
      ====================================================== */}

      {oportuniza_fee_scope && (
        <div className="simulation-result__fee-info">
          <span className="simulation-result__info-icon">
            i
          </span>

          <p>
            A taxa da Oportuniza está sendo aplicada no
            escopo{" "}
            <strong>
              {String(oportuniza_fee_scope).toLowerCase()}
            </strong>
            .
          </p>
        </div>
      )}

      {/* =====================================================
          DATA DA SIMULAÇÃO
      ====================================================== */}

      {generated_at && (
        <div className="simulation-result__generated">
          Simulação gerada em{" "}
          <strong>
            {formatDateTime(generated_at)}
          </strong>
        </div>
      )}

      {/* =====================================================
          AÇÕES
      ====================================================== */}

      {showActions && (
        <footer className="simulation-result__actions">
          {typeof onBack === "function" && (
            <button
              type="button"
              className="simulation-result__button simulation-result__button--secondary"
              onClick={onBack}
              disabled={loading}
            >
              Voltar
            </button>
          )}

          {typeof onNewSimulation === "function" && (
            <button
              type="button"
              className="simulation-result__button simulation-result__button--secondary"
              onClick={onNewSimulation}
              disabled={loading}
            >
              Nova simulação
            </button>
          )}

          {typeof onContinue === "function" && (
            <button
              type="button"
              className="simulation-result__button simulation-result__button--primary"
              onClick={onContinue}
              disabled={loading}
            >
              {loading
                ? "Processando..."
                : "Continuar"}
            </button>
          )}
        </footer>
      )}
    </section>
  );
}