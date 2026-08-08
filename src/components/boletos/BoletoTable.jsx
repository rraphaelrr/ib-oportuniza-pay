import React from "react";

import BoletoStatus from "./BoletoStatus";
import BoletoActions from "./BoletoActions";

import "./BoletoTable.css";

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

function getInitials(name) {
  if (!name) return "?";

  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function BoletoTable({
  boletos = [],
  loading = false,

  onView,
  onDownload,
  onCancel,

  onViewClient,
  onViewContract,
}) {
  if (loading) {
    return (
      <div className="boleto-table-container">
        <div className="boleto-table-loading">
          <div className="boleto-table-spinner" />

          <span>
            Carregando boletos...
          </span>
        </div>
      </div>
    );
  }

  if (!boletos.length) {
    return (
      <div className="boleto-table-container">
        <div className="boleto-table-empty">

          <div className="boleto-table-empty-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <rect
                x="4"
                y="3"
                width="16"
                height="18"
                rx="2"
              />

              <path d="M8 8h8" />
              <path d="M8 12h8" />
              <path d="M8 16h5" />
            </svg>
          </div>

          <h3>
            Nenhum boleto encontrado
          </h3>

          <p>
            Não encontramos boletos para os
            filtros selecionados.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="boleto-table-container">

      <div className="boleto-table-wrapper">

        <table className="boleto-table">

          <thead>
            <tr>
              <th>
                Cliente
              </th>

              <th>
                Contrato
              </th>

              <th>
                Vencimento
              </th>

              <th>
                Valor
              </th>

              <th>
                Status
              </th>

              <th className="boleto-table-actions-header">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {boletos.map((boleto) => {

              const clientName =
                boleto.client?.name ||
                boleto.payer?.name ||
                boleto.customer?.name ||
                "Cliente não informado";

              const clientDocument =
                boleto.client?.document ||
                boleto.payer?.document ||
                boleto.customer?.document;

              const contract =
                boleto.contract?.number ||
                boleto.contract?.id ||
                "-";

              return (
                <tr
                  key={boleto.id}
                  className="boleto-table-row"
                >

                  {/* CLIENTE */}

                  <td>
                    <button
                      type="button"
                      className="boleto-client"
                      onClick={() =>
                        onViewClient?.(boleto)
                      }
                    >

                      <span className="boleto-client-avatar">
                        {getInitials(
                          clientName
                        )}
                      </span>

                      <span className="boleto-client-info">

                        <strong>
                          {clientName}
                        </strong>

                        {clientDocument && (
                          <small>
                            {clientDocument}
                          </small>
                        )}

                      </span>

                    </button>
                  </td>

                  {/* CONTRATO */}

                  <td>
                    {boleto.contract ? (
                      <button
                        type="button"
                        className="boleto-contract"
                        onClick={() =>
                          onViewContract?.(
                            boleto
                          )
                        }
                      >
                        #{contract}
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* VENCIMENTO */}

                  <td>
                    <span className="boleto-date">
                      {formatDate(
                        boleto.due_date
                      )}
                    </span>
                  </td>

                  {/* VALOR */}

                  <td>
                    <strong className="boleto-value">
                      {formatCurrency(
                        boleto.amount
                      )}
                    </strong>
                  </td>

                  {/* STATUS */}

                  <td>
                    <BoletoStatus
                      status={
                        boleto.status
                      }
                    />
                  </td>

                  {/* AÇÕES */}

                  <td>
                    <BoletoActions
                      boleto={boleto}
                      onView={onView}
                      onDownload={
                        onDownload
                      }
                      onCancel={
                        onCancel
                      }
                    />
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>

      </div>

    </div>
  );
}