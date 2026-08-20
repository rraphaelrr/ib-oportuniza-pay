import React from "react";

import "./StepIndicator.css";

/* =========================================================
   ETAPAS PADRÃO
========================================================= */

const DEFAULT_STEPS = [
  {
    id: "dados",
    label: "Dados",
  },
  {
    id: "recebiveis",
    label: "Recebíveis",
  },
  {
    id: "simulacao",
    label: "Simulação",
  },
  {
    id: "documentos",
    label: "Documentos",
  },
  {
    id: "revisao",
    label: "Revisão",
  },
];

/* =========================================================
   COMPONENTE
========================================================= */

export default function StepIndicator({
  steps = DEFAULT_STEPS,
  currentStep = 0,
  onStepClick,
  allowNavigation = false,
  className = "",
}) {
  const normalizedSteps = steps.map((step, index) => {
    if (typeof step === "string") {
      return {
        id: step,
        label: step,
      };
    }

    return {
      id: step.id ?? index,
      label: step.label ?? `Etapa ${index + 1}`,
      disabled: step.disabled ?? false,
    };
  });

  const getStepState = (index) => {
    if (index < currentStep) {
      return "completed";
    }

    if (index === currentStep) {
      return "active";
    }

    return "pending";
  };

  const handleStepClick = (index, step) => {
    if (!allowNavigation) {
      return;
    }

    if (step.disabled) {
      return;
    }

    if (index > currentStep) {
      return;
    }

    if (typeof onStepClick === "function") {
      onStepClick(index, step);
    }
  };

  return (
    <nav
      className={`step-indicator ${className}`.trim()}
      aria-label="Etapas da antecipação"
    >
      <ol className="step-indicator__list">
        {normalizedSteps.map((step, index) => {
          const state = getStepState(index);

          const clickable =
            allowNavigation &&
            !step.disabled &&
            index <= currentStep &&
            typeof onStepClick === "function";

          return (
            <React.Fragment key={step.id}>
              <li
                className={[
                  "step-indicator__item",
                  `step-indicator__item--${state}`,
                  step.disabled
                    ? "step-indicator__item--disabled"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <button
                  type="button"
                  className="step-indicator__step"
                  onClick={() =>
                    handleStepClick(index, step)
                  }
                  disabled={!clickable}
                  aria-current={
                    state === "active"
                      ? "step"
                      : undefined
                  }
                  aria-label={`Etapa ${index + 1}: ${
                    step.label
                  }`}
                >
                  <span className="step-indicator__circle">
                    {state === "completed" ? (
                      <span
                        className="step-indicator__check"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                    ) : (
                      index + 1
                    )}
                  </span>

                  <span className="step-indicator__label">
                    {step.label}
                  </span>
                </button>
              </li>

              {index < normalizedSteps.length - 1 && (
                <li
                  className={[
                    "step-indicator__connector",
                    index < currentStep
                      ? "step-indicator__connector--completed"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}