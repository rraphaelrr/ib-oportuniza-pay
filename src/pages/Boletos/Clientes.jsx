
import React, { useMemo, useState } from "react";

import ClienteCard from "../../components/boletos/ClienteCard";

import "./Clientes.css";

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getClientName(cliente) {
  return (
    cliente.name ||
    cliente.nome ||
    cliente.full_name ||
    "Cliente não informado"
  );
}

function getClientDocument(cliente) {
  return (
    cliente.document ||
    cliente.document_number ||
    cliente.cpf ||
    cliente.cnpj ||
    ""
  );
}

function getClientContracts(cliente) {
  return (
    cliente.contracts ||
    cliente.contratos ||
    []
  );
}

function getClientBoletos(cliente) {
  return (
    cliente.boletos ||
    cliente.bills ||
    []
  );
}

function getClientOverdue(cliente) {
  if (
    cliente.overdue_count != null
  ) {
    return Number(
      cliente.overdue_count
    );
  }

  if (
    cliente.inadimplent_count != null
  ) {
    return Number(
      cliente.inadimplent_count
    );
  }

  const boletos =
    getClientBoletos(cliente);

  return boletos.filter(
    (boleto) =>
      String(boleto.status || "")
        .toUpperCase() === "OVERDUE"
  ).length;
}

export default function Clientes({
  clientes = [],
  loading = false,

  onBack,
  onViewClient,
  onViewContract,
  onViewBoleto,
}) {
  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("ALL");

  const [sort, setSort] =
    useState("NAME");

  const filteredClientes =
    useMemo(() => {
      let result = [...clientes];

      // ------------------------------------------
      // BUSCA
      // ------------------------------------------

      const normalizedSearch =
        normalize(search);

      if (normalizedSearch) {
        result = result.filter(
          (cliente) => {
            const name =
              normalize(
                getClientName(
                  cliente
                )
              );

            const document =
              normalize(
                getClientDocument(
                  cliente
                )
              );

            const email =
              normalize(
                cliente.email
              );

            const id =
              normalize(
                cliente.id
              );

            return [
              name,
              document,
              email,
              id,
            ].some((value) =>
              value.includes(
                normalizedSearch
              )
            );
          }
        );
      }

      // ------------------------------------------
      // STATUS
      // ------------------------------------------

      if (status !== "ALL") {
        result = result.filter(
          (cliente) => {
            const overdue =
              getClientOverdue(
                cliente
              );

            const contracts =
              getClientContracts(
                cliente
              );

            const activeContracts =
              contracts.filter(
                (contract) =>
                  String(
                    contract.status ||
                      ""
                  ).toUpperCase() ===
                  "ACTIVE"
              ).length;

            if (
              status ===
              "OVERDUE"
            ) {
              return overdue > 0;
            }

            if (
              status ===
              "ACTIVE"
            ) {
              return (
                activeContracts >
                0
              );
            }

            if (
              status ===
              "REGULAR"
            ) {
              return (
                overdue === 0
              );
            }

            return true;
          }
        );
      }

      // ------------------------------------------
      // ORDENAÇÃO
      // ------------------------------------------

      result.sort(
        (a, b) => {
          if (sort === "NAME") {
            return getClientName(
              a
            ).localeCompare(
              getClientName(b),
              "pt-BR"
            );
          }

          if (
            sort ===
            "OVERDUE"
          ) {
            return (
              getClientOverdue(
                b
              ) -
              getClientOverdue(
                a
              )
            );
          }

          if (
            sort ===
            "CONTRACTS"
          ) {
            return (
              getClientContracts(
                b
              ).length -
              getClientContracts(
                a
              ).length
            );
          }

          return 0;
        }
      );

      return result;
    }, [
      clientes,
      search,
      status,
      sort,
    ]);

  const totalClientes =
    clientes.length;

  const totalInadimplentes =
    clientes.filter(
      (cliente) =>
        getClientOverdue(
          cliente
        ) > 0
    ).length;

  const totalRegulares =
    Math.max(
      totalClientes -
        totalInadimplentes,
      0
    );

  function handleClear() {
    setSearch("");
    setStatus("ALL");
    setSort("NAME");
  }

  function handleViewClient(
    cliente
  ) {
    onViewClient?.(cliente);
  }

  return (
    <div className="clientes">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="clientes-header">

        <div className="clientes-header-left">

          {onBack && (
            <button
              type="button"
              className="clientes-back"
              onClick={onBack}
              aria-label="Voltar"
              title="Voltar"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </button>
          )}

          <div>
            <h1>
              Clientes
            </h1>

            <p>
              Consulte clientes, contratos,
              cobranças e situação financeira.
            </p>
          </div>

        </div>

      </header>

      {/* =================================================
          INDICADORES
      ================================================= */}

      <section className="clientes-summary">

        <div className="clientes-summary-card">

          <span>
            Total de clientes
          </span>

          <strong>
            {totalClientes}
          </strong>

        </div>

        <div className="clientes-summary-card">

          <span>
            Clientes regulares
          </span>

          <strong>
            {totalRegulares}
          </strong>

        </div>

        <div className="clientes-summary-card clientes-summary-card-warning">

          <span>
            Com inadimplência
          </span>

          <strong>
            {totalInadimplentes}
          </strong>

        </div>

      </section>

      {/* =================================================
          FILTROS
      ================================================= */}

      <section className="clientes-filters">

        <div className="clientes-search">

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
            placeholder="Buscar por nome, CPF/CNPJ, e-mail..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}

        </div>

        <div className="clientes-filter-group">

          <label htmlFor="cliente-status">
            Situação
          </label>

          <select
            id="cliente-status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value
              )
            }
          >
            <option value="ALL">
              Todos
            </option>

            <option value="REGULAR">
              Regulares
            </option>

            <option value="ACTIVE">
              Com contratos ativos
            </option>

            <option value="OVERDUE">
              Com inadimplência
            </option>
          </select>

        </div>

        <div className="clientes-filter-group">

          <label htmlFor="cliente-sort">
            Ordenar por
          </label>

          <select
            id="cliente-sort"
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value
              )
            }
          >
            <option value="NAME">
              Nome
            </option>

            <option value="OVERDUE">
              Inadimplência
            </option>

            <option value="CONTRACTS">
              Número de contratos
            </option>
          </select>

        </div>

        {(search ||
          status !== "ALL" ||
          sort !== "NAME") && (
          <button
            type="button"
            className="clientes-clear"
            onClick={handleClear}
          >
            Limpar filtros
          </button>
        )}

      </section>

      {/* =================================================
          RESULTADOS
      ================================================= */}

      <div className="clientes-results-header">

        <span>
          {filteredClientes.length}{" "}
          {filteredClientes.length ===
          1
            ? "cliente encontrado"
            : "clientes encontrados"}
        </span>

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="clientes-loading">

          <div className="clientes-spinner" />

          <span>
            Carregando clientes...
          </span>

        </div>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        filteredClientes.length ===
          0 && (
          <div className="clientes-empty">

            <div className="clientes-empty-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />

                <circle
                  cx="9"
                  cy="7"
                  r="4"
                />

                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />

                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>

            <h2>
              Nenhum cliente encontrado
            </h2>

            <p>
              Tente alterar os filtros ou
              realizar uma nova busca.
            </p>

            {(search ||
              status !== "ALL") && (
              <button
                type="button"
                onClick={handleClear}
              >
                Limpar filtros
              </button>
            )}

          </div>
        )}

      {/* =================================================
          LISTA
      ================================================= */}

      {!loading &&
        filteredClientes.length >
          0 && (
          <section className="clientes-list">

            {filteredClientes.map(
              (cliente) => (
                <div
                  className="cliente-list-item"
                  key={cliente.id}
                >

                  <ClienteCard
                    cliente={cliente}
                    onClick={() =>
                      handleViewClient(
                        cliente
                      )
                    }
                  />

                  <div className="cliente-list-meta">

                    <div>
                      <span>
                        Contratos
                      </span>

                      <strong>
                        {
                          getClientContracts(
                            cliente
                          ).length
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Inadimplência
                      </span>

                      <strong
                        className={
                          getClientOverdue(
                            cliente
                          ) > 0
                            ? "cliente-list-overdue"
                            : ""
                        }
                      >
                        {
                          getClientOverdue(
                            cliente
                          )
                        }
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="cliente-list-details"
                      onClick={() =>
                        handleViewClient(
                          cliente
                        )
                      }
                    >
                      Ver detalhes

                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </button>

                  </div>

                </div>
              )
            )}

          </section>
        )}

    </div>
  );
}
