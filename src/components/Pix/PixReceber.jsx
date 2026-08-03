import React, { useState } from "react";
import {
  DollarSign,
  MessageSquare,
  QrCode,
} from "lucide-react";

export default function PixReceber({
  onGerar,
  loading = false,
  qrCode,
  payload,
}) {
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (Number(valor) <= 0) {
      alert("Informe um valor maior que zero.");
      return;
    }

    try {
      await onGerar?.({
        valor,
        descricao,
      });

      setValor("");
      setDescricao("");
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar QR Code.");
    }
  }

  function copiarCodigo() {
    if (!payload) return;

    navigator.clipboard.writeText(payload);
    alert("Código Pix copiado!");
  }

  return (
    <>
      <form className="pix-form" onSubmit={handleSubmit}>
        <h2>Receber Pix</h2>

        <p className="pix-subtitle">
          Informe um valor para gerar um QR Code Pix e compartilhar com o
          pagador.
        </p>

        <div className="pix-field">
          <label>Valor</label>

          <div className="pix-input">
            <DollarSign size={18} />

            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="pix-field">
          <label>Descrição</label>

          <div className="pix-input">
            <MessageSquare size={18} />

            <input
              type="text"
              maxLength={140}
              placeholder="Ex.: Pagamento de serviço"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
        </div>

        <button
          className="pix-primary-btn"
          type="submit"
          disabled={loading}
        >
          <QrCode size={18} />

          {loading
            ? "Gerando QR Code..."
            : "Gerar QR Code"}
        </button>
      </form>

      {qrCode && (
        <div className="pix-qrcode-result">
          <h3>QR Code Pix</h3>

          <img
            src={qrCode}
            alt="QR Code Pix"
            className="pix-qrcode-image"
          />

          <label>Código Copia e Cola</label>

          <textarea
            className="pix-copy-textarea"
            readOnly
            value={payload || ""}
          />

          <button
            type="button"
            className="pix-primary-btn"
            onClick={copiarCodigo}
          >
            Copiar código Pix
          </button>
        </div>
      )}
    </>
  );
}