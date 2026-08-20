import React from "react";

import AdvanceStatusBadge from "./AdvanceStatusBadge";
import "./AdvanceSummaryCard.css";

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

function formatSegment(segment) {
  const labels = {
    MEDICAL: "Médico",
    BOLETO: "Boleto",
    DUPLICATE: "Duplicata",
    SERVICE: "Serviços",
    INVOICE: "Nota fiscal",
    CONTRACT: "Contrato",
    OTHER: "Outros",
  };

  return labels[String(segment || "").toUpperCase()] || segment || "—";
}

function formatId(value) {
  if (!value) {
    return "—";
  }

  const stringValue = String(value);

  if (stringValue.length <= 16) {
    return stringValue;
  }

  return `${stringValue.slice(0, 8)}...${stringValue.slice(-6)}`;
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function AdvanceSummaryCard({
  advance,
  onClick,
  onView,
  compact = false,
  className = "",
}) {
  if (!advance) {
    return null;
  }

  const {
    id,
    external_id,
    status,
    segment,
    currency_code,
    requested_amount,
    gross_receivables_amount,
    eligible_receivables_amount,
    average_term_days,
    account_id,
    agency_id,
    origin_partner_id,
    created_at,
    updated_at,
  } = advance;

  const handleAction = () => {
    if (typeof onView === "function") {
      onView(advance);
      return;
    }

    if (typeof onClick === "function") {
      onClick(advance);
    }
  };

  const hasAction =
    typeof onView === "function" || typeof onClick === "function";

  return (
    <article
      className={`advance-summary-card ${
        compact ? "advance-summary-card--compact" : ""
      } ${hasAction ? "advance-summary-card--clickable" : ""} ${className}`.trim()}
      onClick={hasAction ? handleAction : undefined}
      onKeyDown={(event) => {
        if (!hasAction) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleAction();
        }
      }}
      role={hasAction ? "button" : undefined}
      tabIndex={hasAction ? 0 : undefined}
    >
      {/* =====================================================
          CABEÇALHO
      ====================================================== */}

      <div className="advance-summary-card__header">
        <div className="advance-summary-card__title-area">
          <span className="advance-summary-card__eyebrow">
            Antecipação
          </span>

          <h3 className="advance-summary-card__title">
            {external_id || `#${formatId(id)}`}
          </h3>
        </div>

        <AdvanceStatusBadge status={status} />
      </div>

      {/* =====================================================
          VALOR PRINCIPAL
      ====================================================== */}

      <div className="advance-summary-card__main">
        <span className="advance-summary-card__main-label">
          Valor solicitado
        </span>

        <strong className="advance-summary-card__main-value">
          {formatCurrency(requested_amount, currency_code)}
        </strong>
      </div>

      {/* =====================================================
          INFORMAÇÕES
      ====================================================== */}

      <div className="advance-summary-card__details">
        <div className="advance-summary-card__detail">
          <span className="advance-summary-card__detail-label">
            Recebíveis brutos
          </span>

          <strong className="advance-summary-card__detail-value">
            {formatCurrency(
              gross_receivables_amount,
              currency_code
            )}
          </strong>
        </div>

        <div className="advance-summary-card__detail">
          <span className="advance-summary-card__detail-label">
            Valor elegível
          </span>

          <strong className="advance-summary-card__detail-value">
            {formatCurrency(
              eligible_receivables_amount,
              currency_code
            )}
          </strong>
        </div>

        <div className="advance-summary-card__detail">
          <span className="advance-summary-card__detail-label">
            Prazo médio
          </span>

          <strong className="advance-summary-card__detail-value">
            {average_term_days
              ? `${average_term_days} dias`
              : "—"}
          </strong>
        </div>

        <div className="advance-summary-card__detail">
          <span className="advance-summary-card__detail-label">
            Segmento
          </span>

          <strong className="advance-summary-card__detail-value">
            {formatSegment(segment)}
          </strong>
        </div>
      </div>

      {/* =====================================================
          METADADOS
      ====================================================== */}

      {!compact && (
        <div className="advance-summary-card__metadata">
          {id && (
            <div className="advance-summary-card__metadata-item">
              <span>ID</span>
              <strong title={id}>{formatId(id)}</strong>
            </div>
          )}

          {account_id && (
            <div className="advance-summary-card__metadata-item">
              <span>Conta</span>
              <strong title={account_id}>
                {formatId(account_id)}
              </strong>
            </div>
          )}

          {agency_id && (
            <div className="advance-summary-card__metadata-item">
              <span>Agência</span>
              <strong title={agency_id}>
                {formatId(agency_id)}
              </strong>
            </div>
          )}

          {origin_partner_id && (
            <div className="advance-summary-card__metadata-item">
              <span>Partner</span>
              <strong title={origin_partner_id}>
                {formatId(origin_partner_id)}
              </strong>
            </div>
          )}

          {created_at && (
            <div className="advance-summary-card__metadata-item">
              <span>Criada em</span>
              <strong>{formatDate(created_at)}</strong>
            </div>
          )}

          {updated_at && (
            <div className="advance-summary-card__metadata-item">
              <span>Atualizada em</span>
              <strong>{formatDate(updated_at)}</strong>
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          AÇÃO
      ====================================================== */}

      {hasAction && (
        <div className="advance-summary-card__footer">
          <span className="advance-summary-card__action">
            Ver detalhes
            <span aria-hidden="true">→</span>
          </span>
        </div>
      )}
    </article>
  );
}