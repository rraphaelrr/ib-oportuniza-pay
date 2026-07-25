import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  Star,
  User,
  Trash2,
  Send,
} from "lucide-react";

import "../../pages/Pix/Pix.css";

export default function PixFavoritos({
  favoritos = [],
  onBack,
  onEnviar,
  onRemover,
}) {
  const [busca, setBusca] = useState("");

  const lista = useMemo(() => {
    return favoritos.filter((item) => {
      const nome = item.nome?.toLowerCase() || "";
      const chave = item.chave?.toLowerCase() || "";

      return (
        nome.includes(busca.toLowerCase()) ||
        chave.includes(busca.toLowerCase())
      );
    });
  }, [favoritos, busca]);

  return (
    <div className="pix-page">
      <div className="pix-header">
        <button className="pix-back" onClick={onBack}>
          <ArrowLeft size={22} />
        </button>

        <h2>Favoritos</h2>
      </div>

      <div className="pix-card">
        <div className="pix-input-icon">
          <Search size={18} />

          <input
            placeholder="Buscar favorito..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="pix-empty">
          Nenhum favorito encontrado.
        </div>
      ) : (
        <div className="pix-list">
          {lista.map((item) => (
            <div
              className="pix-list-item"
              key={item.id}
            >
              <div className="pix-avatar">
                {item.nome ? (
                  item.nome.charAt(0).toUpperCase()
                ) : (
                  <User size={18} />
                )}
              </div>

              <div className="pix-list-info">
                <strong>{item.nome}</strong>

                <small>{item.chave}</small>

                <small>{item.banco}</small>
              </div>

              <div className="pix-actions-small">

                <button
                  title="Enviar Pix"
                  onClick={() => onEnviar?.(item)}
                >
                  <Send size={18} />
                </button>

                <button
                  title="Remover"
                  onClick={() => onRemover?.(item)}
                >
                  <Trash2 size={18} />
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pix-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Star color="#ffb400" />

          <span>
            Os favoritos agilizam o envio de Pix para
            pessoas frequentes.
          </span>
        </div>
      </div>
    </div>
  );
}