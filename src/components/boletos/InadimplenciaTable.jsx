import React from "react";

import "./InadimplenciaTable.css";

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

  return Math.max(
    Math.floor(
      (today.getTime() - dueDate.getTime()) /
        (1000 * 60 * 60 * 24)
    ),
    0
  );
}

function getAgingLevel(days) {
  if (days <= 15) return "0_15";
  if (days <= 30) return "16_30";
  if (days <= 60) return "31_60";
  if (days <= 90) return "61_90";

  return "90_PLUS";
}

function getAgingLabel(level) {
  const labels = {
    "0_15": "Até 15 dias",
    "16_30": "16 a 30 dias",
    "31_60": "31 a 60 dias",
    "61_90": "61 a 90 dias",
    "90_PLUS": "Mais de 90 dias",
  };

  return labels[level] || level;
}

export default function InadimplenciaTable({
  registros = [],
  loading = false,
  onViewClient,
  onViewContract,
  onViewInstallment,
  onViewBoleto,
  onContact,
  onRenegotiate,
  onRegisterPayment,
  onSelect,
  selectedIds = [],
  selectable = false,
  emptyMessage =
    "Nenhuma inadimplência encontrada.",
}) {
  const allSelected =
    selectable &&
    registros.length > 0 &&
    registros.every((item) =>
      selectedIds.includes(item.id)
    );

  function handleSelectAll(event) {
    if (!onSelect) return;

    if (event.target.checked) {
      onSelect(
        registros.map((item) => item.id)
      );

      return;
    }

    onSelect([]);
  }

  function handleSelect(item) {
    if (!onSelect) return;

    if (selectedIds.includes(item.id)) {
      onSelect(
        selectedIds.filter(
          (id) => id !== item.id
        )
      );

      return;
    }

    onSelect([...selectedIds, item.id]);
  }

  if (loading) {
    return (
      <div className="inadimplencia-table-wrapper">
        <div className="inadimplencia-table-loading">
          Carregando inadimplências...
        </div>
      </div>
    );
  }

  return (
    <div className="inadimplencia-table-wrapper">
      <table className="inadimplencia-table">

        <thead>
          <tr>

            {selectable && (
              <th className="inadimplencia-checkbox">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
            )}

            <th>Cliente</th>
            <th>Contrato</th>
            <th>Parcela</th>
            <th>Vencimento</th>
            <th>Dias em atraso</th>
            <th>Valor</th>
            <th>Boleto</th>
            <th>Ações</th>

          </tr>
        </thead>

        <tbody>

          {registros.length === 0 ? (
            <tr>
              <td
                colSpan={selectable ? 9 : 8}
              >
                <div className="inadimplencia-table-empty">
                  {emptyMessage}
                </div>
              </td>
            </tr>
          ) : (
            registros.map((item, index) => {

              const client =
                item.client ||
                item.customer ||
                item.payer ||
                {};

              const contract =
                item.contract || {};

              const installment =
                item.installment ||
                item.parcela ||
                {};

              const boleto =
                item.boleto ||
                item.bill ||
                {};

              const clientName =
                client.name ||
                item.client_name ||
                item.customer_name ||
                "Cliente não informado";

              const dueDate =
                item.due_date ||
                installment.due_date ||
                boleto.due_date;

              const daysLate =
                item.days_late ??
                getDaysLate(dueDate);

              const aging =
                getAgingLevel(daysLate);

              const amount =
                item.amount ??
                installment.amount ??
                boleto.amount ??
                0;

              const isSelected =
                selectedIds.includes(item.id);

              return (
                <tr
                  key={
                    item.id ||
                    boleto.id ||
                    installment.id ||
                    index
                  }
                  className={
                    isSelected
                      ? "inadimplencia-row-selected"
                      : ""
                  }
                >

                  {selectable && (
                    <td className="inadimplencia-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          handleSelect(item)
                        }
                      />
                    </td>
                  )}

                  {/* Cliente */}

                  <td>
                    <button
                      type="button"
                      className="inadimplencia-client"
                      onClick={() =>
                        onViewClient?.(
                          client,
                          item
                        )
                      }
                    >
                      <strong>
                        {clientName}
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
                    <button
                      type="button"
                      className="inadimplencia-link"
                      onClick={() =>
                        onViewContract?.(
                          contract,
                          item
                        )
                      }
                    >
                      #
                      {contract.number ||
                        contract.id ||
                        "-"}
                    </button>
                  </td>

                  {/* Parcela */}

                  <td>
                    <span className="inadimplencia-installment">
                      {installment.number
                        ? `${installment.number}ª`
                        : "-"}
                    </span>
                  </td>

                  {/* Vencimento */}

                  <td>
                    <span className="inadimplencia-date">
                      {formatDate(dueDate)}
                    </span>
                  </td>

                  {/* Aging */}

                  <td>
                    <div className="inadimplencia-aging">

                      <strong>
                        {daysLate}{" "}
                        {daysLate === 1
                          ? "dia"
                          : "dias"}
                      </strong>

                      <span
                        className={`inadimplencia-aging-badge inadimplencia-aging-${aging}`}
                      >
                        {getAgingLabel(aging)}
                      </span>

                    </div>
                  </td>

                  {/* Valor */}

                  <td>
                    <strong className="inadimplencia-amount">
                      {formatCurrency(amount)}
                    </strong>
                  </td>

                  {/* Boleto */}

                  <td>
                    {boleto.id ||
                    boleto.number ? (
                      <button
                        type="button"
                        className="inadimplencia-link"
                        onClick={() =>
                          onViewBoleto?.(
                            boleto,
                            item
                          )
                        }
                      >
                        {boleto.number ||
                          boleto.id}
                      </button>
                    ) : (
                      <span className="inadimplencia-muted">
                        -
                      </span>
                    )}
                  </td>

                  {/* Ações */}

                  <td>
                    <div className="inadimplencia-actions">

                      {onContact && (
                        <button
                          type="button"
                          onClick={() =>
                            onContact(item)
                          }
                        >
                          Cobrar
                        </button>
                      )}

                      {onRenegotiate && (
                        <button
                          type="button"
                          onClick={() =>
                            onRenegotiate(item)
                          }
                        >
                          Renegociar
                        </button>
                      )}

                      {onRegisterPayment && (
                        <button
                          type="button"
                          className="inadimplencia-action-primary"
                          onClick={() =>
                            onRegisterPayment(item)
                          }
                        >
                          Registrar
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