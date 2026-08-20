import React from "react";

import "./OfferCard.css";

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

  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(numericValue);
}

function normalizeRate(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  /*
   * A API retorna a taxa mensal como decimal.
   *
   * Exemplo:
   * 0.025 → 2,50%
   */
  return numericValue;
}

function getOfferStatusLabel(status) {
  const labels = {
    ACTIVE: "Disponível",
    ACCEPTED: "Aceita",
    REJECTED: "Recusada",
    EXPIRED: "Expirada",
    CANCELLED: "Cancelada",
    CANCELED: "Cancelada",
  };

  return labels[String(status || "").toUpperCase()] || status || "Indefinido";
}

function getOfferStatusClass(status) {
  const normalized = String(status || "")
    .trim()
    .toUpperCase();

  const classes = {
    ACTIVE: "active",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
    EXPIRED: "expired",
    CANCELLED: "cancelled",
    CANCELED: "cancelled",
  };

  return classes[normalized] || "unknown";
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function OfferCard({
  offer,
  selected = false,
  disabled = false,
  onSelect,
  onAccept,
  showAcceptButton = true,
  showSelectIndicator = true,
  className = "",
}) {
  if (!offer) {
    return null;
  }

  const {
    id,
    funding_partner_id,
    funding_partner_name,
    gross_receivable_amount,
    eligible_amount,
    advance_amount,
    discount_amount,
    fee_amount,
    net_disbursement_amount,
    monthly_rate,
    status,
  } = offer;

  const normalizedRate = normalizeRate(monthly_rate);

  const isActive =
    String(status || "").toUpperCase() === "ACTIVE";

  const canSelect =
    !disabled &&
    isActive &&
    typeof onSelect === "function";

  const canAccept =
    !disabled &&
    isActive &&
    typeof onAccept === "function";

  const handleSelect = () => {
    if (!canSelect) {
      return;
    }

    onSelect(offer);
  };

  const handleAccept = (event) => {
    event.stopPropagation();

    if (!canAccept) {
      return;
    }

    onAccept(offer);
  };

  return (
    <article
      className={[
        "offer-card",
        selected ? "offer-card--selected" : "",
        disabled ? "offer-card--disabled" : "",
        canSelect ? "offer-card--selectable" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={canSelect ? handleSelect : undefined}
      onKeyDown={(event) => {
        if (!canSelect) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelect();
        }
      }}
      role={canSelect ? "button" : undefined}
      tabIndex={canSelect ? 0 : undefined}
    >
      {/* =====================================================
          CABEÇALHO
      ====================================================== */}

      <header className="offer-card__header">
        <div className="offer-card__partner">
          <div className="offer-card__partner-icon" aria-hidden="true">
            $
          </div>

          <div className="offer-card__partner-info">
            <span className="offer-card__label">
              Fundo
            </span>

            <h3 className="offer-card__partner-name">
              {funding_partner_name || "Fundo não identificado"}
            </h3>
          </div>
        </div>

        <span
          className={`offer-card__status offer-card__status--${getOfferStatusClass(
            status
          )}`}
        >
          <span
            className="offer-card__status-dot"
            aria-hidden="true"
          />

          {getOfferStatusLabel(status)}
        </span>
      </header>

      {/* =====================================================
          VALOR LÍQUIDO
      ====================================================== */}

      <section className="offer-card__highlight">
        <span className="offer-card__highlight-label">
          Você recebe
        </span>

        <strong className="offer-card__highlight-value">
          {formatCurrency(net_disbursement_amount)}
        </strong>

        {normalizedRate !== null && (
          <span className="offer-card__rate">
            {formatPercentage(normalizedRate)} ao mês
          </span>
        )}
      </section>

      {/* =====================================================
          RESUMO FINANCEIRO
      ====================================================== */}

      <section className="offer-card__details">
        <div className="offer-card__detail">
          <span>Valor bruto</span>

          <strong>
            {formatCurrency(gross_receivable_amount)}
          </strong>
        </div>

        <div className="offer-card__detail">
          <span>Valor elegível</span>

          <strong>
            {formatCurrency(eligible_amount)}
          </strong>
        </div>

        <div className="offer-card__detail">
          <span>Antecipação</span>

          <strong>
            {formatCurrency(advance_amount)}
          </strong>
        </div>

        <div className="offer-card__detail">
          <span>Desconto</span>

          <strong>
            {formatCurrency(discount_amount)}
          </strong>
        </div>

        <div className="offer-card__detail">
          <span>Taxa</span>

          <strong>
            {formatCurrency(fee_amount)}
          </strong>
        </div>
      </section>

      {/* =====================================================
          SELEÇÃO
      ====================================================== */}

      {showSelectIndicator && isActive && (
        <div className="offer-card__selection">
          <span
            className={`offer-card__radio ${
              selected ? "offer-card__radio--selected" : ""
            }`}
            aria-hidden="true"
          >
            {selected && (
              <span className="offer-card__radio-check" />
            )}
          </span>

          <span className="offer-card__selection-text">
            {selected
              ? "Oferta selecionada"
              : "Selecionar esta oferta"}
          </span>
        </div>
      )}

      {/* =====================================================
          RODAPÉ
      ====================================================== */}

      {(canAccept || id) && (
        <footer className="offer-card__footer">
          {id && (
            <span
              className="offer-card__id"
              title={id}
            >
              Oferta #{String(id).slice(0, 8)}
            </span>
          )}

          {showAcceptButton && canAccept && (
            <button
              type="button"
              className="offer-card__accept-button"
              onClick={handleAccept}
              disabled={disabled}
            >
              Aceitar oferta
            </button>
          )}
        </footer>
      )}
    </article>
  );
}