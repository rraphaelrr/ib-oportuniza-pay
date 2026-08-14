import React, { useMemo, useState } from "react";

import PagamentosTable from "../../components/boletos/PagamentosTable";
import DashboardLayout from "../../layout/DashboardLayout";

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
  if (!date) {
    return "-";
  }

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
  return String(
    pagamento.contract?.number ||
      pagamento.contract?.contract_number ||
      pagamento.contract_number ||
      pagamento.contract?.id ||
      "-",
  );
}

function getAmount(pagamento) {
  return Number(
    pagamento.amount ||
      pagamento.paid_amount ||
      pagamento.value ||
      pagamento.original_amount ||
      0,
  );
}

function getPaymentDate(pagamento) {
  return (
    pagamento.paid_at ||
    pagamento.payment_date ||
    pagamento.settled_at ||
    pagamento.created_at ||
    null
  );
}

function getBoletoNumber(pagamento) {
  return String(
    pagamento.boleto?.number ||
      pagamento.boleto_number ||
      pagamento.number ||
      pagamento.boleto_id ||
      pagamento.boleto?.id ||
      "",
  );
}

function getDocument(pagamento) {
  return String(
    pagamento.client?.document ||
      pagamento.payer?.document ||
      pagamento.customer?.document ||
      pagamento.client_document ||
      pagamento.payer_document ||
      "",
  );
}

function getPaymentMethod(pagamento) {
  return normalizeStatus(
    pagamento.method ||
      pagamento.payment_method ||
      pagamento.type ||
      pagamento.boleto?.payment_method ||
      "",
  );
}

function getPaymentDateTimestamp(pagamento) {
  const date = getPaymentDate(pagamento);

  if (!date) {
    return 0;
  }

  const timestamp = new Date(date).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getDaysDifference(date) {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  parsedDate.setHours(0, 0, 0, 0);

  return Math.floor(
    (today.getTime() - parsedDate.getTime()) /
      (1000 * 60 * 60 * 24),
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
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("30_DAYS");
  const [status, setStatus] = useState("ALL");
  const [method, setMethod] = useState("ALL");
  const [sortBy, setSortBy] = useState("DATE");

  const normalizedPagamentos = useMemo(() => {
    if (!Array.isArray(pagamentos)) {
      return [];
    }

    return pagamentos.map((pagamento) => ({
      ...pagamento,
      _amount: getAmount(pagamento),
      _paymentDate: getPaymentDate(pagamento),
      _paymentTimestamp: getPaymentDateTimestamp(pagamento),
    }));
  }, [pagamentos]);

  const filteredPagamentos = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    let result = normalizedPagamentos.filter((pagamento) => {
      /*
       * =====================================================
       * BUSCA
       * =====================================================
       */

      const clientName = getClientName(pagamento).toLowerCase();

      const contract = getContractNumber(pagamento).toLowerCase();

      const boletoNumber = getBoletoNumber(pagamento).toLowerCase();

      const document = getDocument(pagamento).toLowerCase();

      const paymentId = String(
        pagamento.id || "",
      ).toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        clientName.includes(normalizedSearch) ||
        contract.includes(normalizedSearch) ||
        boletoNumber.includes(normalizedSearch) ||
        document.includes(normalizedSearch) ||
        paymentId.includes(normalizedSearch);

      if (!matchesSearch) {
        return false;
      }

      /*
       * =====================================================
       * STATUS
       * =====================================================
       */

      const normalizedStatus = normalizeStatus(
        pagamento.status,
      );

      if (
        status !== "ALL" &&
        normalizedStatus !== status
      ) {
        return false;
      }

      /*
       * =====================================================
       * FORMA DE PAGAMENTO
       * =====================================================
       */

      const paymentMethod =
        getPaymentMethod(pagamento);

      if (
        method !== "ALL" &&
        paymentMethod !== method
      ) {
        return false;
      }

      /*
       * =====================================================
       * PERÍODO
       * =====================================================
       */

      if (period !== "ALL") {
        const daysDifference = getDaysDifference(
          pagamento._paymentDate,
        );

        /*
         * Se não existir uma data válida,
         * não conseguimos determinar o período.
         *
         * Nesse caso, mantemos o pagamento no resultado.
         */
        if (daysDifference !== null) {
          if (
            period === "TODAY" &&
            daysDifference !== 0
          ) {
            return false;
          }

          if (
            period === "7_DAYS" &&
            (daysDifference < 0 ||
              daysDifference > 7)
          ) {
            return false;
          }

          if (
            period === "30_DAYS" &&
            (daysDifference < 0 ||
              daysDifference > 30)
          ) {
            return false;
          }

          if (
            period === "90_DAYS" &&
            (daysDifference < 0 ||
              daysDifference > 90)
          ) {
            return false;
          }
        }
      }

      return true;
    });

    /*
     * =====================================================
     * ORDENAÇÃO
     * =====================================================
     */

    result.sort((a, b) => {
      if (sortBy === "VALUE") {
        return b._amount - a._amount;
      }

      if (sortBy === "CLIENT") {
        return getClientName(a).localeCompare(
          getClientName(b),
          "pt-BR",
        );
      }

      return (
        b._paymentTimestamp -
        a._paymentTimestamp
      );
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

  /*
   * =======================================================
   * RESUMO
   * =======================================================
   */

  const summary = useMemo(() => {
    const total = filteredPagamentos.reduce(
      (sum, pagamento) =>
        sum + Number(pagamento._amount || 0),
      0,
    );

    const count = filteredPagamentos.length;

    const clients = new Set(
      filteredPagamentos.map(
        (pagamento) =>
          pagamento.client?.id ||
          pagamento.payer?.id ||
          pagamento.customer?.id ||
          getClientName(pagamento),
      ),
    ).size;

    const average =
      count > 0 ? total / count : 0;

    const pending = filteredPagamentos.filter(
      (pagamento) =>
        [
          "PENDING",
          "PROCESSING",
          "PROVIDER_UNKNOWN",
        ].includes(
          normalizeStatus(pagamento.status),
        ),
    ).length;

    return {
      total,
      count,
      clients,
      average,
      pending,
    };
  }, [filteredPagamentos]);

  /*
   * =======================================================
   * LIMPAR FILTROS
   * =======================================================
   */

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

  /*
   * =======================================================
   * LOADING
   * =======================================================
   */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="pagamentos">
          <div className="pagamentos-loading">
            <div className="pagamentos-spinner" />

            <span>
              Carregando pagamentos...
            </span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <DashboardLayout>
      <div className="pagamentos">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="pagamentos-header">
          <div>
            <span className="pagamentos-eyebrow">
              Financeiro
            </span>

            <h1>Pagamentos</h1>

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
                onExport(filteredPagamentos)
              }
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
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
              <span>Total recebido</span>

              <strong>
                {formatCurrency(summary.total)}
              </strong>
            </div>
          </div>

          <div className="pagamentos-summary-card">
            <div className="pagamentos-summary-icon">
              #
            </div>

            <div>
              <span>Pagamentos</span>

              <strong>{summary.count}</strong>
            </div>
          </div>

          <div className="pagamentos-summary-card">
            <div className="pagamentos-summary-icon">
              C
            </div>

            <div>
              <span>Clientes</span>

              <strong>{summary.clients}</strong>
            </div>
          </div>

          <div className="pagamentos-summary-card">
            <div className="pagamentos-summary-icon">
              $
            </div>

            <div>
              <span>Ticket médio</span>

              <strong>
                {formatCurrency(summary.average)}
              </strong>
            </div>
          </div>

          <div
            className={
              summary.pending > 0
                ? "pagamentos-summary-card pagamentos-summary-warning"
                : "pagamentos-summary-card"
            }
          >
            <div className="pagamentos-summary-icon">
              !
            </div>

            <div>
              <span>Em processamento</span>

              <strong>{summary.pending}</strong>
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
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
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
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="pagamentos-filter">
            <label htmlFor="pagamentos-period">
              Período
            </label>

            <select
              id="pagamentos-period"
              value={period}
              onChange={(event) =>
                setPeriod(event.target.value)
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
            <label htmlFor="pagamentos-status">
              Status
            </label>

            <select
              id="pagamentos-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
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
            <label htmlFor="pagamentos-method">
              Forma
            </label>

            <select
              id="pagamentos-method"
              value={method}
              onChange={(event) =>
                setMethod(event.target.value)
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
            <label htmlFor="pagamentos-sort">
              Ordenar
            </label>

            <select
              id="pagamentos-sort"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
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
              onClick={clearFilters}
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
              <span>Total filtrado</span>

              <strong>
                {formatCurrency(summary.total)}
              </strong>
            </div>
          </div>

          {filteredPagamentos.length === 0 ? (
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
                  onClick={clearFilters}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <PagamentosTable
              pagamentos={filteredPagamentos}
              onViewPagamento={
                onViewPagamento
              }
              onViewBoleto={onViewBoleto}
              onViewClient={onViewClient}
              onViewContract={
                onViewContract
              }
            />
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}