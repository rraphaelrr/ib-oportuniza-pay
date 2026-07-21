import React from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaUndo,
  FaExchangeAlt,

  FaMoneyCheckAlt,
  FaCreditCard,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import {
  
  FaPix,
  
} from "react-icons/fa6";
import {
  formatCurrency,
} from "../utils/formatCurrency";

import {
  formatRelativeDate,
} from "../utils/formatDate";

import "../pages/Extrato/Extrato.css";

function getIcon(categoria, tipo) {
  switch (categoria?.toLowerCase()) {
    case "pix":
      return <FaPix />;

    case "transferência":
    case "transferencia":
      return <FaExchangeAlt />;

    case "boleto":
      return <FaFileInvoiceDollar />;

    case "cartão":
    case "cartao":
      return <FaCreditCard />;

    default:
      if (tipo === "entrada") {
        return <FaArrowDown />;
      }

      if (tipo === "estorno") {
        return <FaUndo />;
      }

      return <FaArrowUp />;
  }
}

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "concluído":
    case "concluido":
      return "#16a34a";

    case "pendente":
      return "#f59e0b";

    case "cancelado":
      return "#dc2626";

    default:
      return "#2563eb";
  }
}

export default function MovimentoCard({
  movimento,
  onClick,
}) {
  const entrada =
    movimento.tipo === "entrada";

  return (
    <div
      className="movimento-card"
      onClick={() => onClick?.(movimento)}
    >
      <div className="movimento-left">
        <div
          className={`movimento-icon ${
            entrada
              ? "entrada"
              : movimento.tipo
                  ?.toLowerCase() ===
                "estorno"
              ? "estorno"
              : "saida"
          }`}
        >
          {getIcon(
            movimento.categoria,
            movimento.tipo
          )}
        </div>

        <div className="movimento-info">
          <h3>
            {movimento.descricao}
          </h3>

          <span>
            {movimento.favorecido}
          </span>

          <small>
            {formatRelativeDate(
              movimento.data
            )}
          </small>
        </div>
      </div>

      <div className="movimento-right">
        <strong
          className={
            entrada
              ? "valor-positivo"
              : "valor-negativo"
          }
        >
          {entrada ? "+" : "-"}{" "}
          {formatCurrency(
            movimento.valor
          )}
        </strong>

        <span className="categoria-chip">
          {movimento.categoria}
        </span>

        <small
          style={{
            color: getStatusColor(
              movimento.status
            ),
          }}
        >
          ● {movimento.status}
        </small>
      </div>
    </div>
  );
}