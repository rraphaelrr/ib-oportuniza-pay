// src/components/pix/PixHome.jsx

import React from "react";
import {
  QrCode,
  Send,
  Clock3,
  Star,
  KeyRound,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

import "../../pages/Pix/Pix.css";

export default function PixHome({
  onEnviar,
  onReceber,
  onHistorico,
  onFavoritos,
  onChaves,
  favoritos = [],
  historico = [],
}) {
  return (
    <div className="pix-home">
      <div className="pix-home-header">
        <h1>Área Pix</h1>
        <p>Envie, receba e gerencie suas transações Pix.</p>
      </div>

      <div className="pix-actions-grid">
        <button className="pix-action-card primary" onClick={onEnviar}>
          <Send size={28} />
          <span>Enviar</span>
        </button>

        <button className="pix-action-card success" onClick={onReceber}>
          <QrCode size={28} />
          <span>Receber</span>
        </button>

        <button className="pix-action-card" onClick={onHistorico}>
          <Clock3 size={28} />
          <span>Histórico</span>
        </button>

        <button className="pix-action-card" onClick={onChaves}>
          <KeyRound size={28} />
          <span>Minhas Chaves</span>
        </button>
      </div>

      <div className="pix-section">
        <div className="pix-section-title">
          <div>
            <Star size={18} />
            <span>Favoritos</span>
          </div>

          <button onClick={onFavoritos}>
            Ver todos
            <ChevronRight size={16} />
          </button>
        </div>

        {favoritos.length === 0 ? (
          <div className="pix-empty">
            Nenhum favorito cadastrado.
          </div>
        ) : (
          <div className="pix-list">
            {favoritos.slice(0, 5).map((item) => (
              <button
                key={item.id}
                className="pix-list-item"
                onClick={() => onEnviar?.(item)}
              >
                <div className="pix-avatar">
                  {item.nome?.charAt(0).toUpperCase()}
                </div>

                <div className="pix-list-info">
                  <strong>{item.nome}</strong>
                  <small>{item.chave}</small>
                </div>

                <ChevronRight size={18} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pix-section">
        <div className="pix-section-title">
          <div>
            <Clock3 size={18} />
            <span>Últimas movimentações</span>
          </div>

          <button onClick={onHistorico}>
            Ver histórico
            <ChevronRight size={16} />
          </button>
        </div>

        {historico.length === 0 ? (
          <div className="pix-empty">
            Nenhuma movimentação encontrada.
          </div>
        ) : (
          <div className="pix-list">
            {historico.slice(0, 5).map((item) => (
              <div className="pix-list-item" key={item.id}>
                <div
                  className={`pix-icon ${
                    item.tipo === "entrada" ? "entrada" : "saida"
                  }`}
                >
                  {item.tipo === "entrada" ? (
                    <ArrowDownLeft size={18} />
                  ) : (
                    <ArrowUpRight size={18} />
                  )}
                </div>

                <div className="pix-list-info">
                  <strong>{item.nome}</strong>

                  <small>{item.descricao}</small>
                </div>

                <div
                  className={`pix-value ${
                    item.tipo === "entrada" ? "entrada" : "saida"
                  }`}
                >
                  {item.tipo === "entrada" ? "+" : "-"}{" "}
                  {Number(item.valor).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}