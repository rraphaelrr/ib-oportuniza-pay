import React, { useMemo, useState } from "react";

import StepOrigem from "../../components/boletos/GeracaoLote/StepOrigem";
import StepContratos from "../../components/boletos/GeracaoLote/StepContratos";
import StepConfiguracao from "../../components/boletos/GeracaoLote/StepConfiguracao";
import StepRevisao from "../../components/boletos/GeracaoLote/StepRevisao";
import StepResultado from "../../components/boletos/GeracaoLote/StepResultado";
import DashboardLayout from "../../layout/DashboardLayout";
import "./GerarBoletosLote.css";

const STEPS = [
  {
    id: "origem",
    label: "Origem",
  },
  {
    id: "contratos",
    label: "Contratos",
  },
  {
    id: "configuracao",
    label: "Configuração",
  },
  {
    id: "revisao",
    label: "Revisão",
  },
  {
    id: "resultado",
    label: "Resultado",
  },
];

const INITIAL_DATA = {
  origem: {
    type: "contracts",
    file: null,
  },

  contratos: [],

  configuracao: {
    due_date: "",
    amount_mode: "CONTRACT",
    description: "",

    discount_type: "NONE",
    discount_value: "",

    interest: "",
    fine: "",

    instructions: "",
  },

  resultado: null,
};

export default function GerarBoletosLote({
  clientes = [],
  contratos = [],
  loading = false,
  onBack,
  onSubmit,
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const [data, setData] = useState(INITIAL_DATA);

  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);

  const step = STEPS[currentStep];

  const isFirstStep = currentStep === 0;

  const isLastStep = currentStep === STEPS.length - 1;

  const selectedContracts = useMemo(() => {
    return contratos.filter((contrato) =>
      data.contratos.some(
        (selected) => String(selected.id ?? selected) === String(contrato.id),
      ),
    );
  }, [contratos, data.contratos]);

  function updateData(section, value) {
    setData((previous) => ({
      ...previous,
      [section]: value,
    }));
  }

  function updateConfiguracao(changes) {
    setData((previous) => ({
      ...previous,

      configuracao: {
        ...previous.configuracao,
        ...changes,
      },
    }));
  }

  function validateStep() {
    const nextErrors = {};

    // ------------------------------------------
    // ORIGEM
    // ------------------------------------------

    if (currentStep === 0) {
      if (!data.origem?.type) {
        nextErrors.origem = "Selecione a origem dos boletos.";
      }

      if (data.origem?.type === "file" && !data.origem?.file) {
        nextErrors.file = "Selecione um arquivo.";
      }
    }

    // ------------------------------------------
    // CONTRATOS
    // ------------------------------------------

    if (currentStep === 1) {
      if (!data.contratos || data.contratos.length === 0) {
        nextErrors.contratos = "Selecione pelo menos um contrato.";
      }
    }

    // ------------------------------------------
    // CONFIGURAÇÃO
    // ------------------------------------------

    if (currentStep === 2) {
      const config = data.configuracao;

      if (!config.due_date) {
        nextErrors.due_date = "Informe o vencimento.";
      }

      if (config.discount_type !== "NONE" && !config.discount_value) {
        nextErrors.discount_value = "Informe o desconto.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (!validateStep()) {
      return;
    }

    setErrors({});

    setCurrentStep((previous) => Math.min(previous + 1, STEPS.length - 1));
  }

  function goPrevious() {
    setErrors({});

    setCurrentStep((previous) => Math.max(previous - 1, 0));
  }

  async function handleGenerate() {
    if (!validateStep()) {
      return;
    }

    const payload = {
      origin: data.origem,

      contract_ids: data.contratos.map((contract) => contract.id ?? contract),

      configuration: data.configuracao,
    };

    try {
      setSubmitting(true);

      const result = await onSubmit?.(payload);

      updateData(
        "resultado",
        result || {
          success: true,
        },
      );

      setCurrentStep(STEPS.length - 1);
    } catch (error) {
      updateData("resultado", {
        success: false,
        error: error?.message || "Não foi possível gerar os boletos.",
      });

      setCurrentStep(STEPS.length - 1);
    } finally {
      setSubmitting(false);
    }
  }

  function handleStepClick(index) {
    // Não permite pular etapas para frente.
    if (index > currentStep) {
      return;
    }

    setErrors({});
    setCurrentStep(index);
  }

  function handleFinish() {
    setData(INITIAL_DATA);
    setErrors({});
    setCurrentStep(0);
  }

  function renderCurrentStep() {
    switch (step.id) {
      case "origem":
        return (
          <StepOrigem
            value={data.origem}
            onChange={(value) => updateData("origem", value)}
            error={errors.origem}
            fileError={errors.file}
          />
        );

      case "contratos":
        return (
          <StepContratos
            contratos={contratos}
            clientes={clientes}
            value={data.contratos}
            onChange={(value) => updateData("contratos", value)}
            error={errors.contratos}
          />
        );

      case "configuracao":
        return (
          <StepConfiguracao
            value={data.configuracao}
            onChange={updateConfiguracao}
            errors={errors}
          />
        );

      case "revisao":
        return (
          <StepRevisao
            origem={data.origem}
            contratos={selectedContracts}
            configuracao={data.configuracao}
            onEditStep={handleStepClick}
          />
        );

      case "resultado":
        return (
          <StepResultado
            resultado={data.resultado}
            loading={submitting}
            onFinish={handleFinish}
          />
        );

      default:
        return null;
    }
  }

  return (
    <DashboardLayout>

    
    <div className="gerar-boletos-lote">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="gerar-boletos-lote-header">
        <div className="gerar-boletos-lote-header-left">
          <button
            type="button"
            className="gerar-boletos-lote-back"
            onClick={onBack}
            disabled={submitting}
            aria-label="Voltar"
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
            <h1>Gerar boletos em lote</h1>

            <p>Gere várias cobranças de uma só vez a partir dos contratos.</p>
          </div>
        </div>
      </header>

      {/* =================================================
          STEPPER
      ================================================= */}

      <div className="gerar-boletos-lote-stepper">
        {STEPS.map((item, index) => {
          const active = index === currentStep;

          const completed = index < currentStep;

          const disabled = index > currentStep;

          return (
            <React.Fragment key={item.id}>
              <button
                type="button"
                className={[
                  "gerar-boletos-lote-step",
                  active ? "is-active" : "",
                  completed ? "is-completed" : "",
                  disabled ? "is-disabled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleStepClick(index)}
                disabled={disabled}
              >
                <span className="gerar-boletos-lote-step-number">
                  {completed ? (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>

                <span className="gerar-boletos-lote-step-label">
                  {item.label}
                </span>
              </button>

              {index < STEPS.length - 1 && (
                <span
                  className={[
                    "gerar-boletos-lote-step-line",
                    index < currentStep ? "is-completed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* =================================================
          CONTEÚDO
      ================================================= */}

      <main className="gerar-boletos-lote-content">
        <div className="gerar-boletos-lote-card">{renderCurrentStep()}</div>
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      {!isLastStep && (
        <footer className="gerar-boletos-lote-footer">
          <button
            type="button"
            className="gerar-boletos-lote-button-secondary"
            onClick={isFirstStep ? onBack : goPrevious}
            disabled={submitting}
          >
            {isFirstStep ? "Cancelar" : "Voltar"}
          </button>

          {currentStep < STEPS.length - 2 ? (
            <button
              type="button"
              className="gerar-boletos-lote-button-primary"
              onClick={goNext}
              disabled={submitting}
            >
              Continuar
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              className="gerar-boletos-lote-button-primary"
              onClick={handleGenerate}
              disabled={submitting}
            >
              {submitting ? "Gerando boletos..." : "Gerar boletos"}

              {!submitting && (
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              )}
            </button>
          )}
        </footer>
      )}
    </div>
    </DashboardLayout>
  );
}
