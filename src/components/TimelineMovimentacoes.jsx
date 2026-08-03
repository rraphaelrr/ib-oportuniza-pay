import React from "react";

import MovimentoCard from "./MovimentoCard";

import { formatDate } from "../utils/formatDate";

import "../pages/Extrato/Extrato.css";

export default function TimelineMovimentacoes({
  movimentacoes = [],
  onSelect,
}) {
  console.log("Bateu aqui", movimentacoes);
  if (!movimentacoes.length) return null;

  const grupos = movimentacoes.reduce((acc, item) => {
    const key = formatDate(item.data);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);

    return acc;
  }, {});

  Object.values(grupos).forEach((itens) => {
    itens.sort((a, b) => new Date(b.data) - new Date(a.data));
  });

  const gruposOrdenados = Object.entries(grupos).sort(
    ([dataA], [dataB]) => new Date(dataB) - new Date(dataA),
  );

  return (
    <div className="timeline">
      {gruposOrdenados.map(([data, itens]) => (
        <div key={data} className="timeline-group">
          <div className="timeline-header">
            <div className="timeline-dot" />

            <h3 >{data}</h3>

            <div className="timeline-line" />
          </div>

          <div className="timeline-items">
            {itens.map((movimento) => (
              <MovimentoCard
                key={movimento.id}
                movimento={movimento}
                onClick={() => onSelect?.(movimento)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
