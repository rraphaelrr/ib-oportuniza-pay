import React from "react";

import "./ClienteCard.css";

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

function maskDocument(document) {
  if (!document) return "-";

  const value = String(document).replace(/\D/g, "");

  if (value.length === 11) {
    return value.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-**"
    );
  }

  if (value.length === 14) {
    return value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.***.***/****-**"
    );
  }

  return document;
}

function getInitials(name) {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function getClientStatus(cliente) {
  if (cliente.status) {
    return String(cliente.status).toUpperCase();
  }

  const overdue =
    Number(cliente.overdue_amount || 0);

  if (overdue > 0) {
    return "OVERDUE";
  }

  return "ACTIVE";
}

function getStatusLabel(status) {
  const labels = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
    BLOCKED: "Bloqueado",
    OVERDUE: "Inadimplente",
    PENDING: "Pendente",
  };

  return labels[status] || status;
}

export default function ClienteCard({
  cliente,
  onView,
  onViewContracts,
  onViewBoletos,
  onViewInadimplencia,
  compact = false,
}) {
  if (!cliente) {
    return null;
  }

  const name =
    cliente.name ||
    cliente.full_name ||
    cliente.company_name ||
    "Cliente não informado";

  const document =
    cliente.document ||
    cliente.document_number;

  const status = getClientStatus(cliente);

  const contractsCount =
    cliente.contracts_count ??
    cliente.contracts?.length ??
    0;

  const boletosCount =
    cliente.boletos_count ??
    cliente.bills_count ??
    0;

  const overdueAmount =
    Number(cliente.overdue_amount || 0);

  const openAmount =
    Number(
      cliente.open_amount ??
      cliente.outstanding_amount ??
      0
    );

  const paidAmount =
    Number(cliente.paid_amount || 0);

  if (compact) {
    return (
      <article
        className="cliente-card cliente-card-compact"
        onClick={() => onView?.(cliente)}
      >
        <div className="cliente-card-identity">
          <div className="cliente-card-avatar">
            {getInitials(name)}
          </div>

          <div className="cliente-card-name">
            <strong>{name}</strong>

            <span>
              {maskDocument(document)}
            </span>
          </div>
        </div>

        <div className="cliente-card-compact-right">
          <span
            className={`cliente-card-status cliente-card-status-${status.toLowerCase()}`}
          >
            {getStatusLabel(status)}
          </span>

          <strong>
            {formatCurrency(
              overdueAmount || openAmount
            )}
          </strong>
        </div>
      </article>
    );
  }

  return (
    <article className="cliente-card">
      {/* Header */}

      <div className="cliente-card-header">

        <button
          type="button"
          className="cliente-card-identity"
          onClick={() => onView?.(cliente)}
        >
          <div className="cliente-card-avatar">
            {getInitials(name)}
          </div>

          <div className="cliente-card-name">
            <strong>{name}</strong>

            <span>
              {maskDocument(document)}
            </span>
          </div>
        </button>

        <span
          className={`cliente-card-status cliente-card-status-${status.toLowerCase()}`}
        >
          {getStatusLabel(status)}
        </span>

      </div>

      {/* Resumo financeiro */}

      <div className="cliente-card-financial">

        <div>
          <span>Total pago</span>

          <strong>
            {formatCurrency(paidAmount)}
          </strong>
        </div>

        <div>
          <span>Em aberto</span>

          <strong>
            {formatCurrency(openAmount)}
          </strong>
        </div>

        <div
          className={
            overdueAmount > 0
              ? "cliente-card-overdue"
              : ""
          }
        >
          <span>Em atraso</span>

          <strong>
            {formatCurrency(overdueAmount)}
          </strong>
        </div>

      </div>

      {/* Indicadores */}

      <div className="cliente-card-metrics">

        <button
          type="button"
          onClick={() =>
            onViewContracts?.(cliente)
          }
        >
          <span>Contratos</span>
          <strong>{contractsCount}</strong>
        </button>

        <button
          type="button"
          onClick={() =>
            onViewBoletos?.(cliente)
          }
        >
          <span>Boletos</span>
          <strong>{boletosCount}</strong>
        </button>

        {overdueAmount > 0 && (
          <button
            type="button"
            className="cliente-card-metric-danger"
            onClick={() =>
              onViewInadimplencia?.(cliente)
            }
          >
            <span>Inadimplência</span>
            <strong>
              {formatCurrency(overdueAmount)}
            </strong>
          </button>
        )}

      </div>

      {/* Footer */}

      <div className="cliente-card-footer">

        <span>
          Cliente desde{" "}
          {cliente.created_at
            ? new Date(
                cliente.created_at
              ).toLocaleDateString("pt-BR")
            : "-"}
        </span>

        <button
          type="button"
          onClick={() => onView?.(cliente)}
        >
          Ver detalhes
        </button>

      </div>
    </article>
  );
}