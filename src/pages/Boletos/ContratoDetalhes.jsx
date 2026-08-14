import React, { useState } from "react";
import ContratoCard from "../../components/boletos/ContratoCard";
import ParcelaTable from "../../components/boletos/ParcelaTable";
import BoletoStatus from "../../components/boletos/BoletoStatus";
import DashboardLayout from "../../layout/DashboardLayout";
import "./ContratoDetalhes.css";

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

function getContractNumber(contrato) {
  return (
    contrato?.number ||
    contrato?.contract_number ||
    contrato?.numero ||
    contrato?.id ||
    "-"
  );
}

function getClientName(contrato) {
  return (
    contrato?.client?.name ||
    contrato?.payer?.name ||
    contrato?.customer?.name ||
    contrato?.client_name ||
    "Cliente não informado"
  );
}

function getParcelas(contrato) {
  return contrato?.installments || contrato?.parcelas || [];
}

function getBoletos(contrato) {
  return contrato?.boletos || contrato?.bills || [];
}

function getPagamentos(contrato) {
  return contrato?.payments || contrato?.pagamentos || [];
}

function getOverdueBoletos(boletos) {
  return boletos.filter(
    (boleto) => normalizeStatus(boleto?.status) === "OVERDUE"
  );
}

function getBoletoLabel(boleto) {
  if (boleto?.number) {
    return `#${boleto.number}`;
  }

  if (boleto?.id) {
    return `Boleto ${boleto.id}`;
  }

  return "Boleto";
}

export default function ContratoDetalhes({
  contrato,
  loading = false,
  onBack,
  onViewClient,
  onViewBoleto,
  onViewPagamento,
  onGenerateBoleto,
  onGenerateBoletosLote,
  onRenegotiate,
}) {
  const [activeTab, setActiveTab] = useState("OVERVIEW");

  if (loading) {
    return (
      <DashboardLayout>
        <div className="contrato-detalhes">
          <div className="contrato-detalhes-loading">
            <div className="contrato-detalhes-spinner" />
            <span>Carregando contrato...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!contrato) {
    return (
      <DashboardLayout>
        <div className="contrato-detalhes">
          <div className="contrato-detalhes-empty">
            <div className="contrato-detalhes-empty-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5" />
                <path d="M12 16h.01" />
              </svg>
            </div>

            <h2>Contrato não encontrado</h2>

            <p>
              Não foi possível localizar os dados deste contrato.
            </p>

            {onBack && (
              <button
                type="button"
                className="contrato-detalhes-button"
                onClick={onBack}
              >
                Voltar
              </button>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const parcelas = getParcelas(contrato);
  const boletos = getBoletos(contrato);
  const pagamentos = getPagamentos(contrato);

  const overdueBoletos = getOverdueBoletos(boletos);

  const totalContract = Number(
    contrato?.amount ||
      contrato?.total_amount ||
      contrato?.contract_value ||
      0
  );

  const totalPaid = pagamentos.reduce(
    (total, pagamento) =>
      total + Number(pagamento?.amount || 0),
    0
  );

  const totalOverdue = overdueBoletos.reduce(
    (total, boleto) =>
      total + Number(boleto?.amount || 0),
    0
  );

  const totalOpen = boletos
    .filter((boleto) =>
      [
        "OPEN",
        "PENDING",
        "PROCESSING",
        "OVERDUE",
      ].includes(normalizeStatus(boleto?.status))
    )
    .reduce(
      (total, boleto) =>
        total + Number(boleto?.amount || 0),
      0
    );

  const paidBoletos = boletos.filter(
    (boleto) =>
      normalizeStatus(boleto?.status) === "PAID"
  );

  const activeInstallments = parcelas.filter(
    (parcela) =>
      !["PAID", "CANCELLED"].includes(
        normalizeStatus(parcela?.status)
      )
  );

  const contractStatus = normalizeStatus(
    contrato?.status
  );

  const client =
    contrato?.client ||
    contrato?.payer ||
    contrato?.customer;

  const paidPercentage =
    totalContract > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (totalPaid / totalContract) * 100
          )
        )
      : 0;

  function getContractStatusLabel() {
    switch (contractStatus) {
      case "ACTIVE":
        return "Ativo";

      case "CANCELLED":
        return "Cancelado";

      case "FINISHED":
        return "Finalizado";

      case "PENDING":
        return "Pendente";

      case "OVERDUE":
        return "Em atraso";

      default:
        return contrato?.status || "Não informado";
    }
  }

  return (
    <DashboardLayout>
      <div className="contrato-detalhes">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="contrato-detalhes-header">
          <div className="contrato-detalhes-header-left">
            <button
              type="button"
              className="contrato-detalhes-back"
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

            <div className="contrato-detalhes-header-main">
              <span className="contrato-detalhes-eyebrow">
                Contrato
              </span>

              <h1>
                #{getContractNumber(contrato)}
              </h1>

              <p>
                Gestão de parcelas, boletos,
                pagamentos e inadimplência.
              </p>
            </div>
          </div>

          <div className="contrato-detalhes-header-actions">
            {onGenerateBoletosLote && (
              <button
                type="button"
                className="contrato-detalhes-button"
                onClick={() =>
                  onGenerateBoletosLote(contrato)
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
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="2"
                  />
                  <path d="M8 9h8" />
                  <path d="M8 13h8" />
                  <path d="M8 17h5" />
                </svg>

                Gerar em lote
              </button>
            )}

            {onGenerateBoleto && (
              <button
                type="button"
                className="contrato-detalhes-button contrato-detalhes-button-primary"
                onClick={() =>
                  onGenerateBoleto(contrato)
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
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>

                Gerar boleto
              </button>
            )}
          </div>
        </header>

        {/* =================================================
            CONTRATO
        ================================================= */}

        <section className="contrato-detalhes-contract-card">
          <ContratoCard
            contrato={contrato}
            onClick={
              onViewClient
                ? () => onViewClient(client)
                : undefined
            }
          />
        </section>

        {/* =================================================
            CLIENTE
        ================================================= */}

        <section className="contrato-detalhes-client">
          <div className="contrato-detalhes-client-avatar">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="12"
                cy="8"
                r="4"
              />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </div>

          <div className="contrato-detalhes-client-info">
            <span>Cliente</span>

            <strong>
              {getClientName(contrato)}
            </strong>
          </div>

          {onViewClient && (
            <button
              type="button"
              onClick={() => onViewClient(client)}
              className="contrato-detalhes-client-button"
            >
              Ver cliente

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
          )}
        </section>

        {/* =================================================
            INDICADORES
        ================================================= */}

        <section className="contrato-detalhes-summary">

          <div className="contrato-detalhes-summary-card">
            <div className="contrato-detalhes-summary-icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                />
                <path d="M7 9h10" />
                <path d="M7 13h5" />
              </svg>
            </div>

            <div className="contrato-detalhes-summary-content">
              <span>Valor do contrato</span>

              <strong>
                {formatCurrency(totalContract)}
              </strong>
            </div>
          </div>

          <div className="contrato-detalhes-summary-card">
            <div className="contrato-detalhes-summary-icon contrato-detalhes-summary-icon-success">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <div className="contrato-detalhes-summary-content">
              <span>Total pago</span>

              <strong>
                {formatCurrency(totalPaid)}
              </strong>

              <small>
                {paidPercentage.toFixed(0)}% do contrato
              </small>
            </div>
          </div>

          <div className="contrato-detalhes-summary-card">
            <div className="contrato-detalhes-summary-icon contrato-detalhes-summary-icon-warning">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12h8" />
              </svg>
            </div>

            <div className="contrato-detalhes-summary-content">
              <span>Em aberto</span>

              <strong>
                {formatCurrency(totalOpen)}
              </strong>
            </div>
          </div>

          <div
            className={
              overdueBoletos.length > 0
                ? "contrato-detalhes-summary-card contrato-detalhes-summary-danger"
                : "contrato-detalhes-summary-card"
            }
          >
            <div className="contrato-detalhes-summary-icon contrato-detalhes-summary-icon-danger">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.3 3.5 2.6 17a2 2 0 0 0 1.75 3h15.3a2 2 0 0 0 1.75-3L13.7 3.5a2 2 0 0 0-3.4 0Z" />
              </svg>
            </div>

            <div className="contrato-detalhes-summary-content">
              <span>Inadimplência</span>

              <strong>
                {formatCurrency(totalOverdue)}
              </strong>

              <small>
                {overdueBoletos.length} boleto(s) vencido(s)
              </small>
            </div>
          </div>

          <div className="contrato-detalhes-summary-card">
            <div className="contrato-detalhes-summary-icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect
                  x="4"
                  y="3"
                  width="16"
                  height="18"
                  rx="2"
                />
                <path d="M8 7h8" />
                <path d="M8 11h8" />
                <path d="M8 15h5" />
              </svg>
            </div>

            <div className="contrato-detalhes-summary-content">
              <span>Parcelas restantes</span>

              <strong>
                {activeInstallments.length}
              </strong>

              <small>
                de {parcelas.length} parcela(s)
              </small>
            </div>
          </div>
        </section>

        {/* =================================================
            STATUS
        ================================================= */}

        <section className="contrato-detalhes-status-card">
          <div className="contrato-detalhes-status-item">
            <span>Situação do contrato</span>

            <strong>
              <span
                className={`contrato-detalhes-status contrato-detalhes-status-${contractStatus.toLowerCase()}`}
              >
                {getContractStatusLabel()}
              </span>
            </strong>
          </div>

          <div className="contrato-detalhes-status-item">
            <span>Início</span>

            <strong>
              {formatDate(
                contrato?.start_date ||
                  contrato?.started_at
              )}
            </strong>
          </div>

          <div className="contrato-detalhes-status-item">
            <span>Término</span>

            <strong>
              {formatDate(
                contrato?.end_date ||
                  contrato?.ended_at
              )}
            </strong>
          </div>

          <div className="contrato-detalhes-status-item">
            <span>Parcelas</span>

            <strong>
              {parcelas.length}
            </strong>
          </div>

          <div className="contrato-detalhes-status-item">
            <span>Boletos pagos</span>

            <strong>
              {paidBoletos.length}
            </strong>
          </div>
        </section>

        {/* =================================================
            ALERTA DE INADIMPLÊNCIA
        ================================================= */}

        {overdueBoletos.length > 0 && (
          <section className="contrato-detalhes-overdue-alert">
            <div className="contrato-detalhes-alert-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.3 3.5 2.6 17a2 2 0 0 0 1.75 3h15.3a2 2 0 0 0 1.75-3L13.7 3.5a2 2 0 0 0-3.4 0Z" />
              </svg>
            </div>

            <div className="contrato-detalhes-alert-content">
              <strong>
                Contrato com inadimplência
              </strong>

              <p>
                Existem {overdueBoletos.length} boleto(s)
                vencido(s), totalizando{" "}
                {formatCurrency(totalOverdue)}.
              </p>
            </div>

            <div className="contrato-detalhes-alert-actions">
              <button
                type="button"
                onClick={() =>
                  setActiveTab("OVERDUE")
                }
              >
                Ver inadimplência
              </button>

              {onRenegotiate && (
                <button
                  type="button"
                  className="contrato-detalhes-button-danger"
                  onClick={() =>
                    onRenegotiate(contrato)
                  }
                >
                  Renegociar
                </button>
              )}
            </div>
          </section>
        )}

        {/* =================================================
            TABS
        ================================================= */}

        <nav className="contrato-detalhes-tabs">
          <button
            type="button"
            className={
              activeTab === "OVERVIEW"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("OVERVIEW")
            }
          >
            Visão geral
          </button>

          <button
            type="button"
            className={
              activeTab === "INSTALLMENTS"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("INSTALLMENTS")
            }
          >
            Parcelas

            <span>
              {parcelas.length}
            </span>
          </button>

          <button
            type="button"
            className={
              activeTab === "BOLETOS"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("BOLETOS")
            }
          >
            Boletos

            <span>
              {boletos.length}
            </span>
          </button>

          <button
            type="button"
            className={
              activeTab === "PAYMENTS"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("PAYMENTS")
            }
          >
            Pagamentos

            <span>
              {pagamentos.length}
            </span>
          </button>

          <button
            type="button"
            className={
              activeTab === "OVERDUE"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("OVERDUE")
            }
          >
            Inadimplência

            {overdueBoletos.length > 0 && (
              <span className="contrato-detalhes-tab-danger">
                {overdueBoletos.length}
              </span>
            )}
          </button>
        </nav>

        {/* =================================================
            VISÃO GERAL
        ================================================= */}

        {activeTab === "OVERVIEW" && (
          <div className="contrato-detalhes-content">

            <section className="contrato-detalhes-card">
              <div className="contrato-detalhes-card-header">
                <div>
                  <h2>Resumo das parcelas</h2>

                  <p>
                    Acompanhamento das parcelas
                    deste contrato.
                  </p>
                </div>

                <button
                  type="button"
                  className="contrato-detalhes-card-link"
                  onClick={() =>
                    setActiveTab("INSTALLMENTS")
                  }
                >
                  Ver todas
                </button>
              </div>

              {parcelas.length === 0 ? (
                <div className="contrato-detalhes-empty-inline">
                  Nenhuma parcela encontrada.
                </div>
              ) : (
                <ParcelaTable
                  parcelas={parcelas.slice(0, 5)}
                  onViewBoleto={onViewBoleto}
                />
              )}
            </section>

            <section className="contrato-detalhes-card">
              <div className="contrato-detalhes-card-header">
                <div>
                  <h2>Boletos recentes</h2>

                  <p>
                    Últimas cobranças deste contrato.
                  </p>
                </div>

                <button
                  type="button"
                  className="contrato-detalhes-card-link"
                  onClick={() =>
                    setActiveTab("BOLETOS")
                  }
                >
                  Ver todos
                </button>
              </div>

              {boletos.length === 0 ? (
                <div className="contrato-detalhes-empty-inline">
                  Nenhum boleto encontrado.
                </div>
              ) : (
                <div className="contrato-detalhes-boleto-list">
                  {boletos.slice(0, 5).map((boleto) => (
                    <button
                      type="button"
                      className="contrato-detalhes-boleto-row"
                      key={boleto?.id}
                      onClick={() =>
                        onViewBoleto?.(boleto)
                      }
                    >
                      <div>
                        <strong>
                          {getBoletoLabel(boleto)}
                        </strong>

                        <span>
                          Vencimento{" "}
                          {formatDate(
                            boleto?.due_date
                          )}
                        </span>
                      </div>

                      <div className="contrato-detalhes-boleto-right">
                        <strong>
                          {formatCurrency(
                            boleto?.amount
                          )}
                        </strong>

                        <BoletoStatus
                          status={boleto?.status}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

          </div>
        )}

        {/* =================================================
            PARCELAS
        ================================================= */}

        {activeTab === "INSTALLMENTS" && (
          <section className="contrato-detalhes-card">
            <div className="contrato-detalhes-card-header">
              <div>
                <h2>Parcelas</h2>

                <p>
                  Todas as parcelas previstas
                  no contrato.
                </p>
              </div>
            </div>

            {parcelas.length === 0 ? (
              <div className="contrato-detalhes-empty-inline">
                Nenhuma parcela encontrada.
              </div>
            ) : (
              <ParcelaTable
                parcelas={parcelas}
                onViewBoleto={onViewBoleto}
              />
            )}
          </section>
        )}

        {/* =================================================
            BOLETOS
        ================================================= */}

        {activeTab === "BOLETOS" && (
          <section className="contrato-detalhes-card">
            <div className="contrato-detalhes-card-header">
              <div>
                <h2>Boletos</h2>

                <p>
                  Todas as cobranças emitidas
                  para o contrato.
                </p>
              </div>
            </div>

            {boletos.length === 0 ? (
              <div className="contrato-detalhes-empty-inline">
                Nenhum boleto encontrado.
              </div>
            ) : (
              <div className="contrato-detalhes-boleto-list">
                {boletos.map((boleto) => (
                  <button
                    type="button"
                    className="contrato-detalhes-boleto-row"
                    key={boleto?.id}
                    onClick={() =>
                      onViewBoleto?.(boleto)
                    }
                  >
                    <div>
                      <strong>
                        {getBoletoLabel(boleto)}
                      </strong>

                      <span>
                        Vencimento{" "}
                        {formatDate(
                          boleto?.due_date
                        )}
                      </span>
                    </div>

                    <div className="contrato-detalhes-boleto-right">
                      <strong>
                        {formatCurrency(
                          boleto?.amount
                        )}
                      </strong>

                      <BoletoStatus
                        status={boleto?.status}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =================================================
            PAGAMENTOS
        ================================================= */}

        {activeTab === "PAYMENTS" && (
          <section className="contrato-detalhes-card">
            <div className="contrato-detalhes-card-header">
              <div>
                <h2>Pagamentos</h2>

                <p>
                  Histórico de pagamentos
                  relacionados ao contrato.
                </p>
              </div>
            </div>

            {pagamentos.length === 0 ? (
              <div className="contrato-detalhes-empty-inline">
                Nenhum pagamento encontrado.
              </div>
            ) : (
              <div className="contrato-detalhes-payment-list">
                {pagamentos.map((pagamento) => (
                  <button
                    type="button"
                    className="contrato-detalhes-payment-row"
                    key={pagamento?.id}
                    onClick={() =>
                      onViewPagamento?.(
                        pagamento
                      )
                    }
                  >
                    <div>
                      <strong>
                        {pagamento?.description ||
                          pagamento?.type ||
                          "Pagamento"}
                      </strong>

                      <span>
                        {formatDate(
                          pagamento?.paid_at ||
                            pagamento?.created_at
                        )}
                      </span>
                    </div>

                    <strong>
                      {formatCurrency(
                        pagamento?.amount
                      )}
                    </strong>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =================================================
            INADIMPLÊNCIA
        ================================================= */}

        {activeTab === "OVERDUE" && (
          <section className="contrato-detalhes-card contrato-detalhes-overdue-card">
            <div className="contrato-detalhes-card-header">
              <div>
                <h2>Inadimplência</h2>

                <p>
                  Parcelas e boletos vencidos
                  deste contrato.
                </p>
              </div>

              {onRenegotiate &&
                overdueBoletos.length > 0 && (
                  <button
                    type="button"
                    className="contrato-detalhes-button contrato-detalhes-button-danger"
                    onClick={() =>
                      onRenegotiate(contrato)
                    }
                  >
                    Renegociar
                  </button>
                )}
            </div>

            <div className="contrato-detalhes-overdue-summary">
              <div>
                <span>Boletos vencidos</span>

                <strong>
                  {overdueBoletos.length}
                </strong>
              </div>

              <div>
                <span>Valor em aberto</span>

                <strong>
                  {formatCurrency(totalOverdue)}
                </strong>
              </div>
            </div>

            {overdueBoletos.length === 0 ? (
              <div className="contrato-detalhes-empty-inline contrato-detalhes-empty-success">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>

                Nenhuma cobrança vencida
                neste contrato.
              </div>
            ) : (
              <div className="contrato-detalhes-boleto-list">
                {overdueBoletos.map((boleto) => (
                  <button
                    type="button"
                    className="contrato-detalhes-boleto-row"
                    key={boleto?.id}
                    onClick={() =>
                      onViewBoleto?.(boleto)
                    }
                  >
                    <div>
                      <strong>
                        {getBoletoLabel(boleto)}
                      </strong>

                      <span>
                        Vencido desde{" "}
                        {formatDate(
                          boleto?.due_date
                        )}
                      </span>
                    </div>

                    <div className="contrato-detalhes-boleto-right">
                      <strong className="contrato-detalhes-overdue-value">
                        {formatCurrency(
                          boleto?.amount
                        )}
                      </strong>

                      <BoletoStatus
                        status={boleto?.status}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}