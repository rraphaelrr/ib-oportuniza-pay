import React from "react";
import { FaFileInvoiceDollar, FaRedoAlt } from "react-icons/fa";

import "../pages/Extrato/Extrato.css";

export default function EmptyState({
  title = "Nenhuma movimentação encontrada",
  description = "Não encontramos movimentações para os filtros selecionados.",
  onClearFilters,
  onReload,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <FaFileInvoiceDollar />
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

      <div className="empty-actions">
        {onClearFilters && (
          <button
            className="btn btn-primary"
            onClick={onClearFilters}
          >
            Limpar filtros
          </button>
        )}

        {onReload && (
          <button
            className="btn btn-secondary"
            onClick={onReload}
          >
            <FaRedoAlt />
            Atualizar
          </button>
        )}
      </div>
    </div>
  );
}