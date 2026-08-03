import React from "react";
import { CheckCircle, ArrowLeft, Share2, Download, Copy } from "lucide-react";

export default function PixComprovante({
  comprovante,
  onBack,
  onShare,
  onDownload,
}) {
  if (!comprovante) {
    return null;
  }

  const formatarValor = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="pix-comprovante">
      <div className="pix-comprovante-header">
        <button className="pix-back-button" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>

        <h2>Comprovante Pix</h2>
      </div>

      <div className="pix-comprovante-card">
        <div className="pix-success">
          <CheckCircle size={55} />

          <h3>Pix enviado com sucesso</h3>

          <strong>{formatarValor(comprovante.valor)}</strong>
        </div>

        <div className="pix-info-list">
          <div className="pix-info-item">
            <span>Destinatário</span>
            <strong>{comprovante.nome || "-"}</strong>
          </div>

          <div className="pix-info-item">
            <span>Banco</span>
            <strong>{comprovante.banco || "-"}</strong>
          </div>

          <div className="pix-info-item">
            <span>Chave Pix</span>
            <strong>{comprovante.chave || "QR Code"}</strong>
          </div>

          <div className="pix-info-item">
            <span>Data</span>
            <strong>{comprovante.data || "-"}</strong>
          </div>

          <div className="pix-info-item">
            <span>ID da transação</span>
            <strong>{comprovante.idTransacao || "-"}</strong>
          </div>

          <div className="pix-info-item">
            <span>E2E</span>
            <strong className="pix-code">{comprovante.e2e || "-"}</strong>
          </div>
        </div>

        <div className="pix-comprovante-actions">
          <button className="pix-secondary-btn" onClick={onDownload}>
            <Download size={18} />
            Baixar PDF
          </button>

          <button className="pix-primary-btn" onClick={onShare}>
            <Share2 size={18} />
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
}
