import React from "react";

import BoletoStatus from "./BoletoStatus";

import "./ParcelaTable.css";

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

function getDaysLate(date) {
  if (!date) return 0;

  const dueDate = new Date(date);
  const today = new Date();

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const difference =
    today.getTime() - dueDate.getTime();

  return Math.max(
    Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ),
    0
  );
}

function getStatus(parcela) {
  if (parcela.status) {
    return String(parcela.status).toUpperCase();
  }

  if (parcela.payment?.paid_at) {
    return "PAID";
  }

  const dueDate =
    parcela.due_date ||
    parcela.dueDate;

  if (
    dueDate &&
    new Date(dueDate) < new Date()
  ) {
    return "OVERDUE";
  }

  return "OPEN";
}

function getStatusLabel(status) {
  const labels = {
    PAID: "Pago",
    OPEN: "Em aberto",
    PENDING: "Pendente",
    OVERDUE: "Em atraso",
    CANCELLED: "Cancelado",
    PROCESSING: "Processando",
  };

  return labels[status] || status;
}

function StatusBadge({ status }) {
  return (
    <span
      className={`parcela-status parcela-status-${status.toLowerCase()}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

export default function ParcelaTable({
  parcelas = [],
  loading = false,
  onView,
  onViewBoleto,
  onViewPayment,
  onViewInadimplencia,
  onGenerateBoleto,
  onSelect,
  selectedIds = [],
  selectable = false,
  emptyMessage = "Nenhuma parcela encontrada.",
}) {
  const allSelected =
    selectable &&
    parcelas.length > 0 &&
    parcelas.every((parcela) =>
      selectedIds.includes(parcela.id)
    );

  function handleSelectAll(event) {
    if (!onSelect) return;

    if (event.target.checked) {
      onSelect(
        parcelas.map((parcela) => parcela.id)
      );

      return;
    }

    onSelect([]);
  }

  function handleSelect(parcela) {
    if (!onSelect) return;

    const isSelected =
      selectedIds.includes(parcela.id);

    if (isSelected) {
      onSelect(
        selectedIds.filter(
          (id) => id !== parcela.id
        )
      );

      return;
    }

    onSelect([
      ...selectedIds,
      parcela.id,
    ]);
  }

  if (loading) {
    return (
      <div className="parcela-table-wrapper">
        <div className="parcela-table-loading">
          Carregando parcelas...
        </div>
      </div>
    );
  }

  return (
    <div className="parcela-table-wrapper">

      <table className="parcela-table">

        <thead>
          <tr>

            {selectable && (
              <th className="parcela-table-checkbox">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
            )}

            <th>Parcela</th>

            <th>Vencimento</th>

            <th>Valor</th>

            <th>Boleto</th>

            <th>Pagamento</th>

            <th>Status</th>

            <th className="parcela-table-actions">
              Ações
            </th>

          </tr>
        </thead>

        <tbody>

          {parcelas.length === 0 ? (
            <tr>
              <td
                colSpan={
                  selectable ? 8 : 7
                }
              >
                <div className="parcela-table-empty">
                  {emptyMessage}
                </div>
              </td>
            </tr>
          ) : (
            parcelas.map((parcela, index) => {

              const status =
                getStatus(parcela);

              const dueDate =
                parcela.due_date ||
                parcela.dueDate;

              const payment =
                parcela.payment;

              const boleto =
                parcela.boleto ||
                parcela.bill;

              const amount =
                parcela.amount ??
                parcela.value ??
                0;

              const daysLate =
                status === "OVERDUE"
                  ? getDaysLate(dueDate)
                  : 0;

              const isSelected =
                selectedIds.includes(
                  parcela.id
                );

              return (
                <tr
                  key={
                    parcela.id ||
                    parcela.number ||
                    index
                  }
                  className={
                    isSelected
                      ? "parcela-row-selected"
                      : ""
                  }
                >

                  {selectable && (
                    <td className="parcela-table-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          handleSelect(
                            parcela
                          )
                        }
                      />
                    </td>
                  )}

                  {/* Parcela */}

                  <td>

                    <button
                      type="button"
                      className="parcela-number"
                      onClick={() =>
                        onView?.(parcela)
                      }
                    >
                      {parcela.number ??
                        index + 1}ª parcela
                    </button>

                    {parcela.description && (
                      <span className="parcela-description">
                        {parcela.description}
                      </span>
                    )}

                  </td>

                  {/* Vencimento */}

                  <td>

                    <div className="parcela-date">

                      <strong>
                        {formatDate(
                          dueDate
                        )}
                      </strong>

                      {daysLate > 0 && (
                        <span className="parcela-late">
                          {daysLate}{" "}
                          {daysLate === 1
                            ? "dia"
                            : "dias"}{" "}
                          em atraso
                        </span>
                      )}

                    </div>

                  </td>

                  {/* Valor */}

                  <td>

                    <strong className="parcela-amount">
                      {formatCurrency(
                        amount
                      )}
                    </strong>

                    {parcela.discount > 0 && (
                      <span className="parcela-discount">
                        Desconto:{" "}
                        {formatCurrency(
                          parcela.discount
                        )}
                      </span>
                    )}

                  </td>

                  {/* Boleto */}

                  <td>

                    {boleto ? (
                      <div className="parcela-boleto">

                        <button
                          type="button"
                          className="parcela-boleto-number"
                          onClick={() =>
                            onViewBoleto?.(
                              boleto,
                              parcela
                            )
                          }
                        >
                          {boleto.number ||
                            boleto.id ||
                            "Ver boleto"}
                        </button>

                        {boleto.due_date && (
                          <span>
                            Venc.{" "}
                            {formatDate(
                              boleto.due_date
                            )}
                          </span>
                        )}

                      </div>
                    ) : (
                      <button
                        type="button"
                        className="parcela-generate"
                        onClick={() =>
                          onGenerateBoleto?.(
                            parcela
                          )
                        }
                      >
                        Gerar boleto
                      </button>
                    )}

                  </td>

                  {/* Pagamento */}

                  <td>

                    {payment ? (
                      <div className="parcela-payment">

                        <strong>
                          {formatCurrency(
                            payment.amount ??
                            amount
                          )}
                        </strong>

                        <span>
                          {formatDate(
                            payment.paid_at
                          )}
                        </span>

                        {onViewPayment && (
                          <button
                            type="button"
                            onClick={() =>
                              onViewPayment(
                                payment,
                                parcela
                              )
                            }
                          >
                            Ver pagamento
                          </button>
                        )}

                      </div>
                    ) : (
                      <span className="parcela-not-paid">
                        Não pago
                      </span>
                    )}

                  </td>

                  {/* Status */}

                  <td>

                    {typeof BoletoStatus ===
                    "function" ? (
                      <BoletoStatus
                        status={status}
                      />
                    ) : (
                      <StatusBadge
                        status={status}
                      />
                    )}

                  </td>

                  {/* Ações */}

                  <td>

                    <div className="parcela-actions">

                      <button
                        type="button"
                        onClick={() =>
                          onView?.(parcela)
                        }
                        title="Ver parcela"
                      >
                        Ver
                      </button>

                      {status === "OVERDUE" && (
                        <button
                          type="button"
                          className="parcela-action-danger"
                          onClick={() =>
                            onViewInadimplencia?.(
                              parcela
                            )
                          }
                        >
                          Cobrar
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