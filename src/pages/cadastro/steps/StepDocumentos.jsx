import React from "react";

import UploadCard from "../../../components/UploadCard";

import "./CadastroSteps.css";

export default function StepDocumentos({
  tipoConta,
  values,
  updateField,
  errors = {},
  next,
  back,
}) {
  function handleFile(field, file) {
    updateField(field, file);
  }

  return (
    <div className="step">
      <div className="step-header">
        <h2 className="step-title">Documentos</h2>

        <p className="step-description">Envie fotos legíveis dos documentos.</p>
      </div>

      <div className="form-grid">
        <UploadCard
          title="Documento Frente"
          value={values.documentoFrente}
          onChange={(file) => handleFile("documentoFrente", file)}
          error={errors.documentoFrente}
          accept="image/*"
        />

        <UploadCard
          title="Documento Verso"
          value={values.documentoVerso}
          onChange={(file) => handleFile("documentoVerso", file)}
          error={errors.documentoVerso}
          accept="image/*"
        />

        <UploadCard
          title="Selfie"
          value={values.selfie}
          onChange={(file) => handleFile("selfie", file)}
          error={errors.selfie}
          accept="image/*"
        />

        {tipoConta === "PJ" && (
          <UploadCard
            title="Cartão CNPJ"
            value={values.cartaoCNPJ}
            onChange={(file) => handleFile("cartaoCNPJ", file)}
            error={errors.cartaoCNPJ}
            accept=".pdf,image/*"
          />
        )}
      </div>

      <div className="tips-box">
        <h4>Dicas para aprovação</h4>

        <ul>
          <li>Utilize ambiente bem iluminado.</li>

          <li>Não corte partes do documento.</li>

          <li>Evite reflexos e sombras.</li>

          <li>A selfie deve mostrar todo o rosto.</li>

          {tipoConta === "PJ" && <li>O Cartão CNPJ deve estar atualizado.</li>}
        </ul>
      </div>

      <div className="step-buttons">
        <button className="btn btn-secondary" onClick={back}>
          Voltar
        </button>

        <button className="btn btn-primary" onClick={next}>
          Continuar
        </button>
      </div>
    </div>
  );
}
