import React from "react";

import Input from "../../../components/Input";
import PhoneInput from "../../../components/PhoneInput";

import "./CadastroSteps.css";

export default function StepContato({
  values,
  updateField,
  errors = {},
  next,
  back,
}) {
  return (
    <div className="step">
      <div className="step-header">
        <h2 className="step-title">
          Contato
        </h2>

        <p className="step-description">
          Informe seus meios de contato.
        </p>
      </div>

      <div className="form-grid">
        <Input
          label="E-mail"
          name="email"
          type="email"
          value={values.email || ""}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="email@empresa.com"
          error={errors.email}
          required
        />

        <PhoneInput
          label="Celular"
          value={values.telefone || ""}
          onChange={(e) =>
            updateField("telefone", e.target.value)
          }
          error={errors.telefone}
          required
        />
      </div>

      <div className="step-buttons">
        <button
          className="btn btn-secondary"
          onClick={back}
        >
          Voltar
        </button>

        <button
          className="btn btn-primary"
          onClick={next}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}