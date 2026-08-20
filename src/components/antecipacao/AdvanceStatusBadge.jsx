import React from "react";

import "./AdvanceStatusBadge.css";

/**
 * Status possíveis da antecipação.
 *
 * A API pode evoluir e retornar novos status.
 * Por isso, existe um fallback para STATUS desconhecido.
 */

const STATUS_CONFIG = {
  DRAFT: {
    label: "Rascunho",
    className: "draft",
  },

  SUBMITTED: {
    label: "Enviada",
    className: "submitted",
  },

  UNDER_REVIEW: {
    label: "Em análise",
    className: "under-review",
  },

  ANALYZING: {
    label: "Em análise",
    className: "under-review",
  },

  OFFERED: {
    label: "Ofertas recebidas",
    className: "offered",
  },

  ACTIVE: {
    label: "Ativa",
    className: "active",
  },

  APPROVED: {
    label: "Aprovada",
    className: "approved",
  },

  REJECTED: {
    label: "Rejeitada",
    className: "rejected",
  },

  CANCELLED: {
    label: "Cancelada",
    className: "cancelled",
  },

  CANCELED: {
    label: "Cancelada",
    className: "cancelled",
  },

  COMPLETED: {
    label: "Concluída",
    className: "completed",
  },

  EXPIRED: {
    label: "Expirada",
    className: "expired",
  },
};

function normalizeStatus(status) {
  return String(status || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

export default function AdvanceStatusBadge({
  status,
  className = "",
  showDot = true,
}) {
  const normalizedStatus = normalizeStatus(status);

  const config = STATUS_CONFIG[normalizedStatus] || {
    label: normalizedStatus
      ? normalizedStatus
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase())
      : "Indefinido",
    className: "unknown",
  };

  return (
    <span
      className={`advance-status-badge advance-status-badge--${config.className} ${className}`.trim()}
      data-status={normalizedStatus || "UNKNOWN"}
    >
      {showDot && (
        <span
          className="advance-status-badge__dot"
          aria-hidden="true"
        />
      )}

      <span className="advance-status-badge__label">
        {config.label}
      </span>
    </span>
  );
}