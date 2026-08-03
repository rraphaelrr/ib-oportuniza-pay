import React, { useMemo } from "react";
import QRCode from "react-qr-code";
import {
  Copy,
  QrCode,
  X,
} from "lucide-react";

export default function PixQRCodeModal({
  open,
  payload = "",
  valor,
  descricao,
  onClose,
}) {
  if (!open) return null;

  // Enquanto o backend não retorna o payload real,
  // gera um payload fictício apenas para apresentação.
  const qrPayload = useMemo(() => {
    if (payload && payload.trim() !== "") {
      return payload;
    }

    return JSON.stringify({
      tipo: "PIX_MOCK",
      valor: Number(valor || 0).toFixed(2),
      descricao: descricao || "",
      txid: crypto.randomUUID(),
      chave: "pix@empresa.com.br",
      data: new Date().toISOString(),
    });
  }, [payload, valor, descricao]);

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(qrPayload);
      alert("Código Pix copiado.");
    } catch {
      alert("Não foi possível copiar.");
    }
  }

  return (
   <div className="pix-modal-overlay">
  <div className="pix-modal">
    <button
      className="pix-modal-close"
      onClick={onClose}
    >
      <X size={20} />
    </button>

    <div className="pix-modal-header">
      <div className="pix-modal-icon">
        <QrCode size={26} />
      </div>

      <div>
        <h2>Receber Pix</h2>

        <p>
          Compartilhe este QR Code ou o código Pix abaixo.
        </p>
      </div>
    </div>

    <div className="pix-qrcode-box">
      <QRCode
        value={qrPayload}
        size={220}
      />
    </div>

    <div className="pix-info-grid">

      <div className="pix-info-card">
        <span>Valor</span>

        <strong>
          {Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </strong>
      </div>

      {descricao && (
        <div className="pix-info-card">
          <span>Descrição</span>

          <strong>{descricao}</strong>
        </div>
      )}

    </div>

    <div className="pix-copy-box">

      <label>Código Pix (Copia e Cola)</label>

      <textarea
        readOnly
        rows={4}
        value={qrPayload}
      />

      <button
        type="button"
        className="pix-primary-btn"
        onClick={copiarCodigo}
      >
        <Copy size={18} />

        Copiar código Pix
      </button>

    </div>

  </div>
</div>
  );
}