import React, { useState } from "react";
import {
  ArrowLeft,
  QrCode,
  Search,
  User,
  CircleDollarSign,
} from "lucide-react";

import "../../pages/Pix/Pix.css";

export default function PixEnviar({
  onBack,
  onBuscar,
  onLerQRCode,
  onContinuar,
}) {
  const [chave, setChave] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");

  const buscar = () => {
    if (onBuscar) onBuscar(chave);
  };

  const continuar = () => {
    if (onContinuar) {
      onContinuar({
        chave,
        valor,
        descricao,
      });
    }
  };

  return (
    <div className="pix-page">
      <div className="pix-header">
        <button className="pix-back" onClick={onBack}>
          <ArrowLeft size={22} />
        </button>

        <h2>Enviar Pix</h2>
      </div>

      <div className="pix-card">

        <label>Chave Pix</label>

        <div className="pix-input-icon">
          <Search size={18} />
          <input
            value={chave}
            onChange={(e) => setChave(e.target.value)}
            placeholder="CPF, CNPJ, Email, Telefone ou Chave Aleatória"
          />
        </div>

        <div className="pix-actions-inline">
          <button className="secondary" onClick={buscar}>
            <Search size={18} />
            Buscar
          </button>

          <button className="secondary" onClick={onLerQRCode}>
            <QrCode size={18} />
            Ler QRCode
          </button>
        </div>
      </div>

      <div className="pix-card">

        <label>Valor</label>

        <div className="pix-input-icon">
          <CircleDollarSign size={18} />

          <input
            type="number"
            placeholder="R$ 0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>

        <label>Descrição (opcional)</label>

        <textarea
          rows={4}
          placeholder="Adicionar mensagem..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      <div className="pix-card">

        <h3>Últimos destinatários</h3>

        <button className="pix-contact">
          <div className="pix-avatar">
            <User size={20} />
          </div>

          <div>
            <strong>João Silva</strong>
            <small>joao@email.com</small>
          </div>
        </button>

        <button className="pix-contact">
          <div className="pix-avatar">
            <User size={20} />
          </div>

          <div>
            <strong>Maria Oliveira</strong>
            <small>(11) 99999-0000</small>
          </div>
        </button>

      </div>

      <button
        className="pix-primary-button"
        onClick={continuar}
      >
        Continuar
      </button>
    </div>
  );
}
