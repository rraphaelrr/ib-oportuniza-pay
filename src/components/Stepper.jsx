import React from "react";
import "./Stepper.css";

export default function Stepper({
  steps,
  currentStep,
}) {
  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const active = index === currentStep;
        const completed = index < currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className="stepper-item">
              <div
                className={`stepper-circle ${
                  completed
                    ? "completed"
                    : active
                    ? "active"
                    : ""
                }`}
              >
                {completed ? "✓" : index + 1}
              </div>

              <span
                className={`stepper-title ${
                  active ? "active" : ""
                }`}
              >
                {step.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`stepper-line ${
                  completed
                    ? "completed"
                    : ""
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}