import React from "react";
import "./BoletoStatus.css";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pendente",
    className: "status-pending",
  },
  PROCESSING: {
    label: "Processando",
    className: "status-processing",
  },
  OPEN: {
    label: "Em aberto",
    className: "status-open",
  },
  PAID: {
    label: "Pago",
    className: "status-paid",
  },
  OVERDUE: {
    label: "Vencido",
    className: "status-overdue",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "status-cancelled",
  },
  FAILED: {
    label: "Falhou",
    className: "status-failed",
  },
};

export default function BoletoStatus({ status }) {
  const normalizedStatus = String(status || "")
    .trim()
    .toUpperCase();

  const config = STATUS_CONFIG[normalizedStatus] || {
    label: "Desconhecido",
    className: "status-unknown",
  };

  return (
    <span className={`boleto-status ${config.className}`}>
      <span className="boleto-status-dot" />
      {config.label}
    </span>
  );
}