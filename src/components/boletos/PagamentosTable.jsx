import React from "react";

import "./PagamentosTable.css";

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

function formatDateTime(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getStatusLabel(status) {
  const labels = {
    SETTLED: "Liquidado",
    PAID: "Pago",
    CONFIRMED: "Confirmado",
    PENDING: "Pendente",
    FAILED: "Falhou",
    REFUNDED: "Estornado",
    REVERSED: "Estornado",
  };

  return labels[status] || status || "-";
}

export default function PagamentosTable({
  pagamentos = [],
  loading = false,
  onView,
  onViewClient,
  onViewContract,
  onViewBoleto,
  onViewInstallment,
  onViewReconciliation,
  emptyMessage =
    "Nenhum pagamento encontrado.",
}) {
  if (loading) {
    return (
      <div className="pagamentos-table-wrapper">
        <div className="pagamentos-table-loading">
          Carregando pagamentos...
        </div>
      </div>
    );
  }

  return (
    <div className="pagamentos-table-wrapper">

      <table className="pagamentos-table">

        <thead>
          <tr>

            <th>Data</th>

            <th>Cliente</th>

            <th>Contrato</th>

            <th>Boleto</th>

            <th>Parcela</th>

            <th>Valor</th>

            <th>Status</th>

            <th>Liquidação</th>

            <th>Ações</th>

          </tr>
        </thead>

        <tbody>

          {pagamentos.length === 0 ? (
            <tr>
              <td colSpan={9}>
                <div className="pagamentos-table-empty">
                  {emptyMessage}
                </div>
              </td>
            </tr>
          ) : (
            pagamentos.map((pagamento, index) => {

              const client =
                pagamento.client ||
                pagamento.customer ||
                pagamento.payer ||
                {};

              const contract =
                pagamento.contract || {};

              const installment =
                pagamento.installment ||
                pagamento.parcela ||
                {};

              const boleto =
                pagamento.boleto ||
                pagamento.bill ||
                {};

              const status =
                String(
                  pagamento.status ||
                  "PAID"
                ).toUpperCase();

              const paymentDate =
                pagamento.paid_at ||
                pagamento.payment_date ||
                pagamento.created_at;

              const settledAt =
                pagamento.settled_at ||
                pagamento.settlement_date;

              const amount =
                pagamento.amount ??
                pagamento.paid_amount ??
                0;

              return (
                <tr
                  key={
                    pagamento.id ||
                    pagamento.transaction_id ||
                    index
                  }
                >

                  {/* Data */}

                  <td>
                    <div className="pagamento-date">

                      <strong>
                        {formatDate(
                          paymentDate
                        )}
                      </strong>

                      <span>
                        {formatDateTime(
                          paymentDate
                        ).split(" ")[1] ||
                          ""}
                      </span>

                    </div>
                  </td>

                  {/* Cliente */}

                  <td>
                    <button
                      type="button"
                      className="pagamento-client"
                      onClick={() =>
                        onViewClient?.(
                          client,
                          pagamento
                        )
                      }
                    >
                      <strong>
                        {client.name ||
                          pagamento.client_name ||
                          "Cliente não informado"}
                      </strong>

                      {client.document && (
                        <span>
                          {client.document}
                        </span>
                      )}
                    </button>
                  </td>

                  {/* Contrato */}

                  <td>
                    {contract.id ||
                    contract.number ? (
                      <button
                        type="button"
                        className="pagamento-link"
                        onClick={() =>
                          onViewContract?.(
                            contract,
                            pagamento
                          )
                        }
                      >
                        #
                        {contract.number ||
                          contract.id}
                      </button>
                    ) : (
                      <span className="pagamento-muted">
                        -
                      </span>
                    )}
                  </td>

                  {/* Boleto */}

                  <td>
                    {boleto.id ||
                    boleto.number ? (
                      <button
                        type="button"
                        className="pagamento-link"
                        onClick={() =>
                          onViewBoleto?.(
                            boleto,
                            pagamento
                          )
                        }
                      >
                        {boleto.number ||
                          boleto.id}
                      </button>
                    ) : (
                      <span className="pagamento-muted">
                        -
                      </span>
                    )}
                  </td>

                  {/* Parcela */}

                  <td>
                    {installment.number ? (
                      <button
                        type="button"
                        className="pagamento-link"
                        onClick={() =>
                          onViewInstallment?.(
                            installment,
                            pagamento
                          )
                        }
                      >
                        {installment.number}ª
                      </button>
                    ) : (
                      <span className="pagamento-muted">
                        -
                      </span>
                    )}
                  </td>

                  {/* Valor */}

                  <td>
                    <strong className="pagamento-amount">
                      {formatCurrency(amount)}
                    </strong>

                    {pagamento.fee > 0 && (
                      <span className="pagamento-fee">
                        Taxa:{" "}
                        {formatCurrency(
                          pagamento.fee
                        )}
                      </span>
                    )}
                  </td>

                  {/* Status */}

                  <td>
                    <span
                      className={`pagamento-status pagamento-status-${status.toLowerCase()}`}
                    >
                      {getStatusLabel(
                        status
                      )}
                    </span>
                  </td>

                  {/* Liquidação */}

                  <td>
                    <div className="pagamento-settlement">

                      <strong>
                        {formatDate(
                          settledAt
                        )}
                      </strong>

                      {pagamento.provider && (
                        <span>
                          {pagamento.provider}
                        </span>
                      )}

                    </div>
                  </td>

                  {/* Ações */}

                  <td>
                    <div className="pagamento-actions">

                      <button
                        type="button"
                        onClick={() =>
                          onView?.(
                            pagamento
                          )
                        }
                      >
                        Ver
                      </button>

                      {onViewReconciliation && (
                        <button
                          type="button"
                          onClick={() =>
                            onViewReconciliation(
                              pagamento
                            )
                          }
                        >
                          Conciliação
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              );
            })
          )}

        </tbody>

      </table>
    </div>
  );
}