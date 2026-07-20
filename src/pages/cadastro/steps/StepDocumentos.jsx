import React, { useRef } from "react";

export default function StepDocumentos({
  tipoConta,
  data,
  errors,
  onFileChange,
}) {
  const rgFrenteRef = useRef();
  const rgVersoRef = useRef();
  const selfieRef = useRef();
  const cnpjRef = useRef();

  function renderUpload(
    title,
    field,
    ref,
    accept = "image/*"
  ) {
    return (
      <div className="upload-card">
        <label>{title}</label>

        <input
          ref={ref}
          type="file"
          accept={accept}
          hidden
          onChange={(e) =>
            onFileChange(
              field,
              e.target.files[0]
            )
          }
        />

        <div
          className="upload-area"
          onClick={() =>
            ref.current.click()
          }
        >
          {data[field] ? (
            <>
              <img
                src={URL.createObjectURL(
                  data[field]
                )}
                alt=""
              />

              <button
                type="button"
                className="change-btn"
              >
                Alterar arquivo
              </button>
            </>
          ) : (
            <>
              <div className="upload-icon">
                📄
              </div>

              <strong>
                Clique para enviar
              </strong>

              <span>
                JPG, PNG ou PDF
              </span>
            </>
          )}
        </div>

        {errors[field] && (
          <small>{errors[field]}</small>
        )}
      </div>
    );
  }

  return (
    <div className="cadastro-step">

      <h2>Documentos</h2>

      <p className="step-description">
        Envie fotos legíveis dos
        documentos.
      </p>

      <div className="documents-grid">

        {renderUpload(
          "Documento (Frente)",
          "documentoFrente",
          rgFrenteRef
        )}

        {renderUpload(
          "Documento (Verso)",
          "documentoVerso",
          rgVersoRef
        )}

        {renderUpload(
          "Selfie",
          "selfie",
          selfieRef
        )}

        {tipoConta === "PJ" &&
          renderUpload(
            "Cartão CNPJ",
            "cartaoCnpj",
            cnpjRef,
            ".pdf,image/*"
          )}

      </div>

      <div className="tips-box">

        <h4>Dicas para aprovação</h4>

        <ul>
          <li>
            Utilize um ambiente bem
            iluminado.
          </li>

          <li>
            Não corte nenhuma parte do
            documento.
          </li>

          <li>
            Evite reflexos ou sombras.
          </li>

          <li>
            A selfie deve mostrar todo o
            rosto.
          </li>

          {tipoConta === "PJ" && (
            <li>
              O Cartão CNPJ deve estar
              atualizado.
            </li>
          )}
        </ul>

      </div>

    </div>
  );
}