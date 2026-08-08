import React from "react";

import "./StepOrigem.css";

const ORIGENS = [
  {
    id: "CONTRACTS",
    title: "Contratos",
    description:
      "Selecione contratos ativos e gere os boletos das parcelas correspondentes.",
  },
  {
    id: "INSTALLMENTS",
    title: "Parcelas",
    description:
      "Selecione parcelas específicas que ainda não possuem boleto.",
  },
  {
    id: "IMPORT",
    title: "Importar arquivo",
    description:
      "Importe uma lista de cobranças para gerar os boletos em lote.",
  },
];

export default function StepOrigem({
  value,
  onChange,
  onNext,
  onBack,
}) {
  const selectedOrigin =
    value?.origin || null;

  function handleSelect(origin) {
    onChange?.({
      ...value,
      origin,
    });
  }

  function handleNext() {
    if (!selectedOrigin) return;

    onNext?.({
      ...value,
      origin: selectedOrigin,
    });
  }

  return (
    <div className="step-origem">

      <div className="step-origem-header">
        <div>
          <span className="step-origem-eyebrow">
            GERAÇÃO EM LOTE
          </span>

          <h2>
            Escolha a origem das cobranças
          </h2>

          <p>
            Selecione como os boletos que serão
            gerados devem ser identificados.
          </p>
        </div>
      </div>

      <div className="step-origem-options">

        {ORIGENS.map((item) => {

          const isSelected =
            selectedOrigin === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`step-origem-option ${
                isSelected
                  ? "step-origem-option-selected"
                  : ""
              }`}
              onClick={() =>
                handleSelect(item.id)
              }
            >
              <div className="step-origem-option-radio">
                <span
                  className={
                    isSelected
                      ? "step-origem-radio-selected"
                      : ""
                  }
                />
              </div>

              <div className="step-origem-option-content">

                <strong>
                  {item.title}
                </strong>

                <span>
                  {item.description}
                </span>

              </div>

            </button>
          );
        })}

      </div>

      <div className="step-origem-info">
        <strong>
          Como funciona?
        </strong>

        <span>
          Depois de escolher a origem, você poderá
          selecionar os contratos ou parcelas,
          configurar os boletos e revisar a geração
          antes de confirmar.
        </span>
      </div>

      <div className="step-origem-footer">

        <button
          type="button"
          className="step-origem-button-secondary"
          onClick={onBack}
        >
          Voltar
        </button>

        <button
          type="button"
          className="step-origem-button-primary"
          disabled={!selectedOrigin}
          onClick={handleNext}
        >
          Continuar
        </button>

      </div>

    </div>
  );
}