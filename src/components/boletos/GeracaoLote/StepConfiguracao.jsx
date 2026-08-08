import React, { useState } from "react";

import "./StepConfiguracao.css";

export default function StepConfiguracao({
  value,
  onChange,
  onNext,
  onBack,
}) {
  const configuration = value?.configuration || {};

  const [config, setConfig] = useState({
    dueDate:
      configuration.dueDate || "",

    interest:
      configuration.interest ?? 0,

    fine:
      configuration.fine ?? 0,

    discount:
      configuration.discount ?? 0,

    discountDays:
      configuration.discountDays ?? 0,

    instructions:
      configuration.instructions || "",

    allowAfterDueDate:
      configuration.allowAfterDueDate ?? true,
  });

  function updateConfig(field, newValue) {
    const nextConfig = {
      ...config,
      [field]: newValue,
    };

    setConfig(nextConfig);

    onChange?.({
      ...value,
      configuration: nextConfig,
    });
  }

  function handleNext() {
    if (!config.dueDate) {
      return;
    }

    onNext?.({
      ...value,
      configuration: config,
    });
  }

  return (
    <div className="step-configuracao">

      <div className="step-configuracao-header">

        <div>
          <span className="step-configuracao-eyebrow">
            ETAPA 3
          </span>

          <h2>
            Configure os boletos
          </h2>

          <p>
            Defina as condições que serão aplicadas
            ao lote de boletos.
          </p>
        </div>

      </div>

      <div className="step-configuracao-grid">

        {/* Vencimento */}

        <div className="step-configuracao-section">

          <div className="step-configuracao-section-header">
            <strong>
              Vencimento
            </strong>

            <span>
              Data base dos boletos
            </span>
          </div>

          <div className="step-configuracao-field">

            <label>
              Data de vencimento
            </label>

            <input
              type="date"
              value={config.dueDate}
              onChange={(event) =>
                updateConfig(
                  "dueDate",
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* Encargos */}

        <div className="step-configuracao-section">

          <div className="step-configuracao-section-header">
            <strong>
              Encargos
            </strong>

            <span>
              Valores aplicados após o vencimento
            </span>
          </div>

          <div className="step-configuracao-fields-row">

            <div className="step-configuracao-field">

              <label>
                Juros ao mês (%)
              </label>

              <div className="step-configuracao-input-suffix">

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={config.interest}
                  onChange={(event) =>
                    updateConfig(
                      "interest",
                      event.target.value
                    )
                  }
                />

                <span>
                  %
                </span>

              </div>

            </div>

            <div className="step-configuracao-field">

              <label>
                Multa (%)
              </label>

              <div className="step-configuracao-input-suffix">

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={config.fine}
                  onChange={(event) =>
                    updateConfig(
                      "fine",
                      event.target.value
                    )
                  }
                />

                <span>
                  %
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Desconto */}

        <div className="step-configuracao-section">

          <div className="step-configuracao-section-header">
            <strong>
              Desconto
            </strong>

            <span>
              Condição para pagamento antecipado
            </span>
          </div>

          <div className="step-configuracao-fields-row">

            <div className="step-configuracao-field">

              <label>
                Desconto (%)
              </label>

              <div className="step-configuracao-input-suffix">

                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={config.discount}
                  onChange={(event) =>
                    updateConfig(
                      "discount",
                      event.target.value
                    )
                  }
                />

                <span>
                  %
                </span>

              </div>

            </div>

            <div className="step-configuracao-field">

              <label>
                Até quantos dias antes
              </label>

              <div className="step-configuracao-input-suffix">

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={config.discountDays}
                  onChange={(event) =>
                    updateConfig(
                      "discountDays",
                      event.target.value
                    )
                  }
                />

                <span>
                  dias
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Após vencimento */}

        <div className="step-configuracao-section">

          <div className="step-configuracao-section-header">
            <strong>
              Após o vencimento
            </strong>

            <span>
              Defina o comportamento da cobrança
            </span>
          </div>

          <label className="step-configuracao-toggle">

            <input
              type="checkbox"
              checked={
                config.allowAfterDueDate
              }
              onChange={(event) =>
                updateConfig(
                  "allowAfterDueDate",
                  event.target.checked
                )
              }
            />

            <span className="step-configuracao-toggle-box">
              {config.allowAfterDueDate
                ? "✓"
                : ""}
            </span>

            <div>
              <strong>
                Permitir pagamento após o vencimento
              </strong>

              <span>
                O boleto continuará válido e os
                encargos serão calculados conforme
                as regras definidas.
              </span>
            </div>

          </label>

        </div>

        {/* Instruções */}

        <div className="step-configuracao-section step-configuracao-section-full">

          <div className="step-configuracao-section-header">
            <strong>
              Instruções ao pagador
            </strong>

            <span>
              Informação adicional exibida no boleto
            </span>
          </div>

          <div className="step-configuracao-field">

            <textarea
              rows={3}
              maxLength={500}
              placeholder="Ex.: Após o vencimento, cobrar multa de acordo com as condições do contrato."
              value={config.instructions}
              onChange={(event) =>
                updateConfig(
                  "instructions",
                  event.target.value
                )
              }
            />

            <span className="step-configuracao-counter">
              {config.instructions.length}/500
            </span>

          </div>

        </div>

      </div>

      <div className="step-configuracao-info">

        <strong>
          Atenção
        </strong>

        <span>
          As condições configuradas serão utilizadas
          como padrão para os boletos deste lote.
          Valores específicos definidos no contrato
          podem precisar ser preservados conforme as
          regras da cobrança.
        </span>

      </div>

      <div className="step-configuracao-footer">

        <button
          type="button"
          className="step-configuracao-button-secondary"
          onClick={onBack}
        >
          Voltar
        </button>

        <button
          type="button"
          className="step-configuracao-button-primary"
          disabled={!config.dueDate}
          onClick={handleNext}
        >
          Revisar boletos
        </button>

      </div>

    </div>
  );
}