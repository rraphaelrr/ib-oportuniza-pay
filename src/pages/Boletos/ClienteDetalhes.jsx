
import React, { useMemo, useState } from "react";

import ClienteCard from "../../components/boletos/ClienteCard";
import ContratoCard from "../../components/boletos/ContratoCard";
import BoletoStatus from "../../components/boletos/BoletoStatus";

import "./ClienteDetalhes.css";

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

function getClientName(cliente) {
  return (
    cliente?.name ||
    cliente?.nome ||
    cliente?.full_name ||
    "Cliente"
  );
}

function getContracts(cliente) {
  return (
    cliente?.contracts ||
    cliente?.contratos ||
    []
  );
}

function getBoletos(cliente) {
  return (
    cliente?.boletos ||
    cliente?.bills ||
    []
  );
}

function getPayments(cliente) {
  return (
    cliente?.payments ||
    cliente?.pagamentos ||
    []
  );
}

function getOverdueBoletos(boletos) {
  return boletos.filter(
    (boleto) =>
      String(boleto.status || "")
        .toUpperCase() === "OVERDUE"
  );
}

export default function ClienteDetalhes({
  cliente,
  loading = false,

  onBack,

  onViewContract,
  onViewBoleto,
  onViewPagamento,

  onGenerateBoleto,
}) {
  const [activeTab, setActiveTab] =
    useState("OVERVIEW");

  if (loading) {
    return (
      <div className="cliente-detalhes">
        <div className="cliente-detalhes-loading">
          <div className="cliente-detalhes-spinner" />

          <span>
            Carregando cliente...
          </span>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="cliente-detalhes">
        <div className="cliente-detalhes-empty">

          <h2>
            Cliente não encontrado
          </h2>

          <p>
            Não foi possível localizar os
            dados deste cliente.
          </p>

          <button
            type="button"
            onClick={onBack}
          >
            Voltar para clientes
          </button>

        </div>
      </div>
    );
  }

  const contratos =
    getContracts(cliente);

  const boletos =
    getBoletos(cliente);

  const pagamentos =
    getPayments(cliente);

  const overdueBoletos =
    getOverdueBoletos(
      boletos
    );

  const totalBoletoValue =
    boletos.reduce(
      (total, boleto) =>
        total +
        Number(
          boleto.amount || 0
        ),
      0
    );

  const totalPaid =
    pagamentos.reduce(
      (total, pagamento) =>
        total +
        Number(
          pagamento.amount || 0
        ),
      0
    );

  const totalOverdue =
    overdueBoletos.reduce(
      (total, boleto) =>
        total +
        Number(
          boleto.amount || 0
        ),
      0
    );

  const activeContracts =
    contratos.filter(
      (contrato) =>
        String(
          contrato.status || ""
        ).toUpperCase() ===
        "ACTIVE"
    );

  return (
    <div className="cliente-detalhes">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="cliente-detalhes-header">

        <div className="cliente-detalhes-header-left">

          <button
            type="button"
            className="cliente-detalhes-back"
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

          <div>
            <span className="cliente-detalhes-eyebrow">
              Cliente
            </span>

            <h1>
              {getClientName(cliente)}
            </h1>

            <p>
              Consulte contratos, cobranças,
              pagamentos e inadimplência.
            </p>
          </div>

        </div>

        {onGenerateBoleto && (
          <button
            type="button"
            className="cliente-detalhes-primary"
            onClick={() =>
              onGenerateBoleto(
                cliente
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
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>

            Gerar boleto
          </button>
        )}

      </header>

      {/* =================================================
          CLIENTE
      ================================================= */}

      <section className="cliente-detalhes-card">

        <ClienteCard
          cliente={cliente}
        />

      </section>

      {/* =================================================
          INDICADORES
      ================================================= */}

      <section className="cliente-detalhes-summary">

        <div className="cliente-detalhes-summary-card">

          <span>
            Contratos ativos
          </span>

          <strong>
            {activeContracts.length}
          </strong>

        </div>

        <div className="cliente-detalhes-summary-card">

          <span>
            Boletos
          </span>

          <strong>
            {boletos.length}
          </strong>

        </div>

        <div className="cliente-detalhes-summary-card">

          <span>
            Total em cobranças
          </span>

          <strong>
            {formatCurrency(
              totalBoletoValue
            )}
          </strong>

        </div>

        <div
          className={
            overdueBoletos.length > 0
              ? "cliente-detalhes-summary-card cliente-detalhes-summary-danger"
              : "cliente-detalhes-summary-card"
          }
        >

          <span>
            Em inadimplência
          </span>

          <strong>
            {formatCurrency(
              totalOverdue
            )}
          </strong>

        </div>

        <div className="cliente-detalhes-summary-card">

          <span>
            Total pago
          </span>

          <strong>
            {formatCurrency(
              totalPaid
            )}
          </strong>

        </div>

      </section>

      {/* =================================================
          TABS
      ================================================= */}

      <nav className="cliente-detalhes-tabs">

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
            activeTab === "CONTRACTS"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("CONTRACTS")
          }
        >
          Contratos
          <span>
            {contratos.length}
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

          {overdueBoletos.length >
            0 && (
            <span className="cliente-detalhes-tab-danger">
              {overdueBoletos.length}
            </span>
          )}
        </button>

      </nav>

      {/* =================================================
          VISÃO GERAL
      ================================================= */}

      {activeTab === "OVERVIEW" && (
        <div className="cliente-detalhes-content">

          {/* CONTRATOS */}

          <section className="cliente-detalhes-card">

            <div className="cliente-detalhes-card-header">

              <div>
                <h2>
                  Contratos
                </h2>

                <p>
                  Contratos vinculados ao cliente.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "CONTRACTS"
                  )
                }
              >
                Ver todos
              </button>

            </div>

            {contratos.length ===
            0 ? (
              <div className="cliente-detalhes-empty-inline">
                Nenhum contrato encontrado.
              </div>
            ) : (
              <div className="cliente-detalhes-contracts">

                {contratos
                  .slice(0, 3)
                  .map(
                    (contrato) => (
                      <ContratoCard
                        key={
                          contrato.id
                        }
                        contrato={
                          contrato
                        }
                        onClick={() =>
                          onViewContract?.(
                            contrato
                          )
                        }
                      />
                    )
                  )}

              </div>
            )}

          </section>

          {/* INADIMPLÊNCIA */}

          {overdueBoletos.length >
            0 && (
            <section className="cliente-detalhes-card cliente-detalhes-overdue-card">

              <div className="cliente-detalhes-card-header">

                <div>
                  <h2>
                    Inadimplência
                  </h2>

                  <p>
                    Cobranças vencidas deste cliente.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      "OVERDUE"
                    )
                  }
                >
                  Ver todas
                </button>

              </div>

              <div className="cliente-detalhes-overdue-list">

                {overdueBoletos
                  .slice(0, 5)
                  .map(
                    (boleto) => (
                      <button
                        type="button"
                        className="cliente-detalhes-boleto-row"
                        key={
                          boleto.id
                        }
                        onClick={() =>
                          onViewBoleto?.(
                            boleto
                          )
                        }
                      >

                        <div>
                          <strong>
                            {boleto.number
                              ? `#${boleto.number}`
                              : `Boleto ${boleto.id}`}
                          </strong>

                          <span>
                            Vencimento{" "}
                            {formatDate(
                              boleto.due_date
                            )}
                          </span>
                        </div>

                        <div>
                          <strong>
                            {formatCurrency(
                              boleto.amount
                            )}
                          </strong>

                          <BoletoStatus
                            status={
                              boleto.status
                            }
                          />
                        </div>

                      </button>
                    )
                  )}

              </div>

            </section>
          )}

          {/* BOLETOS RECENTES */}

          <section className="cliente-detalhes-card">

            <div className="cliente-detalhes-card-header">

              <div>
                <h2>
                  Boletos recentes
                </h2>

                <p>
                  Últimas cobranças emitidas.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "BOLETOS"
                  )
                }
              >
                Ver todos
              </button>

            </div>

            {boletos.length ===
            0 ? (
              <div className="cliente-detalhes-empty-inline">
                Nenhum boleto encontrado.
              </div>
            ) : (
              <div className="cliente-detalhes-boleto-list">

                {boletos
                  .slice(0, 5)
                  .map(
                    (boleto) => (
                      <button
                        type="button"
                        className="cliente-detalhes-boleto-row"
                        key={
                          boleto.id
                        }
                        onClick={() =>
                          onViewBoleto?.(
                            boleto
                          )
                        }
                      >

                        <div>
                          <strong>
                            {boleto.number
                              ? `#${boleto.number}`
                              : `Boleto ${boleto.id}`}
                          </strong>

                          <span>
                            Vencimento{" "}
                            {formatDate(
                              boleto.due_date
                            )}
                          </span>
                        </div>

                        <div>
                          <strong>
                            {formatCurrency(
                              boleto.amount
                            )}
                          </strong>

                          <BoletoStatus
                            status={
                              boleto.status
                            }
                          />
                        </div>

                      </button>
                    )
                  )}

              </div>
            )}

          </section>

        </div>
      )}

      {/* =================================================
          CONTRATOS
      ================================================= */}

      {activeTab === "CONTRACTS" && (
        <section className="cliente-detalhes-card">

          <div className="cliente-detalhes-card-header">

            <div>
              <h2>
                Contratos
              </h2>

              <p>
                Todos os contratos vinculados ao cliente.
              </p>
            </div>

          </div>

          {contratos.length ===
          0 ? (
            <div className="cliente-detalhes-empty-inline">
              Nenhum contrato encontrado.
            </div>
          ) : (
            <div className="cliente-detalhes-contracts">

              {contratos.map(
                (contrato) => (
                  <ContratoCard
                    key={contrato.id}
                    contrato={
                      contrato
                    }
                    onClick={() =>
                      onViewContract?.(
                        contrato
                      )
                    }
                  />
                )
              )}

            </div>
          )}

        </section>
      )}

      {/* =================================================
          BOLETOS
      ================================================= */}

      {activeTab === "BOLETOS" && (
        <section className="cliente-detalhes-card">

          <div className="cliente-detalhes-card-header">

            <div>
              <h2>
                Boletos
              </h2>

              <p>
                Histórico de cobranças do cliente.
              </p>
            </div>

          </div>

          {boletos.length ===
          0 ? (
            <div className="cliente-detalhes-empty-inline">
              Nenhum boleto encontrado.
            </div>
          ) : (
            <div className="cliente-detalhes-boleto-list">

              {boletos.map(
                (boleto) => (
                  <button
                    type="button"
                    className="cliente-detalhes-boleto-row"
                    key={
                      boleto.id
                    }
                    onClick={() =>
                      onViewBoleto?.(
                        boleto
                      )
                    }
                  >

                    <div>
                      <strong>
                        {boleto.number
                          ? `#${boleto.number}`
                          : `Boleto ${boleto.id}`}
                      </strong>

                      <span>
                        Vencimento{" "}
                        {formatDate(
                          boleto.due_date
                        )}
                      </span>
                    </div>

                    <div>
                      <strong>
                        {formatCurrency(
                          boleto.amount
                        )}
                      </strong>

                      <BoletoStatus
                        status={
                          boleto.status
                        }
                      />
                    </div>

                  </button>
                )
              )}

            </div>
          )}

        </section>
      )}

      {/* =================================================
          PAGAMENTOS
      ================================================= */}

      {activeTab === "PAYMENTS" && (
        <section className="cliente-detalhes-card">

          <div className="cliente-detalhes-card-header">

            <div>
              <h2>
                Pagamentos
              </h2>

              <p>
                Histórico de pagamentos realizados.
              </p>
            </div>

          </div>

          {pagamentos.length ===
          0 ? (
            <div className="cliente-detalhes-empty-inline">
              Nenhum pagamento encontrado.
            </div>
          ) : (
            <div className="cliente-detalhes-payment-list">

              {pagamentos.map(
                (pagamento) => (
                  <button
                    type="button"
                    className="cliente-detalhes-payment-row"
                    key={
                      pagamento.id
                    }
                    onClick={() =>
                      onViewPagamento?.(
                        pagamento
                      )
                    }
                  >

                    <div>
                      <strong>
                        {pagamento.description ||
                          pagamento.type ||
                          "Pagamento"}
                      </strong>

                      <span>
                        {formatDate(
                          pagamento.paid_at ||
                            pagamento.created_at
                        )}
                      </span>
                    </div>

                    <strong className="cliente-detalhes-payment-value">
                      {formatCurrency(
                        pagamento.amount
                      )}
                    </strong>

                  </button>
                )
              )}

            </div>
          )}

        </section>
      )}

      {/* =================================================
          INADIMPLÊNCIA
      ================================================= */}

      {activeTab === "OVERDUE" && (
        <section className="cliente-detalhes-card cliente-detalhes-overdue-card">

          <div className="cliente-detalhes-card-header">

            <div>
              <h2>
                Inadimplência
              </h2>

              <p>
                Cobranças vencidas e ainda não
                regularizadas.
              </p>
            </div>

          </div>

          <div className="cliente-detalhes-overdue-summary">

            <div>
              <span>
                Boletos vencidos
              </span>

              <strong>
                {overdueBoletos.length}
              </strong>
            </div>

            <div>
              <span>
                Valor em aberto
              </span>

              <strong>
                {formatCurrency(
                  totalOverdue
                )}
              </strong>
            </div>

          </div>

          {overdueBoletos.length ===
          0 ? (
            <div className="cliente-detalhes-empty-inline cliente-detalhes-empty-success">
              Nenhuma cobrança vencida para este
              cliente.
            </div>
          ) : (
            <div className="cliente-detalhes-boleto-list">

              {overdueBoletos.map(
                (boleto) => (
                  <button
                    type="button"
                    className="cliente-detalhes-boleto-row"
                    key={
                      boleto.id
                    }
                    onClick={() =>
                      onViewBoleto?.(
                        boleto
                      )
                    }
                  >

                    <div>
                      <strong>
                        {boleto.number
                          ? `#${boleto.number}`
                          : `Boleto ${boleto.id}`}
                      </strong>

                      <span>
                        Vencido desde{" "}
                        {formatDate(
                          boleto.due_date
                        )}
                      </span>
                    </div>

                    <div>
                      <strong className="cliente-detalhes-overdue-value">
                        {formatCurrency(
                          boleto.amount
                        )}
                      </strong>

                      <BoletoStatus
                        status={
                          boleto.status
                        }
                      />
                    </div>

                  </button>
                )
              )}

            </div>
          )}

        </section>
      )}

    </div>
  );
}
