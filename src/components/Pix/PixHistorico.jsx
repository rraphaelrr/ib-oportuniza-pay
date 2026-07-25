import React, { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Search,
} from "lucide-react";

import "../../pages/Pix/Pix.css";

export default function PixHistorico({
  historico = [],
  onBack,
  onSelecionar,
}) {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("todos");

  const lista = useMemo(() => {
    return historico.filter((item) => {
      const nome = item.nome?.toLowerCase() || "";
      const descricao = item.descricao?.toLowerCase() || "";
      const texto = busca.toLowerCase();

      const okBusca =
        nome.includes(texto) ||
        descricao.includes(texto);

      const okTipo =
        tipo === "todos" ||
        item.tipo === tipo;

      return okBusca && okTipo;
    });
  }, [historico, busca, tipo]);

  const formatarValor = (valor) =>
    Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="pix-page">

      <div className="pix-header">

        <button
          className="pix-back"
          onClick={onBack}
        >
          <ArrowLeft size={22} />
        </button>

        <h2>Histórico Pix</h2>

      </div>

      <div className="pix-card">

        <div className="pix-input-icon">
          <Search size={18} />

          <input
            placeholder="Buscar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="entrada">Recebidos</option>
          <option value="saida">Enviados</option>
        </select>

      </div>

      <div className="pix-list">

        {lista.length === 0 && (
          <div className="pix-empty">
            Nenhuma movimentação encontrada.
          </div>
        )}

        {lista.map((item) => (
          <button
            key={item.id}
            className="pix-list-item"
            onClick={() => onSelecionar?.(item)}
          >

            <div
              className={`pix-icon ${
                item.tipo === "entrada"
                  ? "entrada"
                  : "saida"
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

              <small className="pix-date">
                <CalendarDays size={14} />
                {item.data}
              </small>

            </div>

            <div
              className={`pix-value ${
                item.tipo === "entrada"
                  ? "entrada"
                  : "saida"
              }`}
            >
              {item.tipo === "entrada" ? "+" : "-"}{" "}
              {formatarValor(item.valor)}
            </div>

          </button>
        ))}

      </div>

    </div>
  );
}