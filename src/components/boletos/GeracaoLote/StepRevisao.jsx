import React, { useMemo } from "react";

import "./StepRevisao.css";

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

export default function StepRevisao({
  value,
  onBack,
  onConfirm,
  loading = false,
}) {
  const contracts = value?.contracts || [];
  const configuration =
    value?.configuration || {};

  const totals = useMemo(() => {
    let installments = 0;
    let amount = 0;

    contracts.forEach((contract) => {
      const contractInstallments =
        contract.installments ||
        contract.parcelas ||
        [];

      const available =
        contractInstallments.filter(
          (item) =>
            !item.boleto &&
            !item.bill &&
            item.status !== "PAID"
        );

      installments += available.length;

      available.forEach((item) => {
        amount += Number(
          item.amount ||
            item.value ||
            item.valor ||
            0
        );
      });
    });

    return {
      contracts: contracts.length,
      installments,
      amount,
    };
  }, [contracts]);

  return (
    <div className="step-revisao">

      <div className="step-revisao-header">

        <div>
          <span className="step-revisao-eyebrow">
            ETAPA 4
          </span>

          <h2>
            Revise a geração
          </h2>

          <p>
            Confira as informações antes de gerar
            os boletos.
          </p>
        </div>

        <div className="step-revisao-warning">
          <span>!</span>

          <div>
            <strong>
              Confira os dados
            </strong>

            <small>
              Após a confirmação, a geração será
              enviada para processamento.
            </small>
          </div>
        </div>

      </div>

      {/* Resumo */}

      <div className="step-revisao-summary">

        <div>
          <span>
            Contratos
          </span>

          <strong>
            {totals.contracts}
          </strong>
        </div>

        <div>
          <span>
            Parcelas
          </span>

          <strong>
            {totals.installments}
          </strong>
        </div>

        <div>
          <span>
            Valor estimado
          </span>

          <strong>
            {formatCurrency(
              totals.amount
            )}
          </strong>
        </div>

      </div>

      {/* Configuração */}

      <div className="step-revisao-section">

        <div className="step-revisao-section-header">
          <div>
            <strong>
              Configuração dos boletos
            </strong>

            <span>
              Condições aplicadas ao lote
            </span>
          </div>

          <button
            type="button"
            onClick={onBack}
          >
            Alterar
          </button>
        </div>

        <div className="step-revisao-config">

          <div>
            <span>
              Vencimento
            </span>

            <strong>
              {formatDate(
                configuration.dueDate
              )}
            </strong>
          </div>

          <div>
            <span>
              Juros
            </span>

            <strong>
              {Number(
                configuration.interest || 0
              ).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
              % ao mês
            </strong>
          </div>

          <div>
            <span>
              Multa
            </span>

            <strong>
              {Number(
                configuration.fine || 0
              ).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
              %
            </strong>
          </div>

          <div>
            <span>
              Desconto
            </span>

            <strong>
              {Number(
                configuration.discount || 0
              ).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
              %
            </strong>
          </div>

          <div>
            <span>
              Pagamento após vencimento
            </span>

            <strong>
              {configuration.allowAfterDueDate
                ? "Permitido"
                : "Não permitido"}
            </strong>
          </div>

        </div>

      </div>

      {/* Contratos */}

      <div className="step-revisao-section">

        <div className="step-revisao-section-header">
          <div>
            <strong>
              Contratos selecionados
            </strong>

            <span>
              Clientes que receberão os boletos
            </span>
          </div>
        </div>

        <div className="step-revisao-contracts">

          {contracts.length === 0 ? (
            <div className="step-revisao-empty">
              Nenhum contrato selecionado.
            </div>
          ) : (
            contracts.map((contract) => {

              const client =
                contract.client ||
                contract.customer ||
                {};

              const installments =
                contract.installments ||
                contract.parcelas ||
                [];

              const available =
                installments.filter(
                  (item) =>
                    !item.boleto &&
                    !item.bill &&
                    item.status !== "PAID"
                );

              return (
                <div
                  className="step-revisao-contract"
                  key={contract.id}
                >

                  <div className="step-revisao-contract-client">
                    <strong>
                      {client.name ||
                        contract.client_name ||
                        "Cliente não informado"}
                    </strong>

                    <span>
                      Contrato #
                      {contract.number ||
                        contract.id}
                    </span>
                  </div>

                  <div>
                    <span>
                      Parcelas
                    </span>

                    <strong>
                      {available.length}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Valor
                    </span>

                    <strong>
                      {formatCurrency(
                        available.reduce(
                          (
                            total,
                            item
                          ) =>
                            total +
                            Number(
                              item.amount ||
                                item.value ||
                                0
                            ),
                          0
                        )
                      )}
                    </strong>
                  </div>

                </div>
              );
            })
          )}

        </div>

      </div>

      {/* Instruções */}

      {configuration.instructions && (
        <div className="step-revisao-instructions">

          <span>
            Instruções ao pagador
          </span>

          <p>
            {configuration.instructions}
          </p>

        </div>
      )}

      <div className="step-revisao-footer">

        <button
          type="button"
          className="step-revisao-button-secondary"
          disabled={loading}
          onClick={onBack}
        >
          Voltar
        </button>

        <button
          type="button"
          className="step-revisao-button-primary"
          disabled={
            loading ||
            contracts.length === 0
          }
          onClick={onConfirm}
        >
          {loading
            ? "Gerando boletos..."
            : "Confirmar e gerar boletos"}
        </button>

      </div>

    </div>
  );
}