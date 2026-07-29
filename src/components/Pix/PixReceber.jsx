import React, { useState } from "react";
import {
  ArrowLeft,
  Copy,
  Share2,
  Download,
  QrCode,
} from "lucide-react";

import QRCode from "react-qr-code";

import "../../pages/Pix/Pix.css";

export default function PixReceber({ onBack, onGerar }) {
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [chave, setChave] = useState("");
  const [payload, setPayload] = useState("");

  const gerar = () => {
    const codigo =
      onGerar?.({
        valor,
        descricao,
        chave,
      }) ||
      "00020126580014BR.GOV.BCB.PIX0114pix@teste.com5204000053039865406100.005802BR5920Oportuniza Pay6009Sao Paulo62070503***6304ABCD";

    setPayload(codigo);
  };

  const copiar = () => {
    navigator.clipboard.writeText(payload);
  };

  return (
    <div className="pix-page">

      <div className="pix-header">
        <button className="pix-back" onClick={onBack}>
          <ArrowLeft size={22} />
        </button>

        <h2 style={{color: "white"}}>Receber Pix</h2>
      </div>

      <div className="pix-card">

        <label>Valor (opcional)</label>

        <input
          type="number"
          placeholder="R$ 0,00"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <label>Descrição (opcional)</label>

        <textarea
          rows={3}
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <label>Selecionar chave (opcional)</label>

        <select
          value={chave}
          onChange={(e) => setChave(e.target.value)}
        >
          <option value="">Escolher automaticamente</option>
          <option value="cpf">CPF</option>
          <option value="telefone">Telefone</option>
          <option value="email">Email</option>
          <option value="aleatoria">Chave Aleatória</option>
        </select>

        <button
          className="pix-primary-button"
          onClick={gerar}
        >
          <QrCode size={18} />
          Gerar QRCode
        </button>

      </div>

      {payload && (
        <div className="pix-card qr-result">

          <QRCode
            value={payload}
            size={220}
          />

          <textarea
            readOnly
            value={payload}
            rows={4}
          />

          <div className="pix-actions-inline">

            <button
              className="secondary"
              onClick={copiar}
            >
              <Copy size={18} />
              Copiar
            </button>

            <button className="secondary">
              <Share2 size={18} />
              Compartilhar
            </button>

            <button className="secondary">
              <Download size={18} />
              Salvar
            </button>

          </div>

        </div>
      )}
    </div>
  );
}