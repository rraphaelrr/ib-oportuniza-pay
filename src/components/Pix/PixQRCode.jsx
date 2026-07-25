import React from "react";
import {
  ArrowLeft,
  Copy,
  Download,
  Share2,
} from "lucide-react";
import QRCode from "react-qr-code";

import "../../pages/Pix/Pix.css";

export default function PixQRCode({
  payload,
  onBack,
  onCopy,
  onShare,
  onDownload,
}) {
  if (!payload) return null;

  const copiar = () => {
    navigator.clipboard.writeText(payload);

    if (onCopy) onCopy(payload);
  };

  return (
    <div className="pix-page">

      <div className="pix-header">
        <button className="pix-back" onClick={onBack}>
          <ArrowLeft size={22} />
        </button>

        <h2>QR Code Pix</h2>
      </div>

      <div className="pix-card qr-result">

        <QRCode
          value={payload}
          size={240}
          level="H"
        />

        <p className="pix-qrcode-text">
          Escaneie este QR Code para realizar o pagamento.
        </p>

        <textarea
          readOnly
          value={payload}
          rows={5}
        />

        <div className="pix-actions-inline">

          <button
            className="secondary"
            onClick={copiar}
          >
            <Copy size={18} />
            Copiar
          </button>

          <button
            className="secondary"
            onClick={() => onShare?.(payload)}
          >
            <Share2 size={18} />
            Compartilhar
          </button>

          <button
            className="secondary"
            onClick={() => onDownload?.(payload)}
          >
            <Download size={18} />
            Salvar
          </button>

        </div>

      </div>

    </div>
  );
}