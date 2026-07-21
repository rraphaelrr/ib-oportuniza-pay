import React, { useState } from "react";
import "./ComprovanteModal.css";
import { downloadReceiptPDF } from "../utils/generateReceipt";
import ComprovanteMovimento from "./ComprovanteMovimento";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
export default function ComprovanteModal({ movimento, open, onClose }) {
  const [btnComprovante, setBtnComprovante] = useState(false)
  if (!open || !movimento) {
    return null;
  }

  function handleDownload() {
    setBtnComprovante(true)

    downloadReceiptPDF("comprovante-movimento", `comprovante-${movimento.id}`);
    setTimeout(() => {
      setBtnComprovante(false)
    }, 1000);
  }

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
          <div
            className={
              movimento.tipo === "entrada"
                ? "status-icon entrada"
                : "status-icon saida"
            }
          >
            {movimento.tipo === "entrada" ? "+" : "-"}
          </div>

          <div>
            <strong>
              {movimento.tipo === "entrada"
                ? "Entrada recebida"
                : "Pagamento realizado"}
            </strong>

            <p>{formatDate(movimento.data)}</p>
          </div>
        </div>

        <div className="comprovante-valor">
          <span>Valor</span>

          <strong>{formatCurrency(movimento.valor)}</strong>
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
          <button className="btn-download" onClick={handleDownload} disabled={btnComprovante}>
           {btnComprovante ? "Gerando Comprovante" : "Gerar Comprovante"}
          </button>
        </div>
      </div>
      <div style={{ position: "absolute", left: "-9999px" }}>
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
