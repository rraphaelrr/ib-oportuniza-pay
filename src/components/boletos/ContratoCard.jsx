import React from "react";

import "./ContratoCard.css";

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
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function getStatus(contract) {
  if (contract.status) {
    return String(contract.status).toUpperCase();
  }

  const overdue = Number(
    contract.overdue_amount || 0
  );

  if (overdue > 0) {
    return "OVERDUE";
  }

  return "ACTIVE";
}

function getStatusLabel(status) {
  const labels = {
    ACTIVE: "Ativo",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
    OVERDUE: "Em atraso",
    PENDING: "Pendente",
    SUSPENDED: "Suspenso",
  };

  return labels[status] || status;
}

export default function ContratoCard({
  contrato,
  onView,
  onViewClient,
  onViewInstallments,
  onViewBoletos,
  onViewInadimplencia,
  compact = false,
}) {
  if (!contrato) {
    return null;
  }

  const client =
    contrato.client ||
    contrato.customer ||
    contrato.payer ||
    {};

  const clientName =
    client.name ||
    contrato.client_name ||
    contrato.customer_name ||
    "Cliente não informado";

  const clientDocument =
    client.document ||
    contrato.client_document;

  const contractNumber =
    contrato.number ||
    contrato.contract_number ||
    contrato.id;

  const status = getStatus(contrato);

  const totalAmount = Number(
    contrato.total_amount ??
    contrato.amount ??
    0
  );

  const paidAmount = Number(
    contrato.paid_amount || 0
  );

  const openAmount = Number(
    contrato.open_amount ??
    contrato.outstanding_amount ??
    Math.max(totalAmount - paidAmount, 0)
  );

  const overdueAmount = Number(
    contrato.overdue_amount || 0
  );

  const installmentsCount =
    contrato.installments_count ??
    contrato.installments?.length ??
    0;

  const paidInstallments =
    contrato.paid_installments ?? 0;

  const overdueInstallments =
    contrato.overdue_installments ?? 0;

  const progress =
    totalAmount > 0
      ? Math.min(
          Math.round(
            (paidAmount / totalAmount) * 100
          ),
          100
        )
      : 0;

  if (compact) {
    return (
      <article
        className="contrato-card contrato-card-compact"
        onClick={() => onView?.(contrato)}
      >
        <div className="contrato-card-compact-main">
          <span className="contrato-card-compact-number">
            #{contractNumber}
          </span>

          <strong>{clientName}</strong>

          <small>
            {formatCurrency(totalAmount)}
          </small>
        </div>

        <span
          className={`contrato-card-status contrato-card-status-${status.toLowerCase()}`}
        >
          {getStatusLabel(status)}
        </span>
      </article>
    );
  }

  return (
    <article className="contrato-card">

      {/* Header */}

      <div className="contrato-card-header">

        <div className="contrato-card-title">

          <div className="contrato-card-icon">
            #
          </div>

          <div>
            <span>Contrato</span>

            <strong>
              #{contractNumber}
            </strong>
          </div>

        </div>

        <span
          className={`contrato-card-status contrato-card-status-${status.toLowerCase()}`}
        >
          {getStatusLabel(status)}
        </span>

      </div>

      {/* Cliente */}

      <button
        type="button"
        className="contrato-card-client"
        onClick={() => onViewClient?.(contrato)}
      >
        <div className="contrato-card-avatar">
          {getInitials(clientName)}
        </div>

        <div className="contrato-card-client-info">
          <span>Cliente</span>

          <strong>{clientName}</strong>

          {clientDocument && (
            <small>{clientDocument}</small>
          )}
        </div>
      </button>

      {/* Valor */}

      <div className="contrato-card-value">

        <div>
          <span>Valor contratado</span>

          <strong>
            {formatCurrency(totalAmount)}
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
              ? "contrato-card-overdue"
              : ""
          }
        >
          <span>Em atraso</span>

          <strong>
            {formatCurrency(overdueAmount)}
          </strong>
        </div>

      </div>

      {/* Progresso */}

      <div className="contrato-card-progress">

        <div className="contrato-card-progress-header">
          <span>Progresso financeiro</span>

          <strong>{progress}%</strong>
        </div>

        <div className="contrato-card-progress-track">
          <div
            className="contrato-card-progress-bar"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="contrato-card-progress-info">
          <span>
            {formatCurrency(paidAmount)} pagos
          </span>

          <span>
            {formatCurrency(openAmount)} restantes
          </span>
        </div>

      </div>

      {/* Parcelas */}

      <div className="contrato-card-installments">

        <button
          type="button"
          onClick={() =>
            onViewInstallments?.(contrato)
          }
        >
          <span>Parcelas</span>

          <strong>
            {installmentsCount}
          </strong>
        </button>

        <button
          type="button"
          onClick={() =>
            onViewInstallments?.(contrato)
          }
        >
          <span>Pagas</span>

          <strong className="contrato-card-paid">
            {paidInstallments}
          </strong>
        </button>

        <button
          type="button"
          className={
            overdueInstallments > 0
              ? "contrato-card-installment-danger"
              : ""
          }
          onClick={() =>
            onViewInadimplencia?.(contrato)
          }
        >
          <span>Em atraso</span>

          <strong>
            {overdueInstallments}
          </strong>
        </button>

      </div>

      {/* Datas */}

      <div className="contrato-card-dates">

        <div>
          <span>Início</span>

          <strong>
            {formatDate(
              contrato.start_date
            )}
          </strong>
        </div>

        <div>
          <span>Vencimento</span>

          <strong>
            {formatDate(
              contrato.end_date
            )}
          </strong>
        </div>

      </div>

      {/* Footer */}

      <div className="contrato-card-footer">

        <button
          type="button"
          onClick={() =>
            onViewBoletos?.(contrato)
          }
        >
          Ver boletos
        </button>

        <button
          type="button"
          onClick={() =>
            onView?.(contrato)
          }
        >
          Ver contrato
        </button>

      </div>

    </article>
  );
}