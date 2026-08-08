import React, { useMemo, useState } from "react";

import InadimplenciaTable from "../../components/boletos/InadimplenciaTable";

import "./Inadimplencia.css";

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

function getDaysOverdue(boleto) {
  if (boleto.days_overdue !== undefined) {
    return Number(boleto.days_overdue) || 0;
  }

  if (!boleto.due_date) {
    return 0;
  }

  const dueDate = new Date(boleto.due_date);
  const today = new Date();

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const difference =
    today.getTime() - dueDate.getTime();

  return Math.max(
    0,
    Math.floor(
      difference / (1000 * 60 * 60 * 24)
    )
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

function getContractNumber(item) {
  return (
    item.contract?.number ||
    item.contract?.contract_number ||
    item.contract_number ||
    item.contract?.id ||
    "-"
  );
}

function getBoletoAmount(item) {
  return Number(
    item.amount ||
      item.value ||
      item.original_amount ||
      0
  );
}

export default function Inadimplencia({
  boletos = [],
  loading = false,

  onViewBoleto,
  onViewClient,
  onViewContract,

  onContactClient,
  onRenegotiate,
}) {
  const [search, setSearch] =
    useState("");

  const [period, setPeriod] =
    useState("ALL");

  const [aging, setAging] =
    useState("ALL");

  const [sortBy, setSortBy] =
    useState("DAYS");

  const [selectedItems, setSelectedItems] =
    useState([]);

  const overdueBoletos = useMemo(() => {
    return boletos
      .filter((boleto) => {
        const status =
          normalizeStatus(
            boleto.status
          );

        return (
          status === "OVERDUE" ||
          getDaysOverdue(boleto) > 0
        );
      })
      .map((boleto) => ({
        ...boleto,
        days_overdue:
          getDaysOverdue(boleto),
      }));
  }, [boletos]);

  const filteredBoletos = useMemo(() => {
    const normalizedSearch =
      search
        .trim()
        .toLowerCase();

    let result =
      overdueBoletos.filter(
        (boleto) => {
          const clientName =
            getClientName(boleto)
              .toLowerCase();

          const contract =
            getContractNumber(boleto)
              .toLowerCase();

          const boletoNumber =
            String(
              boleto.number ||
                boleto.boleto_number ||
                boleto.id ||
                ""
            ).toLowerCase();

          const document =
            String(
              boleto.client?.document ||
                boleto.payer?.document ||
                boleto.customer?.document ||
                ""
            ).toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            clientName.includes(
              normalizedSearch
            ) ||
            contract.includes(
              normalizedSearch
            ) ||
            boletoNumber.includes(
              normalizedSearch
            ) ||
            document.includes(
              normalizedSearch
            );

          if (!matchesSearch) {
            return false;
          }

          const days =
            boleto.days_overdue;

          if (
            aging === "1_7" &&
            (days < 1 || days > 7)
          ) {
            return false;
          }

          if (
            aging === "8_30" &&
            (days < 8 || days > 30)
          ) {
            return false;
          }

          if (
            aging === "31_60" &&
            (days < 31 || days > 60)
          ) {
            return false;
          }

          if (
            aging === "61_90" &&
            (days < 61 || days > 90)
          ) {
            return false;
          }

          if (
            aging === "90_PLUS" &&
            days <= 90
          ) {
            return false;
          }

          if (period !== "ALL") {
            const createdAt =
              boleto.created_at ||
              boleto.due_date;

            if (createdAt) {
              const date =
                new Date(createdAt);

              const today =
                new Date();

              const diff =
                Math.floor(
                  (
                    today.getTime() -
                    date.getTime()
                  ) /
                    (1000 *
                      60 *
                      60 *
                      24)
                );

              if (
                period === "7_DAYS" &&
                diff > 7
              ) {
                return false;
              }

              if (
                period === "30_DAYS" &&
                diff > 30
              ) {
                return false;
              }

              if (
                period === "90_DAYS" &&
                diff > 90
              ) {
                return false;
              }
            }
          }

          return true;
        }
      );

    result.sort((a, b) => {
      if (sortBy === "VALUE") {
        return (
          getBoletoAmount(b) -
          getBoletoAmount(a)
        );
      }

      if (sortBy === "CLIENT") {
        return getClientName(a).localeCompare(
          getClientName(b),
          "pt-BR"
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

  const summary = useMemo(() => {
    const total =
      overdueBoletos.reduce(
        (sum, boleto) =>
          sum +
          getBoletoAmount(boleto),
        0
      );

    const totalClients =
      new Set(
        overdueBoletos.map(
          (boleto) =>
            boleto.client?.id ||
            boleto.payer?.id ||
            boleto.customer?.id ||
            getClientName(boleto)
        )
      ).size;

    const totalContracts =
      new Set(
        overdueBoletos.map(
          (boleto) =>
            boleto.contract?.id ||
            getContractNumber(boleto)
        )
      ).size;

    const critical =
      overdueBoletos.filter(
        (boleto) =>
          boleto.days_overdue > 90
      ).length;

    const averageDays =
      overdueBoletos.length
        ? Math.round(
            overdueBoletos.reduce(
              (sum, boleto) =>
                sum +
                Number(
                  boleto.days_overdue ||
                    0
                ),
              0
            ) /
              overdueBoletos.length
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

  function toggleSelection(id) {
    setSelectedItems((current) => {
      if (current.includes(id)) {
        return current.filter(
          (itemId) =>
            itemId !== id
        );
      }

      return [
        ...current,
        id,
      ];
    });
  }

  function toggleAll() {
    if (
      selectedItems.length ===
      filteredBoletos.length
    ) {
      setSelectedItems([]);
      return;
    }

    setSelectedItems(
      filteredBoletos.map(
        (boleto) => boleto.id
      )
    );
  }

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

  if (loading) {
    return (
      <div className="inadimplencia">

        <div className="inadimplencia-loading">

          <div className="inadimplencia-spinner" />

          <span>
            Carregando inadimplência...
          </span>

        </div>

      </div>
    );
  }

  return (
    <div className="inadimplencia">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="inadimplencia-header">

        <div>

          <span className="inadimplencia-eyebrow">
            Cobrança
          </span>

          <h1>
            Inadimplência
          </h1>

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
                    filteredBoletos.filter(
                      (boleto) =>
                        selectedItems.includes(
                          boleto.id
                        )
                    )
                  )
                }
              >
                Contatar clientes
              </button>
            )}

            {onRenegotiate && (
              <button
                type="button"
                className="inadimplencia-primary"
                onClick={() =>
                  onRenegotiate(
                    filteredBoletos.filter(
                      (boleto) =>
                        selectedItems.includes(
                          boleto.id
                        )
                    )
                  )
                }
              >
                Renegociar selecionados
              </button>
            )}

          </div>
        )}

      </header>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <section className="inadimplencia-summary">

        <div className="inadimplencia-summary-card">

          <div className="inadimplencia-summary-icon">
            R$
          </div>

          <div>
            <span>
              Valor em atraso
            </span>

            <strong>
              {formatCurrency(
                summary.total
              )}
            </strong>
          </div>

        </div>

        <div className="inadimplencia-summary-card">

          <div className="inadimplencia-summary-icon">
            C
          </div>

          <div>
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

          <div>
            <span>
              Contratos afetados
            </span>

            <strong>
              {summary.totalContracts}
            </strong>
          </div>

        </div>

        <div className="inadimplencia-summary-card">

          <div className="inadimplencia-summary-icon">
            D
          </div>

          <div>
            <span>
              Média de atraso
            </span>

            <strong>
              {summary.averageDays}{" "}
              dias
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

          <div className="inadimplencia-summary-icon">
            !
          </div>

          <div>
            <span>
              Mais de 90 dias
            </span>

            <strong>
              {summary.critical}
            </strong>
          </div>

        </div>

      </section>

      {/* =================================================
          FILTERS
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
              setSearch(
                event.target.value
              )
            }
          />

        </div>

        <div className="inadimplencia-filter">

          <label>
            Atraso
          </label>

          <select
            value={aging}
            onChange={(event) =>
              setAging(
                event.target.value
              )
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

          <label>
            Período
          </label>

          <select
            value={period}
            onChange={(event) =>
              setPeriod(
                event.target.value
              )
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

          <label>
            Ordenar por
          </label>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value
              )
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
            onClick={
              clearFilters
            }
          >
            Limpar
          </button>
        )}

      </section>

      {/* =================================================
          AGING
      ================================================= */}

      <section className="inadimplencia-aging">

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

          {[
            {
              key: "1_7",
              label: "1–7 dias",
            },
            {
              key: "8_30",
              label: "8–30 dias",
            },
            {
              key: "31_60",
              label: "31–60 dias",
            },
            {
              key: "61_90",
              label: "61–90 dias",
            },
            {
              key: "90_PLUS",
              label: "+90 dias",
            },
          ].map((item) => {
            const items =
              overdueBoletos.filter(
                (boleto) => {
                  const days =
                    boleto.days_overdue;

                  if (
                    item.key ===
                    "1_7"
                  ) {
                    return (
                      days >= 1 &&
                      days <= 7
                    );
                  }

                  if (
                    item.key ===
                    "8_30"
                  ) {
                    return (
                      days >= 8 &&
                      days <= 30
                    );
                  }

                  if (
                    item.key ===
                    "31_60"
                  ) {
                    return (
                      days >= 31 &&
                      days <= 60
                    );
                  }

                  if (
                    item.key ===
                    "61_90"
                  ) {
                    return (
                      days >= 61 &&
                      days <= 90
                    );
                  }

                  return days > 90;
                }
              );

            const value =
              items.reduce(
                (sum, boleto) =>
                  sum +
                  getBoletoAmount(
                    boleto
                  ),
                0
              );

            return (
              <button
                type="button"
                key={item.key}
                className="inadimplencia-aging-card"
                onClick={() =>
                  setAging(
                    item.key
                  )
                }
              >

                <span>
                  {item.label}
                </span>

                <strong>
                  {items.length}
                </strong>

                <small>
                  {formatCurrency(
                    value
                  )}
                </small>

              </button>
            );
          })}

        </div>

      </section>

      {/* =================================================
          TABLE
      ================================================= */}

      <section className="inadimplencia-table-card">

        <div className="inadimplencia-table-header">

          <div>

            <h2>
              Cobranças vencidas
            </h2>

            <p>
              {filteredBoletos.length}{" "}
              cobrança(s) encontrada(s).
            </p>

          </div>

          {selectedItems.length > 0 && (
            <span className="inadimplencia-selected">
              {selectedItems.length}{" "}
              selecionado(s)
            </span>
          )}

        </div>

        {filteredBoletos.length ===
        0 ? (
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
                onClick={
                  clearFilters
                }
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
                  checked={
                    filteredBoletos.length >
                      0 &&
                    selectedItems.length ===
                      filteredBoletos.length
                  }
                  onChange={
                    toggleAll
                  }
                />

                Selecionar todos

              </label>

            </div>

            <InadimplenciaTable
              boletos={
                filteredBoletos
              }
              selectedItems={
                selectedItems
              }
              onToggleSelection={
                toggleSelection
              }
              onViewBoleto={
                onViewBoleto
              }
              onViewClient={
                onViewClient
              }
              onViewContract={
                onViewContract
              }
              onContactClient={
                onContactClient
              }
              onRenegotiate={
                onRenegotiate
              }
            />

          </>
        )}

      </section>

    </div>
  );
}
