import React from "react";
import "./ComprovanteMovimento.css";

import logo from "../assets/privateAssets/logo.png";
export default function ComprovanteMovimento({ movimento }) {
  return (
    <div id="comprovante-movimento" className="comprovante">
      <img src={logo} className="logo" alt="Logo" />

      <h1>Comprovante de Movimentação</h1>

      <div className="linha" />

      <div className="item">
        <span>Tipo</span>
        <strong>{movimento.tipo?.toUpperCase()}</strong>
      </div>

      <div className="item">
        <span>Descrição</span>
        <strong>{movimento.descricao}</strong>
      </div>

      <div className="item">
        <span>Nome</span>
        <strong>{movimento.nome}</strong>
      </div>

      <div className="item">
        <span>Valor</span>

        <strong>
          {Number(movimento.valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </strong>
      </div>

      <div className="item">
        <span>Data</span>

        <strong>{new Date(movimento.data).toLocaleDateString("pt-BR")}</strong>
      </div>

      <div className="item">
        <span>ID da movimentação</span>

        <strong>{movimento.id}</strong>
      </div>

      <div className="linha" />

      <p className="rodape">Este comprovante foi gerado eletronicamente.</p>
    </div>
  );
}
