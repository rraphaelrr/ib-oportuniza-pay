import React from "react";
import BoletoStatus from "./BoletoStatus";
import BoletoActions from "./BoletoActions";

import "./BoletoCard.css";

function formatCurrency(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "R$ 0,00";
  }

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("pt-BR");
}

function getInitials(name) {
  if (!name) return "?";

  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function BoletoCard({
  boleto,
  onView,
  onDownload,
  onShare,
  onCopy,
  onCancel,
  onViewClient,
  onViewContract,
}) {
  if (!boleto) {
    return null;
  }

  const clientName =
    boleto.client?.name ||
    boleto.payer?.name ||
    boleto.customer?.name ||
    "Cliente não informado";

  const clientDocument =
    boleto.client?.document ||
    boleto.payer?.document ||
    boleto.customer?.document;

  const contract =
    boleto.contract?.number ||
    boleto.contract?.id ||
    null;

  return (
    <article className="boleto-card">
      <div className="boleto-card-header">
        <button
          type="button"
          className="boleto-card-client"
          onClick={() => onViewClient?.(boleto)}
        >
          <span className="boleto-card-avatar">
            {getInitials(clientName)}
          </span>

          <span className="boleto-card-client-info">
            <strong>{clientName}</strong>

            {clientDocument && (
              <small>{clientDocument}</small>
            )}
          </span>
        </button>

        <BoletoStatus status={boleto.status} />
      </div>

      <div className="boleto-card-body">
        <div className="boleto-card-main">
          <span className="boleto-card-label">
            Valor
          </span>

          <strong className="boleto-card-value">
            {formatCurrency(boleto.amount)}
          </strong>
        </div>

        <div className="boleto-card-info">
          <div>
            <span>Vencimento</span>
            <strong>
              {formatDate(boleto.due_date)}
            </strong>
          </div>

          <div>
            <span>Contrato</span>

            {contract ? (
              <button
                type="button"
                className="boleto-card-contract"
                onClick={() => onViewContract?.(boleto)}
              >
                #{contract}
              </button>
            ) : (
              <strong>-</strong>
            )}
          </div>
        </div>

        {boleto.description && (
          <div className="boleto-card-description">
            <span>Descrição</span>
            <p>{boleto.description}</p>
          </div>
        )}
      </div>

      <div className="boleto-card-footer">
        <span className="boleto-card-number">
          {boleto.number
            ? `Boleto #${boleto.number}`
            : boleto.id
              ? `#${boleto.id}`
              : "Boleto"}
        </span>

        <BoletoActions
          boleto={boleto}
          compact
          onView={onView}
          onDownload={onDownload}
          onShare={onShare}
          onCopy={onCopy}
          onCancel={onCancel}
        />
      </div>
    </article>
  );
}