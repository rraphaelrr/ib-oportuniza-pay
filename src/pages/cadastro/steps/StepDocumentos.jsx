import React from "react";

import UploadCard from "../../../components/UploadCard";

import "./CadastroSteps.css";

export default function StepDocumentos({
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

        <p className="step-description">
          Envie fotos nítidas dos documentos solicitados.
        </p>
      </div>

      <div className="form-grid">

        {/* DOCUMENTO - FRENTE */}
        <UploadCard
          title="Documento (Frente)"
          value={values.documentoFrente}
          onChange={(file) =>
            handleFile("documentoFrente", file)
          }
          error={errors.documentoFrente}
          accept="image/*,.pdf"
        />

        {/* DOCUMENTO - VERSO */}
        <UploadCard
          title="Documento (Verso)"
          value={values.documentoVerso}
          onChange={(file) =>
            handleFile("documentoVerso", file)
          }
          error={errors.documentoVerso}
          accept="image/*,.pdf"
        />

        {/* SELFIE */}
        <UploadCard
          title="Selfie"
          value={values.selfie}
          onChange={(file) =>
            handleFile("selfie", file)
          }
          error={errors.selfie}
          accept="image/*"
        />

        {/* COMPROVANTE DE RESIDÊNCIA
            OBRIGATÓRIO PARA PF E PJ */}
        <UploadCard
          title="Comprovante de Residência"
          value={values.comprovanteResidencia}
          onChange={(file) =>
            handleFile("comprovanteResidencia", file)
          }
          error={errors.comprovanteResidencia}
          accept="image/*,.pdf"
        />

        {/* CARTÃO CNPJ
            EXCLUSIVO PARA PJ */}
        {values.tipoConta === "pj" && (
          <UploadCard
            title="Cartão CNPJ"
            value={values.cartaoCNPJ}
            onChange={(file) =>
              handleFile("cartaoCNPJ", file)
            }
            error={errors.cartaoCNPJ}
            accept="image/*,.pdf"
          />
        )}

      </div>

      <div className="tips-box">
        <h4>Dicas para aprovação</h4>

        <ul>
          <li>
            Utilize um ambiente bem iluminado.
          </li>

          <li>
            Fotografe o documento inteiro.
          </li>

          <li>
            Evite reflexos e sombras.
          </li>

          <li>
            A selfie deve mostrar todo o rosto.
          </li>

          <li>
            Envie um comprovante de residência
            recente e legível.
          </li>

          {values.tipoConta === "pj" && (
            <li>
              Envie um Cartão CNPJ atualizado.
            </li>
          )}
        </ul>
      </div>

      <div className="step-buttons">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={back}
        >
          Voltar
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={next}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

