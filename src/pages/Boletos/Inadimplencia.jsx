import React, { useMemo, useState } from "react";

import InadimplenciaTable from "../../components/boletos/InadimplenciaTable";
import DashboardLayout from "../../layout/DashboardLayout";

import "./Inadimplencia.css";

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "R$ 0,00";
  }

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function normalizeStatus(status) {
  return String(status || "")
    .trim()
    .toUpperCase();
}

function parseDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getDaysOverdue(boleto) {
  if (
    boleto.days_overdue !== undefined &&
    boleto.days_overdue !== null &&
    boleto.days_overdue !== ""
  ) {
    const days = Number(boleto.days_overdue);

    return Number.isNaN(days) ? 0 : Math.max(0, Math.floor(days));
  }

  if (!boleto.due_date) {
    return 0;
  }

  const dueDate = parseDate(boleto.due_date);

  if (!dueDate) {
    return 0;
  }

  const today = new Date();

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const difference = today.getTime() - dueDate.getTime();

  return Math.max(
    0,
    Math.floor(difference / (1000 * 60 * 60 * 24)),
  );
}

function getClientName(item) {
  return (
    item.client?.name ||
    item.payer?.name ||
    item.customer?.name ||
    item.client_name ||
    item.payer_name ||
    "Cliente não informado"
  );
}

function getClientDocument(item) {
  return (
    item.client?.document ||
    item.payer?.document ||
    item.customer?.document ||
    item.client_document ||
    item.payer_document ||
    ""
  );
}

function getContractNumber(item) {
  return String(
    item.contract?.number ||
      item.contract?.contract_number ||
      item.contract_number ||
      item.contract?.id ||
      "-",
  );
}

function getBoletoNumber(item) {
  return String(
    item.number ||
      item.boleto_number ||
      item.boletoNumber ||
      item.id ||
      "-",
  );
}

function getBoletoAmount(item) {
  const amount =
    item.amount ??
    item.value ??
    item.original_amount ??
    item.originalValue ??
    0;

  const number = Number(amount);

  return Number.isNaN(number) ? 0 : number;
}

function getItemId(item, index) {
  return (
    item.id ??
    item.boleto_id ??
    item.boletoId ??
    item.number ??
    item.boleto_number ??
    `boleto-${index}`
  );
}

function getPeriodDate(boleto) {
  return (
    boleto.due_date ||
    boleto.created_at ||
    boleto.createdAt ||
    boleto.issue_date ||
    boleto.issueDate ||
    null
  );
}

function getDaysFromDate(dateValue) {
  const date = parseDate(dateValue);

  if (!date) {
    return null;
  }

  const today = new Date();

  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const difference = today.getTime() - date.getTime();

  return Math.floor(
    difference / (1000 * 60 * 60 * 24),
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Inadimplencia({
  boletos = [],
  loading = false,

  onViewBoleto,
  onViewClient,
  onViewContract,

  onContactClient,
  onRenegotiate,
}) {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("ALL");
  const [aging, setAging] = useState("ALL");
  const [sortBy, setSortBy] = useState("DAYS");
  const [selectedItems, setSelectedItems] = useState([]);

  /* =========================================================
     BOLETOS VENCIDOS
  ========================================================= */

  const overdueBoletos = useMemo(() => {
    return boletos
      .map((boleto, index) => ({
        ...boleto,
        _selectionId: getItemId(boleto, index),
        days_overdue: getDaysOverdue(boleto),
      }))
      .filter((boleto) => {
        const status = normalizeStatus(boleto.status);

        return (
          status === "OVERDUE" ||
          status === "VENCIDO" ||
          status === "VENCIDA" ||
          boleto.days_overdue > 0
        );
      });
  }, [boletos]);

  /* =========================================================
     FILTROS
  ========================================================= */

  const filteredBoletos = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = overdueBoletos.filter((boleto) => {
      const clientName = getClientName(boleto).toLowerCase();

      const contract = getContractNumber(boleto).toLowerCase();

      const boletoNumber = getBoletoNumber(boleto).toLowerCase();

      const document = String(getClientDocument(boleto))
        .toLowerCase()
        .replace(/[.\-/\s]/g, "");

      const normalizedSearchWithoutFormatting =
        normalizedSearch.replace(/[.\-/\s]/g, "");

      const matchesSearch =
        !normalizedSearch ||
        clientName.includes(normalizedSearch) ||
        contract.includes(normalizedSearch) ||
        boletoNumber.includes(normalizedSearch) ||
        document.includes(normalizedSearchWithoutFormatting);

      if (!matchesSearch) {
        return false;
      }

      /* -------------------------------------------------------
         AGING
      ------------------------------------------------------- */

      const days = Number(boleto.days_overdue || 0);

      if (aging === "1_7" && (days < 1 || days > 7)) {
        return false;
      }

      if (aging === "8_30" && (days < 8 || days > 30)) {
        return false;
      }

      if (aging === "31_60" && (days < 31 || days > 60)) {
        return false;
      }

      if (aging === "61_90" && (days < 61 || days > 90)) {
        return false;
      }

      if (aging === "90_PLUS" && days <= 90) {
        return false;
      }

      /* -------------------------------------------------------
         PERÍODO
      ------------------------------------------------------- */

      if (period !== "ALL") {
        const periodDate = getPeriodDate(boleto);

        if (periodDate) {
          const diff = getDaysFromDate(periodDate);

          if (diff !== null) {
            if (period === "7_DAYS" && (diff < 0 || diff > 7)) {
              return false;
            }

            if (period === "30_DAYS" && (diff < 0 || diff > 30)) {
              return false;
            }

            if (period === "90_DAYS" && (diff < 0 || diff > 90)) {
              return false;
            }
          }
        }
      }

      return true;
    });

    /* -------------------------------------------------------
       ORDENAÇÃO
    ------------------------------------------------------- */

    result.sort((a, b) => {
      if (sortBy === "VALUE") {
        return getBoletoAmount(b) - getBoletoAmount(a);
      }

      if (sortBy === "CLIENT") {
        return getClientName(a).localeCompare(
          getClientName(b),
          "pt-BR",
          {
            sensitivity: "base",
          },
        );
      }

      return (
        Number(b.days_overdue || 0) -
        Number(a.days_overdue || 0)
      );
    });

    return result;
  }, [
    overdueBoletos,
    search,
    period,
    aging,
    sortBy,
  ]);

  /* =========================================================
     RESUMO
  ========================================================= */

  const summary = useMemo(() => {
    const total = overdueBoletos.reduce(
      (sum, boleto) =>
        sum + getBoletoAmount(boleto),
      0,
    );

    const totalClients = new Set(
      overdueBoletos.map(
        (boleto) =>
          boleto.client?.id ||
          boleto.payer?.id ||
          boleto.customer?.id ||
          getClientDocument(boleto) ||
          getClientName(boleto),
      ),
    ).size;

    const totalContracts = new Set(
      overdueBoletos.map(
        (boleto) =>
          boleto.contract?.id ||
          boleto.contract?.number ||
          boleto.contract?.contract_number ||
          boleto.contract_number ||
          getContractNumber(boleto),
      ),
    ).size;

    const critical = overdueBoletos.filter(
      (boleto) =>
        Number(boleto.days_overdue || 0) > 90,
    ).length;

    const averageDays = overdueBoletos.length
      ? Math.round(
          overdueBoletos.reduce(
            (sum, boleto) =>
              sum +
              Number(boleto.days_overdue || 0),
            0,
          ) / overdueBoletos.length,
        )
      : 0;

    return {
      total,
      totalClients,
      totalContracts,
      critical,
      averageDays,
    };
  }, [overdueBoletos]);

  /* =========================================================
     AGING
  ========================================================= */

  const agingSummary = useMemo(() => {
    const ranges = [
      {
        key: "1_7",
        label: "1–7 dias",
        className: "normal",
        filter: (days) => days >= 1 && days <= 7,
      },
      {
        key: "8_30",
        label: "8–30 dias",
        className: "warning",
        filter: (days) => days >= 8 && days <= 30,
      },
      {
        key: "31_60",
        label: "31–60 dias",
        className: "warning",
        filter: (days) => days >= 31 && days <= 60,
      },
      {
        key: "61_90",
        label: "61–90 dias",
        className: "danger",
        filter: (days) => days >= 61 && days <= 90,
      },
      {
        key: "90_PLUS",
        label: "+90 dias",
        className: "critical",
        filter: (days) => days > 90,
      },
    ];

    return ranges.map((range) => {
      const items = overdueBoletos.filter((boleto) =>
        range.filter(
          Number(boleto.days_overdue || 0),
        ),
      );

      const value = items.reduce(
        (sum, boleto) =>
          sum + getBoletoAmount(boleto),
        0,
      );

      return {
        ...range,
        count: items.length,
        value,
      };
    });
  }, [overdueBoletos]);

  /* =========================================================
     SELEÇÃO
  ========================================================= */

  function toggleSelection(id) {
    setSelectedItems((current) => {
      if (current.includes(id)) {
        return current.filter(
          (itemId) => itemId !== id,
        );
      }

      return [...current, id];
    });
  }

  function toggleAll() {
    const visibleIds = filteredBoletos.map(
      (boleto) => boleto._selectionId,
    );

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) =>
        selectedItems.includes(id),
      );

    if (allSelected) {
      setSelectedItems((current) =>
        current.filter(
          (id) => !visibleIds.includes(id),
        ),
      );

      return;
    }

    setSelectedItems((current) => {
      const next = new Set(current);

      visibleIds.forEach((id) => next.add(id));

      return Array.from(next);
    });
  }

  /* =========================================================
     ITENS SELECIONADOS
  ========================================================= */

  const selectedBoletoObjects = useMemo(() => {
    return overdueBoletos.filter((boleto) =>
      selectedItems.includes(boleto._selectionId),
    );
  }, [overdueBoletos, selectedItems]);

  /* =========================================================
     FILTROS
  ========================================================= */

  function clearFilters() {
    setSearch("");
    setPeriod("ALL");
    setAging("ALL");
    setSortBy("DAYS");
  }

  const hasFilters =
    search.trim() !== "" ||
    period !== "ALL" ||
    aging !== "ALL";

  const allVisibleSelected =
    filteredBoletos.length > 0 &&
    filteredBoletos.every((boleto) =>
      selectedItems.includes(boleto._selectionId),
    );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="inadimplencia">
          <div className="inadimplencia-loading">
            <div className="inadimplencia-spinner" />

            <span>
              Carregando inadimplência...
            </span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <DashboardLayout>
      <div className="inadimplencia">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="inadimplencia-header">
          <div className="inadimplencia-header-info">
            <span className="inadimplencia-eyebrow">
              Cobrança
            </span>

            <h1>Inadimplência</h1>

            <p>
              Acompanhe clientes, contratos e
              boletos vencidos.
            </p>
          </div>

          {selectedItems.length > 0 && (
            <div className="inadimplencia-header-actions">
              {onContactClient && (
                <button
                  type="button"
                  className="inadimplencia-secondary"
                  onClick={() =>
                    onContactClient(
                      selectedBoletoObjects,
                    )
                  }
                >
                  <span className="button-icon">
                    ↗
                  </span>

                  Contatar clientes
                </button>
              )}

              {onRenegotiate && (
                <button
                  type="button"
                  className="inadimplencia-primary"
                  onClick={() =>
                    onRenegotiate(
                      selectedBoletoObjects,
                    )
                  }
                >
                  <span className="button-icon">
                    $
                  </span>

                  Renegociar selecionados
                </button>
              )}
            </div>
          )}
        </header>

        {/* =================================================
            RESUMO
        ================================================= */}

        <section className="inadimplencia-summary">

          <div className="inadimplencia-summary-card">
            <div className="inadimplencia-summary-icon danger-icon">
              R$
            </div>

            <div className="inadimplencia-summary-content">
              <span>Valor em atraso</span>

              <strong>
                {formatCurrency(summary.total)}
              </strong>
            </div>
          </div>

          <div className="inadimplencia-summary-card">
            <div className="inadimplencia-summary-icon">
              C
            </div>

            <div className="inadimplencia-summary-content">
              <span>
                Clientes inadimplentes
              </span>

              <strong>
                {summary.totalClients}
              </strong>
            </div>
          </div>

          <div className="inadimplencia-summary-card">
            <div className="inadimplencia-summary-icon">
              CT
            </div>

            <div className="inadimplencia-summary-content">
              <span>Contratos afetados</span>

              <strong>
                {summary.totalContracts}
              </strong>
            </div>
          </div>

          <div className="inadimplencia-summary-card">
            <div className="inadimplencia-summary-icon">
              D
            </div>

            <div className="inadimplencia-summary-content">
              <span>Média de atraso</span>

              <strong>
                {summary.averageDays} dias
              </strong>
            </div>
          </div>

          <div
            className={
              summary.critical > 0
                ? "inadimplencia-summary-card inadimplencia-summary-danger"
                : "inadimplencia-summary-card"
            }
          >
            <div className="inadimplencia-summary-icon critical-icon">
              !
            </div>

            <div className="inadimplencia-summary-content">
              <span>Mais de 90 dias</span>

              <strong>
                {summary.critical}
              </strong>
            </div>
          </div>

        </section>

        {/* =================================================
            FILTROS
        ================================================= */}

        <section className="inadimplencia-filters">

          <div className="inadimplencia-search">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path d="m20 20-4-4" />
            </svg>

            <input
              type="text"
              placeholder="Buscar cliente, CPF/CNPJ, contrato ou boleto..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="inadimplencia-filter">
            <label htmlFor="inadimplencia-aging">
              Atraso
            </label>

            <select
              id="inadimplencia-aging"
              value={aging}
              onChange={(event) =>
                setAging(event.target.value)
              }
            >
              <option value="ALL">
                Todos
              </option>

              <option value="1_7">
                1 a 7 dias
              </option>

              <option value="8_30">
                8 a 30 dias
              </option>

              <option value="31_60">
                31 a 60 dias
              </option>

              <option value="61_90">
                61 a 90 dias
              </option>

              <option value="90_PLUS">
                Mais de 90 dias
              </option>
            </select>
          </div>

          <div className="inadimplencia-filter">
            <label htmlFor="inadimplencia-period">
              Período
            </label>

            <select
              id="inadimplencia-period"
              value={period}
              onChange={(event) =>
                setPeriod(event.target.value)
              }
            >
              <option value="ALL">
                Todos
              </option>

              <option value="7_DAYS">
                Últimos 7 dias
              </option>

              <option value="30_DAYS">
                Últimos 30 dias
              </option>

              <option value="90_DAYS">
                Últimos 90 dias
              </option>
            </select>
          </div>

          <div className="inadimplencia-filter">
            <label htmlFor="inadimplencia-sort">
              Ordenar por
            </label>

            <select
              id="inadimplencia-sort"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
            >
              <option value="DAYS">
                Maior atraso
              </option>

              <option value="VALUE">
                Maior valor
              </option>

              <option value="CLIENT">
                Cliente
              </option>
            </select>
          </div>

          {hasFilters && (
            <button
              type="button"
              className="inadimplencia-clear"
              onClick={clearFilters}
            >
              Limpar
            </button>
          )}

        </section>

        {/* =================================================
            AGING
        ================================================= */}

        <section className="inadimplencia-aging-section">

          <div className="inadimplencia-aging-header">
            <div>
              <h2>
                Aging da inadimplência
              </h2>

              <p>
                Distribuição dos boletos vencidos
                por tempo de atraso.
              </p>
            </div>
          </div>

          <div className="inadimplencia-aging-grid">
            {agingSummary.map((item) => (
              <button
                type="button"
                key={item.key}
                className={`inadimplencia-aging-card ${item.className} ${
                  aging === item.key
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setAging(
                    aging === item.key
                      ? "ALL"
                      : item.key,
                  )
                }
              >
                <div className="aging-card-top">
                  <span>
                    {item.label}
                  </span>

                  {aging === item.key && (
                    <small className="aging-active">
                      Ativo
                    </small>
                  )}
                </div>

                <strong>
                  {item.count}
                </strong>

                <small className="aging-value">
                  {formatCurrency(item.value)}
                </small>
              </button>
            ))}
          </div>

        </section>

        {/* =================================================
            TABELA
        ================================================= */}

        <section className="inadimplencia-table-card">

          <div className="inadimplencia-table-header">
            <div>
              <h2>
                Cobranças vencidas
              </h2>

              <p>
                {filteredBoletos.length}{" "}
                cobrança
                {filteredBoletos.length !== 1
                  ? "s"
                  : ""}{" "}
                encontrada
                {filteredBoletos.length !== 1
                  ? "s"
                  : ""}
                .
              </p>
            </div>

            {selectedItems.length > 0 && (
              <span className="inadimplencia-selected">
                {selectedItems.length}{" "}
                selecionado
                {selectedItems.length !== 1
                  ? "s"
                  : ""}
              </span>
            )}
          </div>

          {filteredBoletos.length === 0 ? (
            <div className="inadimplencia-empty">
              <div className="inadimplencia-empty-icon">
                ✓
              </div>

              <h3>
                Nenhuma inadimplência encontrada
              </h3>

              <p>
                Não existem cobranças vencidas
                para os filtros selecionados.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="inadimplencia-select-all">
                <label>
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAll}
                  />

                  <span>
                    Selecionar todos
                  </span>
                </label>

                <span className="inadimplencia-visible-count">
                  {filteredBoletos.length}{" "}
                  cobrança
                  {filteredBoletos.length !== 1
                    ? "s"
                    : ""}
                </span>
              </div>

              <InadimplenciaTable
                boletos={filteredBoletos}
                selectedItems={selectedItems}
                onToggleSelection={
                  toggleSelection
                }
                onViewBoleto={onViewBoleto}
                onViewClient={onViewClient}
                onViewContract={
                  onViewContract
                }
                onContactClient={
                  onContactClient
                }
                onRenegotiate={onRenegotiate}
              />
            </>
          )}

        </section>

      </div>
    </DashboardLayout>
  );
}