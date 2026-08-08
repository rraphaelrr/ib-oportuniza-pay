import React from "react";
import "./BoletoFilters.css";

export default function BoletoFilters({
  search = "",
  status = "ALL",
  period = "ALL",
  onSearchChange,
  onStatusChange,
  onPeriodChange,
  onClear,
}) {
  const hasFilters =
    search.trim() !== "" ||
    status !== "ALL" ||
    period !== "ALL";

  return (
    <div className="boleto-filters">
      <div className="boleto-filters-search">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          type="text"
          placeholder="Buscar cliente, CPF/CNPJ ou boleto..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="boleto-filter-group">
        <label>Status</label>

        <select
          value={status}
          onChange={(e) => onStatusChange?.(e.target.value)}
        >
          <option value="ALL">Todos</option>
          <option value="PENDING">Pendentes</option>
          <option value="PROCESSING">Processando</option>
          <option value="OPEN">Em aberto</option>
          <option value="PAID">Pagos</option>
          <option value="OVERDUE">Vencidos</option>
          <option value="CANCELLED">Cancelados</option>
          <option value="FAILED">Falhos</option>
        </select>
      </div>

      <div className="boleto-filter-group">
        <label>Período</label>

        <select
          value={period}
          onChange={(e) => onPeriodChange?.(e.target.value)}
        >
          <option value="ALL">Todos</option>
          <option value="TODAY">Hoje</option>
          <option value="7_DAYS">Últimos 7 dias</option>
          <option value="30_DAYS">Últimos 30 dias</option>
          <option value="90_DAYS">Últimos 90 dias</option>
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          className="boleto-filter-clear"
          onClick={onClear}
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}