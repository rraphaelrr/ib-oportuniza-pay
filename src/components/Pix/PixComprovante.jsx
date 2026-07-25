import React from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Share2,
  Copy,
} from "lucide-react";

import "../../pages/Pix/Pix.css";

export default function PixComprovante({
  comprovante,
  onBack,
  onDownload,
  onShare,
}) {
  if (!comprovante) return null;

  const copiarId = () => {
    navigator.clipboard.writeText(comprovante.idTransacao || "");
  };

  const formatarValor = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="pix-page">

      <div className="pix-header">

        <button className="pix-back" onClick={onBack}>
          <ArrowLeft size={22} />
        </button>

        <h2>Comprovante Pix</h2>

      </div>

      <div className="pix-card comprovante">

        <CheckCircle2
          size={70}
          color="#0aa84f"
          style={{ marginBottom: 20 }}
        />

        <h2>Transferência realizada</h2>

        <div className="pix-comprovante-item">
          <span>Valor</span>
          <strong>{formatarValor(comprovante.valor)}</strong>
        </div>

        <div className="pix-comprovante-item">
          <span>Destinatário</span>
          <strong>{comprovante.nome}</strong>
        </div>

        <div className="pix-comprovante-item">
          <span>Chave Pix</span>
          <strong>{comprovante.chave}</strong>
        </div>

        <div className="pix-comprovante-item">
          <span>Instituição</span>
          <strong>{comprovante.banco}</strong>
        </div>

        <div className="pix-comprovante-item">
          <span>Descrição</span>
          <strong>{comprovante.descricao || "-"}</strong>
        </div>

        <div className="pix-comprovante-item">
          <span>Data</span>
          <strong>{comprovante.data}</strong>
        </div>

        <div className="pix-comprovante-item">
          <span>ID da Transação</span>

          <div className="pix-copy-field">
            <strong>{comprovante.idTransacao}</strong>

            <button onClick={copiarId}>
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div className="pix-comprovante-item">
          <span>E2E</span>
          <strong>{comprovante.e2e}</strong>
        </div>

        <div className="pix-actions-inline">

          <button
            className="secondary"
            onClick={() => onShare?.(comprovante)}
          >
            <Share2 size={18} />
            Compartilhar
          </button>

          <button
            className="secondary"
            onClick={() => onDownload?.(comprovante)}
          >
            <Download size={18} />
            Baixar PDF
          </button>

        </div>

      </div>

    </div>
  );
}