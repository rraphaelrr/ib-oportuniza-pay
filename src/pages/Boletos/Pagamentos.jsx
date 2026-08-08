import React, { useMemo, useState } from "react";

import PagamentosTable from "../../components/boletos/PagamentosTable";

import "./Pagamentos.css";

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

function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("pt-BR");
}

function normalizeStatus(status) {
  return String(status || "")
    .trim()
    .toUpperCase();
}

function getClientName(pagamento) {
  return (
    pagamento.client?.name ||
    pagamento.payer?.name ||
    pagamento.customer?.name ||
    pagamento.client_name ||
    pagamento.payer_name ||
    "Cliente não informado"
  );
}

function getContractNumber(pagamento) {
  return (
    pagamento.contract?.number ||
    pagamento.contract?.contract_number ||
    pagamento.contract_number ||
    pagamento.contract?.id ||
    "-"
  );
}

function getAmount(pagamento) {
  return Number(
    pagamento.amount ||
      pagamento.paid_amount ||
      pagamento.value ||
      0
  );
}

function getPaymentDate(pagamento) {
  return (
    pagamento.paid_at ||
    pagamento.payment_date ||
    pagamento.settled_at ||
    pagamento.created_at
  );
}

export default function Pagamentos({
  pagamentos = [],
  loading = false,

  onViewPagamento,
  onViewBoleto,
  onViewClient,
  onViewContract,

  onExport,
}) {
  const [search, setSearch] =
    useState("");

  const [period, setPeriod] =
    useState("30_DAYS");

  const [status, setStatus] =
    useState("ALL");

  const [method, setMethod] =
    useState("ALL");

  const [sortBy, setSortBy] =
    useState("DATE");

  const normalizedPagamentos =
    useMemo(() => {
      return pagamentos.map(
        (pagamento) => ({
          ...pagamento,
          _amount:
            getAmount(
              pagamento
            ),
          _paymentDate:
            getPaymentDate(
              pagamento
            ),
        })
      );
    }, [pagamentos]);

  const filteredPagamentos =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      const today =
        new Date();

      let result =
        normalizedPagamentos.filter(
          (pagamento) => {
            const clientName =
              getClientName(
                pagamento
              ).toLowerCase();

            const contract =
              getContractNumber(
                pagamento
              ).toLowerCase();

            const boletoNumber =
              String(
                pagamento.boleto?.number ||
                  pagamento.boleto_number ||
                  pagamento.number ||
                  pagamento.boleto_id ||
                  ""
              ).toLowerCase();

            const document =
              String(
                pagamento.client?.document ||
                  pagamento.payer?.document ||
                  pagamento.customer?.document ||
                  ""
              ).toLowerCase();

            const paymentId =
              String(
                pagamento.id ||
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
              ) ||
              paymentId.includes(
                normalizedSearch
              );

            if (!matchesSearch) {
              return false;
            }

            const normalizedStatus =
              normalizeStatus(
                pagamento.status
              );

            if (
              status !== "ALL" &&
              normalizedStatus !==
                status
            ) {
              return false;
            }

            const paymentMethod =
              normalizeStatus(
                pagamento.method ||
                  pagamento.payment_method ||
                  pagamento.type
              );

            if (
              method !== "ALL" &&
              paymentMethod !==
                method
            ) {
              return false;
            }

            if (period !== "ALL") {
              const paymentDate =
                pagamento._paymentDate
                  ? new Date(
                      pagamento._paymentDate
                    )
                  : null;

              if (
                paymentDate &&
                !Number.isNaN(
                  paymentDate.getTime()
                )
              ) {
                const difference =
                  Math.floor(
                    (
                      today.getTime() -
                      paymentDate.getTime()
                    ) /
                      (1000 *
                        60 *
                        60 *
                        24)
                  );

                if (
                  period === "TODAY" &&
                  difference !== 0
                ) {
                  return false;
                }

                if (
                  period === "7_DAYS" &&
                  difference > 7
                ) {
                  return false;
                }

                if (
                  period === "30_DAYS" &&
                  difference > 30
                ) {
                  return false;
                }

                if (
                  period === "90_DAYS" &&
                  difference > 90
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
            b._amount -
            a._amount
          );
        }

        if (sortBy === "CLIENT") {
          return getClientName(
            a
          ).localeCompare(
            getClientName(b),
            "pt-BR"
          );
        }

        const dateA =
          a._paymentDate
            ? new Date(
                a._paymentDate
              ).getTime()
            : 0;

        const dateB =
          b._paymentDate
            ? new Date(
                b._paymentDate
              ).getTime()
            : 0;

        return dateB - dateA;
      });

      return result;
    }, [
      normalizedPagamentos,
      search,
      period,
      status,
      method,
      sortBy,
    ]);

  const summary = useMemo(() => {
    const total =
      filteredPagamentos.reduce(
        (sum, pagamento) =>
          sum +
          pagamento._amount,
        0
      );

    const count =
      filteredPagamentos.length;

    const clients =
      new Set(
        filteredPagamentos.map(
          (pagamento) =>
            pagamento.client?.id ||
            pagamento.payer?.id ||
            pagamento.customer?.id ||
            getClientName(
              pagamento
            )
        )
      ).size;

    const average =
      count > 0
        ? total / count
        : 0;

    const pending =
      filteredPagamentos.filter(
        (pagamento) =>
          [
            "PENDING",
            "PROCESSING",
            "PROVIDER_UNKNOWN",
          ].includes(
            normalizeStatus(
              pagamento.status
            )
          )
      ).length;

    return {
      total,
      count,
      clients,
      average,
      pending,
    };
  }, [filteredPagamentos]);

  function clearFilters() {
    setSearch("");
    setPeriod("30_DAYS");
    setStatus("ALL");
    setMethod("ALL");
    setSortBy("DATE");
  }

  const hasFilters =
    search.trim() !== "" ||
    period !== "30_DAYS" ||
    status !== "ALL" ||
    method !== "ALL";

  if (loading) {
    return (
      <div className="pagamentos">

        <div className="pagamentos-loading">

          <div className="pagamentos-spinner" />

          <span>
            Carregando pagamentos...
          </span>

        </div>

      </div>
    );
  }

  return (
    <div className="pagamentos">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="pagamentos-header">

        <div>

          <span className="pagamentos-eyebrow">
            Financeiro
          </span>

          <h1>
            Pagamentos
          </h1>

          <p>
            Acompanhe os boletos pagos e os
            valores recebidos.
          </p>

        </div>

        {onExport && (
          <button
            type="button"
            className="pagamentos-export"
            onClick={() =>
              onExport(
                filteredPagamentos
              )
            }
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>

            Exportar
          </button>
        )}

      </header>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <section className="pagamentos-summary">

        <div className="pagamentos-summary-card">

          <div className="pagamentos-summary-icon">
            R$
          </div>

          <div>
            <span>
              Total recebido
            </span>

            <strong>
              {formatCurrency(
                summary.total
              )}
            </strong>
          </div>

        </div>

        <div className="pagamentos-summary-card">

          <div className="pagamentos-summary-icon">
            #
          </div>

          <div>
            <span>
              Pagamentos
            </span>

            <strong>
              {summary.count}
            </strong>
          </div>

        </div>

        <div className="pagamentos-summary-card">

          <div className="pagamentos-summary-icon">
            C
          </div>

          <div>
            <span>
              Clientes
            </span>

            <strong>
              {summary.clients}
            </strong>
          </div>

        </div>

        <div className="pagamentos-summary-card">

          <div className="pagamentos-summary-icon">
            $
          </div>

          <div>
            <span>
              Ticket médio
            </span>

            <strong>
              {formatCurrency(
                summary.average
              )}
            </strong>
          </div>

        </div>

        <div className="pagamentos-summary-card">

          <div className="pagamentos-summary-icon">
            !
          </div>

          <div>
            <span>
              Em processamento
            </span>

            <strong>
              {summary.pending}
            </strong>
          </div>

        </div>

      </section>

      {/* =================================================
          FILTERS
      ================================================= */}

      <section className="pagamentos-filters">

        <div className="pagamentos-search">

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
            placeholder="Buscar cliente, CPF/CNPJ, contrato, boleto..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>

        <div className="pagamentos-filter">

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
            <option value="TODAY">
              Hoje
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

            <option value="ALL">
              Todo período
            </option>

          </select>

        </div>

        <div className="pagamentos-filter">

          <label>
            Status
          </label>

          <select
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

            <option value="PAID">
              Pagos
            </option>

            <option value="PENDING">
              Pendentes
            </option>

            <option value="PROCESSING">
              Processando
            </option>

            <option value="PROVIDER_UNKNOWN">
              Aguardando confirmação
            </option>

            <option value="FAILED">
              Falhos
            </option>

          </select>

        </div>

        <div className="pagamentos-filter">

          <label>
            Forma
          </label>

          <select
            value={method}
            onChange={(event) =>
              setMethod(
                event.target.value
              )
            }
          >
            <option value="ALL">
              Todas
            </option>

            <option value="BOLETO">
              Boleto
            </option>

            <option value="PIX">
              Pix
            </option>

            <option value="TRANSFER">
              Transferência
            </option>

          </select>

        </div>

        <div className="pagamentos-filter">

          <label>
            Ordenar
          </label>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value
              )
            }
          >
            <option value="DATE">
              Mais recentes
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
            className="pagamentos-clear"
            onClick={
              clearFilters
            }
          >
            Limpar
          </button>
        )}

      </section>

      {/* =================================================
          TABLE
      ================================================= */}

      <section className="pagamentos-table-card">

        <div className="pagamentos-table-header">

          <div>

            <h2>
              Histórico de pagamentos
            </h2>

            <p>
              {filteredPagamentos.length}{" "}
              pagamento(s) encontrado(s).
            </p>

          </div>

          <div className="pagamentos-table-total">

            <span>
              Total filtrado
            </span>

            <strong>
              {formatCurrency(
                summary.total
              )}
            </strong>

          </div>

        </div>

        {filteredPagamentos.length ===
        0 ? (
          <div className="pagamentos-empty">

            <div className="pagamentos-empty-icon">
              $
            </div>

            <h3>
              Nenhum pagamento encontrado
            </h3>

            <p>
              Não existem pagamentos para os
              filtros selecionados.
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
          <PagamentosTable
            pagamentos={
              filteredPagamentos
            }
            onViewPagamento={
              onViewPagamento
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
          />
        )}

      </section>

    </div>
  );
}
