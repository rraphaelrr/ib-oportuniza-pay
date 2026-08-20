import React from "react";

import "./ReceivableCard.css";

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

function formatReceivableType(type) {
  const labels = {
    MEDICAL_SHIFT: "Plantão médico",
    BOLETO: "Boleto",
    DUPLICATE: "Duplicata",
    SERVICE: "Serviço",
    INVOICE: "Nota fiscal",
    CONTRACT: "Contrato",
    OTHER: "Outro",
  };

  const normalized = String(type || "").toUpperCase();

  return labels[normalized] || type || "Recebível";
}

function formatStatus(status) {
  const labels = {
    ELIGIBLE: "Elegível",
    PENDING: "Pendente",
    INELIGIBLE: "Não elegível",
    REJECTED: "Rejeitado",
    ACCEPTED: "Aceito",
    SETTLED: "Liquidado",
    CANCELLED: "Cancelado",
    CANCELED: "Cancelado",
  };

  const normalized = String(status || "").toUpperCase();

  return labels[normalized] || status || "Indefinido";
}

function getStatusClass(status) {
  const normalized = String(status || "").toUpperCase();

  const classes = {
    ELIGIBLE: "eligible",
    PENDING: "pending",
    INELIGIBLE: "ineligible",
    REJECTED: "rejected",
    ACCEPTED: "accepted",
    SETTLED: "settled",
    CANCELLED: "cancelled",
    CANCELED: "cancelled",
  };

  return classes[normalized] || "unknown";
}

function formatVerificationStatus(status) {
  const labels = {
    VERIFIED: "Verificado",
    PENDING: "Em verificação",
    REJECTED: "Não verificado",
  };

  const normalized = String(status || "").toUpperCase();

  return labels[normalized] || status || "—";
}

function getVerificationClass(status) {
  const normalized = String(status || "").toUpperCase();

  const classes = {
    VERIFIED: "verified",
    PENDING: "pending",
    REJECTED: "rejected",
  };

  return classes[normalized] || "unknown";
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

export default function ReceivableCard({
  receivable,
  selected = false,
  disabled = false,
  onSelect,
  onView,
  showSelection = false,
  compact = false,
  className = "",
}) {
  if (!receivable) {
    return null;
  }

  const {
    id,
    advance_id,
    external_id,
    debtor_name,
    due_date,
    eligible_amount,
    original_amount,
    receivable_type,
    status,
    verification_status,
    accepted_offer_id,
    currency_code = "BRL",
  } = receivable;

  const canSelect =
    showSelection &&
    !disabled &&
    typeof onSelect === "function";

  const canView =
    typeof onView === "function";

  const handleClick = () => {
    if (canSelect) {
      onSelect(receivable);
      return;
    }

    if (canView) {
      onView(receivable);
    }
  };

  const isInteractive = canSelect || canView;

  return (
    <article
      className={[
        "receivable-card",
        selected ? "receivable-card--selected" : "",
        disabled ? "receivable-card--disabled" : "",
        compact ? "receivable-card--compact" : "",
        isInteractive ? "receivable-card--interactive" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={(event) => {
        if (!isInteractive) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {/* =====================================================
          CABEÇALHO
      ====================================================== */}

      <header className="receivable-card__header">
        <div className="receivable-card__title-area">
          {showSelection && (
            <span
              className={`receivable-card__checkbox ${
                selected
                  ? "receivable-card__checkbox--selected"
                  : ""
              }`}
              aria-hidden="true"
            >
              {selected && (
                <span className="receivable-card__checkbox-check">
                  ✓
                </span>
              )}
            </span>
          )}

          <div>
            <span className="receivable-card__type">
              {formatReceivableType(receivable_type)}
            </span>

            <h3 className="receivable-card__title">
              {external_id || `Recebível #${formatId(id)}`}
            </h3>
          </div>
        </div>

        <span
          className={`receivable-card__status receivable-card__status--${getStatusClass(
            status
          )}`}
        >
          <span
            className="receivable-card__status-dot"
            aria-hidden="true"
          />

          {formatStatus(status)}
        </span>
      </header>

      {/* =====================================================
          DEVEDOR
      ====================================================== */}

      <section className="receivable-card__debtor">
        <span className="receivable-card__label">
          Devedor
        </span>

        <strong className="receivable-card__debtor-name">
          {debtor_name || "Não informado"}
        </strong>
      </section>

      {/* =====================================================
          VALORES
      ====================================================== */}

      <section className="receivable-card__values">
        <div className="receivable-card__value">
          <span>Valor original</span>

          <strong>
            {formatCurrency(
              original_amount,
              currency_code
            )}
          </strong>
        </div>

        <div className="receivable-card__value receivable-card__value--highlight">
          <span>Valor elegível</span>

          <strong>
            {formatCurrency(
              eligible_amount,
              currency_code
            )}
          </strong>
        </div>
      </section>

      {/* =====================================================
          INFORMAÇÕES
      ====================================================== */}

      <section className="receivable-card__details">
        <div className="receivable-card__detail">
          <span>Vencimento</span>

          <strong>
            {formatDate(due_date)}
          </strong>
        </div>

        <div className="receivable-card__detail">
          <span>Verificação</span>

          <strong
            className={`receivable-card__verification receivable-card__verification--${getVerificationClass(
              verification_status
            )}`}
          >
            {formatVerificationStatus(
              verification_status
            )}
          </strong>
        </div>
      </section>

      {/* =====================================================
          INFORMAÇÕES ADICIONAIS
      ====================================================== */}

      {!compact && (
        <div className="receivable-card__metadata">
          {id && (
            <div className="receivable-card__metadata-item">
              <span>ID</span>

              <strong title={id}>
                {formatId(id)}
              </strong>
            </div>
          )}

          {advance_id && (
            <div className="receivable-card__metadata-item">
              <span>Antecipação</span>

              <strong title={advance_id}>
                {formatId(advance_id)}
              </strong>
            </div>
          )}

          {accepted_offer_id && (
            <div className="receivable-card__metadata-item">
              <span>Oferta aceita</span>

              <strong title={accepted_offer_id}>
                {formatId(accepted_offer_id)}
              </strong>
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          RODAPÉ
      ====================================================== */}

      {(canSelect || canView) && (
        <footer className="receivable-card__footer">
          {canSelect && (
            <span className="receivable-card__selection-text">
              {selected
                ? "Recebível selecionado"
                : "Selecionar recebível"}
            </span>
          )}

          {canView && !canSelect && (
            <span className="receivable-card__view-action">
              Ver detalhes
              <span aria-hidden="true">→</span>
            </span>
          )}
        </footer>
      )}
    </article>
  );
}