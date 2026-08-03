import React, { useState } from "react";

import "./ComprovanteModal.css";

import { downloadReceiptPDF } from "../utils/generateReceipt";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";

import ComprovanteMovimento from "./ComprovanteMovimento";

export default function ComprovanteModal({ movimento, open, onClose }) {
  const [gerandoComprovante, setGerandoComprovante] = useState(false);

  if (!open || !movimento) {
    return null;
  }

  // ==========================
  // HELPERS
  // ==========================

  const isEntrada = movimento.tipo === "entrada";

  const valor = formatCurrency(movimento.valor ?? movimento.amount);

  const titulo = isEntrada ? "Entrada recebida" : "Pagamento realizado";

  const statusClass = isEntrada ? "status-icon entrada" : "status-icon saida";

  const statusIcon = isEntrada ? "+" : "-";

  // ==========================
  // EVENTOS
  // ==========================

  function handleDownload() {
    setGerandoComprovante(true);

    downloadReceiptPDF("comprovante-movimento", `comprovante-${movimento.id}`);

    setTimeout(() => {
      setGerandoComprovante(false);
    }, 1000);
  }

  // ==========================
  // RENDER
  // ==========================
console.log(movimento);
  return (
    <div className="comprovante-overlay">
      <div className="comprovante-modal">
        <div className="comprovante-header">
          <div>
            <h2>Comprovante</h2>
            <span>Oportuniza Pay</span>
          </div>

          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="comprovante-status">
          <div className={statusClass}>{statusIcon}</div>

          <div>
            <strong>{titulo}</strong>

            <p>{formatDate(movimento.data)}</p>
          </div>
        </div>

        <div className="comprovante-valor">
          <span>Valor</span>

          <strong>{valor}</strong>
        </div>

        <div className="comprovante-details">
          <Detail label="Descrição" value={movimento.descricao} />

          <Detail label="Tipo" value={movimento.tipo} />

          <Detail label="Identificador" value={movimento.id} />

          {movimento.nome && <Detail label="Cliente" value={movimento.nome} />}

          {movimento.chavePix && (
            <Detail label="Chave Pix" value={movimento.chavePix} />
          )}
        </div>

        <div className="comprovante-actions">
          <button
            className="btn-download"
            onClick={handleDownload}
            disabled={gerandoComprovante}
          >
            {gerandoComprovante
              ? "Gerando Comprovante..."
              : "Gerar Comprovante"}
          </button>
        </div>
      </div>

      {/* Área utilizada para gerar o PDF */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
        }}
      >
        <ComprovanteMovimento movimento={movimento} />
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>

      <strong>{value || "-"}</strong>
    </div>
  );
}
