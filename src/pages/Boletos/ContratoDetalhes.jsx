import React, { useMemo, useState } from "react";

import ContratoCard from "../../components/boletos/ContratoCard";
import ParcelaTable from "../../components/boletos/ParcelaTable";
import BoletoStatus from "../../components/boletos/BoletoStatus";

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
  return (
    contrato?.installments ||
    contrato?.parcelas ||
    []
  );
}

function getBoletos(contrato) {
  return (
    contrato?.boletos ||
    contrato?.bills ||
    []
  );
}

function getPagamentos(contrato) {
  return (
    contrato?.payments ||
    contrato?.pagamentos ||
    []
  );
}

function getOverdueBoletos(boletos) {
  return boletos.filter(
    (boleto) =>
      normalizeStatus(
        boleto.status
      ) === "OVERDUE"
  );
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
  const [activeTab, setActiveTab] =
    useState("OVERVIEW");

  if (loading) {
    return (
      <div className="contrato-detalhes">
        <div className="contrato-detalhes-loading">
          <div className="contrato-detalhes-spinner" />

          <span>
            Carregando contrato...
          </span>
        </div>
      </div>
    );
  }

  if (!contrato) {
    return (
      <div className="contrato-detalhes">
        <div className="contrato-detalhes-empty">

          <h2>
            Contrato não encontrado
          </h2>

          <p>
            Não foi possível localizar os
            dados deste contrato.
          </p>

          <button
            type="button"
            onClick={onBack}
          >
            Voltar
          </button>

        </div>
      </div>
    );
  }

  const parcelas =
    getParcelas(contrato);

  const boletos =
    getBoletos(contrato);

  const pagamentos =
    getPagamentos(contrato);

  const overdueBoletos =
    getOverdueBoletos(
      boletos
    );

  const totalContract =
    Number(
      contrato.amount ||
      contrato.total_amount ||
      contrato.contract_value ||
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

  const totalOpen =
    boletos
      .filter(
        (boleto) =>
          [
            "OPEN",
            "PENDING",
            "PROCESSING",
            "OVERDUE",
          ].includes(
            normalizeStatus(
              boleto.status
            )
          )
      )
      .reduce(
        (total, boleto) =>
          total +
          Number(
            boleto.amount || 0
          ),
        0
      );

  const paidBoletos =
    boletos.filter(
      (boleto) =>
        normalizeStatus(
          boleto.status
        ) === "PAID"
    );

  const activeInstallments =
    parcelas.filter(
      (parcela) =>
        ![
          "PAID",
          "CANCELLED",
        ].includes(
          normalizeStatus(
            parcela.status
          )
        )
    );

  const contractStatus =
    normalizeStatus(
      contrato.status
    );

  return (
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

          <div>
            <span className="contrato-detalhes-eyebrow">
              Contrato
            </span>

            <h1>
              #{getContractNumber(
                contrato
              )}
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
              className="contrato-detalhes-secondary"
              onClick={() =>
                onGenerateBoletosLote(
                  contrato
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
              className="contrato-detalhes-primary"
              onClick={() =>
                onGenerateBoleto(
                  contrato
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

        </div>

      </header>

      {/* =================================================
          CONTRATO
      ================================================= */}

      <section className="contrato-detalhes-contract-card">

        <ContratoCard
          contrato={contrato}
          onClick={() =>
            onViewClient?.(
              contrato.client ||
              contrato.payer ||
              contrato.customer
            )
          }
        />

      </section>

      {/* =================================================
          CLIENTE
      ================================================= */}

      <section className="contrato-detalhes-client">

        <div className="contrato-detalhes-client-icon">

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

        <div>

          <span>
            Cliente
          </span>

          <strong>
            {getClientName(
              contrato
            )}
          </strong>

        </div>

        {onViewClient && (
          <button
            type="button"
            onClick={() =>
              onViewClient(
                contrato.client ||
                contrato.payer ||
                contrato.customer
              )
            }
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

          <span>
            Valor do contrato
          </span>

          <strong>
            {formatCurrency(
              totalContract
            )}
          </strong>

        </div>

        <div className="contrato-detalhes-summary-card">

          <span>
            Total pago
          </span>

          <strong>
            {formatCurrency(
              totalPaid
            )}
          </strong>

        </div>

        <div className="contrato-detalhes-summary-card">

          <span>
            Em aberto
          </span>

          <strong>
            {formatCurrency(
              totalOpen
            )}
          </strong>

        </div>

        <div
          className={
            overdueBoletos.length > 0
              ? "contrato-detalhes-summary-card contrato-detalhes-summary-danger"
              : "contrato-detalhes-summary-card"
          }
        >

          <span>
            Inadimplência
          </span>

          <strong>
            {formatCurrency(
              totalOverdue
            )}
          </strong>

        </div>

        <div className="contrato-detalhes-summary-card">

          <span>
            Parcelas restantes
          </span>

          <strong>
            {activeInstallments.length}
          </strong>

        </div>

      </section>

      {/* =================================================
          STATUS
      ================================================= */}

      <section className="contrato-detalhes-status">

        <div>
          <span>
            Situação do contrato
          </span>

          <strong>
            {contractStatus === "ACTIVE"
              ? "Ativo"
              : contractStatus ===
                "CANCELLED"
              ? "Cancelado"
              : contractStatus ===
                "FINISHED"
              ? "Finalizado"
              : contrato.status ||
                "Não informado"}
          </strong>
        </div>

        <div>
          <span>
            Início
          </span>

          <strong>
            {formatDate(
              contrato.start_date ||
                contrato.started_at
            )}
          </strong>
        </div>

        <div>
          <span>
            Término
          </span>

          <strong>
            {formatDate(
              contrato.end_date ||
                contrato.ended_at
            )}
          </strong>
        </div>

        <div>
          <span>
            Parcelas
          </span>

          <strong>
            {parcelas.length}
          </strong>
        </div>

      </section>

      {/* =================================================
          ALERTA DE INADIMPLÊNCIA
      ================================================= */}

      {overdueBoletos.length >
        0 && (
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

          <div>

            <strong>
              Contrato com inadimplência
            </strong>

            <span>
              Existem{" "}
              {overdueBoletos.length}{" "}
              boleto(s) vencido(s),
              totalizando{" "}
              {formatCurrency(
                totalOverdue
              )}.
            </span>

          </div>

          <div className="contrato-detalhes-alert-actions">

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "OVERDUE"
                )
              }
            >
              Ver inadimplência
            </button>

            {onRenegotiate && (
              <button
                type="button"
                onClick={() =>
                  onRenegotiate(
                    contrato
                  )
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
            setActiveTab(
              "INSTALLMENTS"
            )
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

          {overdueBoletos.length >
            0 && (
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
                <h2>
                  Resumo das parcelas
                </h2>

                <p>
                  Acompanhamento das parcelas
                  deste contrato.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "INSTALLMENTS"
                  )
                }
              >
                Ver todas
              </button>

            </div>

            {parcelas.length ===
            0 ? (
              <div className="contrato-detalhes-empty-inline">
                Nenhuma parcela encontrada.
              </div>
            ) : (
              <ParcelaTable
                parcelas={parcelas.slice(
                  0,
                  5
                )}
                onViewBoleto={
                  onViewBoleto
                }
              />
            )}

          </section>

          <section className="contrato-detalhes-card">

            <div className="contrato-detalhes-card-header">

              <div>
                <h2>
                  Boletos recentes
                </h2>

                <p>
                  Últimas cobranças deste contrato.
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
              <div className="contrato-detalhes-empty-inline">
                Nenhum boleto encontrado.
              </div>
            ) : (
              <div className="contrato-detalhes-boleto-list">

                {boletos
                  .slice(0, 5)
                  .map(
                    (boleto) => (
                      <button
                        type="button"
                        className="contrato-detalhes-boleto-row"
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
          PARCELAS
      ================================================= */}

      {activeTab === "INSTALLMENTS" && (
        <section className="contrato-detalhes-card">

          <div className="contrato-detalhes-card-header">

            <div>
              <h2>
                Parcelas
              </h2>

              <p>
                Todas as parcelas previstas no contrato.
              </p>
            </div>

          </div>

          {parcelas.length ===
          0 ? (
            <div className="contrato-detalhes-empty-inline">
              Nenhuma parcela encontrada.
            </div>
          ) : (
            <ParcelaTable
              parcelas={parcelas}
              onViewBoleto={
                onViewBoleto
              }
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
              <h2>
                Boletos
              </h2>

              <p>
                Todas as cobranças emitidas para o contrato.
              </p>
            </div>

          </div>

          {boletos.length ===
          0 ? (
            <div className="contrato-detalhes-empty-inline">
              Nenhum boleto encontrado.
            </div>
          ) : (
            <div className="contrato-detalhes-boleto-list">

              {boletos.map(
                (boleto) => (
                  <button
                    type="button"
                    className="contrato-detalhes-boleto-row"
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
        <section className="contrato-detalhes-card">

          <div className="contrato-detalhes-card-header">

            <div>
              <h2>
                Pagamentos
              </h2>

              <p>
                Histórico de pagamentos relacionados ao contrato.
              </p>
            </div>

          </div>

          {pagamentos.length ===
          0 ? (
            <div className="contrato-detalhes-empty-inline">
              Nenhum pagamento encontrado.
            </div>
          ) : (
            <div className="contrato-detalhes-payment-list">

              {pagamentos.map(
                (pagamento) => (
                  <button
                    type="button"
                    className="contrato-detalhes-payment-row"
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

                    <strong>
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
        <section className="contrato-detalhes-card contrato-detalhes-overdue-card">

          <div className="contrato-detalhes-card-header">

            <div>
              <h2>
                Inadimplência
              </h2>

              <p>
                Parcelas e boletos vencidos deste contrato.
              </p>
            </div>

          </div>

          <div className="contrato-detalhes-overdue-summary">

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
            <div className="contrato-detalhes-empty-inline contrato-detalhes-empty-success">
              Nenhuma cobrança vencida neste contrato.
            </div>
          ) : (
            <div className="contrato-detalhes-boleto-list">

              {overdueBoletos.map(
                (boleto) => (
                  <button
                    type="button"
                    className="contrato-detalhes-boleto-row"
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
                      <strong className="contrato-detalhes-overdue-value">
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
