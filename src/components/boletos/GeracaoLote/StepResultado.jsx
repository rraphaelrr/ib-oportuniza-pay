import React, { useMemo } from "react";

import "./StepResultado.css";

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

export default function StepResultado({
  result,
  onFinish,
  onViewBoleto,
  onRetry,
}) {
  const boletos =
    result?.boletos ||
    result?.items ||
    [];

  const generated = boletos.filter(
    (boleto) =>
      boleto.status === "GENERATED" ||
      boleto.status === "REGISTERED" ||
      boleto.success === true
  );

  const failed = boletos.filter(
    (boleto) =>
      boleto.status === "FAILED" ||
      boleto.success === false ||
      boleto.error
  );

  const processed =
    result?.processed ??
    boletos.length;

  const successCount =
    result?.successCount ??
    generated.length;

  const failedCount =
    result?.failedCount ??
    failed.length;

  const totalAmount = useMemo(() => {
    return boletos.reduce(
      (total, boleto) =>
        total +
        Number(
          boleto.amount ||
            boleto.value ||
            0
        ),
      0
    );
  }, [boletos]);

  const hasFailures =
    failedCount > 0;

  return (
    <div className="step-resultado">

      <div
        className={`step-resultado-header ${
          hasFailures
            ? "step-resultado-header-warning"
            : ""
        }`}
      >

        <div className="step-resultado-icon">
          {hasFailures ? "!" : "✓"}
        </div>

        <div>
          <span className="step-resultado-eyebrow">
            ETAPA 5
          </span>

          <h2>
            {hasFailures
              ? "Geração concluída com pendências"
              : "Boletos gerados com sucesso"}
          </h2>

          <p>
            {hasFailures
              ? "Alguns boletos não puderam ser gerados. Confira os detalhes abaixo."
              : "O lote foi processado e os boletos estão disponíveis para consulta."}
          </p>
        </div>

      </div>

      {/* Summary */}

      <div className="step-resultado-summary">

        <div>
          <span>
            Processados
          </span>

          <strong>
            {processed}
          </strong>
        </div>

        <div>
          <span>
            Gerados
          </span>

          <strong>
            {successCount}
          </strong>
        </div>

        <div>
          <span>
            Com erro
          </span>

          <strong>
            {failedCount}
          </strong>
        </div>

        <div>
          <span>
            Valor total
          </span>

          <strong>
            {formatCurrency(
              totalAmount
            )}
          </strong>
        </div>

      </div>

      {/* Protocol */}

      {result?.batchId && (
        <div className="step-resultado-protocol">

          <span>
            Identificador do lote
          </span>

          <strong>
            {result.batchId}
          </strong>

        </div>
      )}

      {/* Table */}

      <div className="step-resultado-table-container">

        <div className="step-resultado-table-header">
          <strong>
            Resultado dos boletos
          </strong>

          <span>
            {boletos.length} registros
          </span>
        </div>

        {boletos.length === 0 ? (
          <div className="step-resultado-empty">
            Nenhum boleto foi retornado pelo processamento.
          </div>
        ) : (
          <div className="step-resultado-table">

            <div className="step-resultado-row step-resultado-row-header">

              <span>
                Cliente
              </span>

              <span>
                Boleto
              </span>

              <span>
                Vencimento
              </span>

              <span>
                Valor
              </span>

              <span>
                Status
              </span>

              <span />

            </div>

            {boletos.map((boleto, index) => {

              const client =
                boleto.client ||
                boleto.customer ||
                {};

              const isFailed =
                boleto.status ===
                  "FAILED" ||
                boleto.success === false ||
                Boolean(
                  boleto.error
                );

              return (
                <div
                  className="step-resultado-row"
                  key={
                    boleto.id ||
                    boleto.boleto_id ||
                    index
                  }
                >

                  <div>
                    <strong>
                      {client.name ||
                        boleto.client_name ||
                        "Cliente não informado"}
                    </strong>

                    <small>
                      {client.document ||
                        boleto.document ||
                        "-"}
                    </small>
                  </div>

                  <div>
                    <strong>
                      {boleto.barcode ||
                        boleto.digitable_line ||
                        boleto.id ||
                        "-"}
                    </strong>
                  </div>

                  <span>
                    {formatDate(
                      boleto.due_date
                    )}
                  </span>

                  <strong>
                    {formatCurrency(
                      boleto.amount ||
                        boleto.value ||
                        0
                    )}
                  </strong>

                  <span
                    className={`step-resultado-status ${
                      isFailed
                        ? "step-resultado-status-error"
                        : "step-resultado-status-success"
                    }`}
                  >
                    {isFailed
                      ? "Erro"
                      : "Gerado"}
                  </span>

                  <div className="step-resultado-actions">

                    {!isFailed && (
                      <button
                        type="button"
                        onClick={() =>
                          onViewBoleto?.(
                            boleto
                          )
                        }
                      >
                        Detalhes
                      </button>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* Errors */}

      {failed.length > 0 && (
        <div className="step-resultado-errors">

          <strong>
            Boletos com erro
          </strong>

          {failed.map(
            (boleto, index) => (
              <div
                key={
                  boleto.id ||
                  index
                }
              >
                <span>
                  {boleto.client_name ||
                    boleto.client?.name ||
                    "Cliente não informado"}
                </span>

                <small>
                  {boleto.error ||
                    "Não foi possível gerar o boleto."}
                </small>
              </div>
            )
          )}

        </div>
      )}

      {/* Footer */}

      <div className="step-resultado-footer">

        {hasFailures && (
          <button
            type="button"
            className="step-resultado-button-secondary"
            onClick={onRetry}
          >
            Tentar novamente
          </button>
        )}

        <button
          type="button"
          className="step-resultado-button-primary"
          onClick={onFinish}
        >
          Ir para boletos
        </button>

      </div>

    </div>
  );
}