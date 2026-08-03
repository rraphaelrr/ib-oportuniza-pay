// src/components/pix/PixResumo.jsx

import React from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
} from "lucide-react";

export default function PixResumo({
  recebido = 96480,
  enviado = 41220,
  limite = 10000,
}) {
  const formatar = (valor) =>
    Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="pix-sidebar-card">
      <div className="pix-sidebar-header">
        <Wallet size={22} />
        <h3>Resumo Pix</h3>
      </div>

      <div className="pix-resumo-list">

        <div className="pix-resumo-item">
          <div className="pix-resumo-icon recebido">
            <ArrowDownCircle size={18} />
          </div>

          <div className="pix-resumo-info">
            <span>Recebido no mês</span>
            <strong>{formatar(recebido)}</strong>
          </div>
        </div>

        <div className="pix-resumo-item">
          <div className="pix-resumo-icon enviado">
            <ArrowUpCircle size={18} />
          </div>

          <div className="pix-resumo-info">
            <span>Enviado no mês</span>
            <strong>{formatar(enviado)}</strong>
          </div>
        </div>

        <div className="pix-resumo-item">
          <div className="pix-resumo-icon limite">
            <Wallet size={18} />
          </div>

          <div className="pix-resumo-info">
            <span>Limite diário</span>
            <strong>{formatar(limite)}</strong>
          </div>
        </div>

      </div>

      <div className="pix-status">
        <span className="status-dot"></span>
        Pix disponível 24 horas
      </div>
    </div>
  );
}