import React, { useState } from "react";
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../layout/DashboardLayout";
import "./Documentos.css";

const INITIAL_DOCUMENT = {
  document_type: "",
  description: "",
  file_name: "",
  external_url: "",
  storage_key: "",
  checksum_sha256: "",
};

const DOCUMENT_TYPES = {
  SHIFT_REPORT: "Relatório de plantão",
  INVOICE: "Nota fiscal",
  CONTRACT: "Contrato",
  BOLETO: "Boleto",
  DUPLICATE: "Duplicata",
  SERVICE_ORDER: "Ordem de serviço",
  PROOF: "Comprovante",
  OTHER: "Outro",
};

export default function Documentos({
  advanceId,
  receivableId = null,
  documentos = [],
  onUpload,
  onRemove,
  loading = false,
}) {
  const navigate = useNavigate();

  const [documento, setDocumento] = useState(INITIAL_DOCUMENT);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleBack() {
    // Se houver histórico, volta para a tela anterior.
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    // Fallback caso a tela tenha sido acessada diretamente.
    navigate("/home");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setDocumento((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  }

  function resetForm() {
    setDocumento(INITIAL_DOCUMENT);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (loading) {
      return;
    }

    if (!advanceId) {
      setError("Solicitação de antecipação não identificada.");
      return;
    }

    if (!documento.document_type) {
      setError("Selecione o tipo do documento.");
      return;
    }

    const hasDocumentReference =
      documento.file_name.trim() ||
      documento.external_url.trim() ||
      documento.storage_key.trim();

    if (!hasDocumentReference) {
      setError(
        "Informe o nome do arquivo, a URL externa ou a chave de armazenamento."
      );
      return;
    }

    if (
      documento.external_url &&
      !/^https?:\/\/.+/i.test(documento.external_url)
    ) {
      setError("Informe uma URL válida começando com http:// ou https://.");
      return;
    }

    try {
      if (!onUpload) {
        setError("A função de vinculação de documentos não foi configurada.");
        return;
      }

      await onUpload({
        document_type: documento.document_type,
        description: documento.description.trim(),
        file_name: documento.file_name.trim(),
        external_url: documento.external_url.trim(),
        storage_key: documento.storage_key.trim(),
        checksum_sha256: documento.checksum_sha256.trim(),
        receivable_id: receivableId || undefined,
      });

      resetForm();

      setSuccess("Documento vinculado com sucesso.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Não foi possível vincular o documento."
      );
    }
  }

  async function handleRemove(documentoId) {
    if (!onRemove || !documentoId || loading) {
      return;
    }

    const confirmed = window.confirm(
      "Tem certeza que deseja remover este documento?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await onRemove(documentoId);

      setSuccess("Documento removido com sucesso.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Não foi possível remover o documento."
      );
    }
  }

  function getDocumentTypeLabel(type) {
    return DOCUMENT_TYPES[type] || type || "Documento";
  }

  function getDocumentKey(item, index) {
    return (
      item?.id ||
      item?.document_id ||
      `${item?.file_name || "documento"}-${index}`
    );
  }

  return (
    <DashboardLayout>
      <div className="documentos-page">
        {/* =====================================================
            TOPO
        ====================================================== */}
        

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="documentos-header">
          <div className="documentos-header-content">
            <span className="documentos-eyebrow">
              DOCUMENTAÇÃO
            </span>

            <h1>Documentos da antecipação</h1>

            <p>
              Vincule e gerencie os documentos necessários para a
              solicitação de antecipação.
            </p>

            {advanceId && (
              <div className="documentos-reference">
                Solicitação: <strong>{advanceId}</strong>
              </div>
            )}
          </div>

          <div className="documentos-header-icon">
            <FileText size={24} />
          </div>
        </div>

        {/* =====================================================
            ALERTAS
        ====================================================== */}
        {error && (
          <div className="documentos-alert documentos-alert-error">
            <AlertCircle size={18} />

            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="documentos-alert documentos-alert-success">
            <CheckCircle2 size={18} />

            <span>{success}</span>
          </div>
        )}

        {/* =====================================================
            CONTEÚDO
        ====================================================== */}
        <div className="documentos-content">
          {/* ===================================================
              FORMULÁRIO
          ==================================================== */}
          <form
            className="documentos-form"
            onSubmit={handleSubmit}
          >
            <div className="documentos-section-title">
              <div>
                <h2>Adicionar documento</h2>

                <p>
                  Informe os dados do documento que será
                  vinculado à solicitação.
                </p>
              </div>
            </div>

            <div className="documentos-grid">
              {/* Tipo */}
              <div className="documentos-field">
                <label htmlFor="document_type">
                  Tipo do documento
                  <span>*</span>
                </label>

                <select
                  id="document_type"
                  name="document_type"
                  value={documento.document_type}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <option value="">
                    Selecione
                  </option>

                  {Object.entries(DOCUMENT_TYPES).map(
                    ([value, label]) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Nome */}
              <div className="documentos-field">
                <label htmlFor="file_name">
                  Nome do arquivo
                </label>

                <input
                  id="file_name"
                  name="file_name"
                  type="text"
                  placeholder="ex.: relatorio-julho.pdf"
                  value={documento.file_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Descrição */}
              <div className="documentos-field documentos-field-full">
                <label htmlFor="description">
                  Descrição
                </label>

                <input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Descreva brevemente o documento"
                  value={documento.description}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* URL */}
              <div className="documentos-field">
                <label htmlFor="external_url">
                  URL externa
                </label>

                <input
                  id="external_url"
                  name="external_url"
                  type="url"
                  placeholder="https://..."
                  value={documento.external_url}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Storage */}
              <div className="documentos-field">
                <label htmlFor="storage_key">
                  Chave de armazenamento
                </label>

                <input
                  id="storage_key"
                  name="storage_key"
                  type="text"
                  placeholder="receivables/2026/arquivo.pdf"
                  value={documento.storage_key}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* SHA */}
              <div className="documentos-field documentos-field-full">
                <label htmlFor="checksum_sha256">
                  SHA-256
                </label>

                <input
                  id="checksum_sha256"
                  name="checksum_sha256"
                  type="text"
                  placeholder="Hash SHA-256 do arquivo"
                  value={documento.checksum_sha256}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Rodapé */}
            <div className="documentos-form-footer">
              <div className="documentos-form-helper">
                <FileText size={16} />

                <span>
                  O documento será vinculado à solicitação atual.
                </span>
              </div>

              <button
                type="submit"
                className="documentos-submit"
                disabled={loading}
              >
                <Upload size={17} />

                {loading
                  ? "Processando..."
                  : "Vincular documento"}
              </button>
            </div>
          </form>

          {/* ===================================================
              LISTA
          ==================================================== */}
          <section className="documentos-list-section">
            <div className="documentos-section-title">
              <div>
                <h2>Documentos vinculados</h2>

                <p>
                  Documentos adicionados à solicitação.
                </p>
              </div>

              <span className="documentos-count">
                {documentos.length}
              </span>
            </div>

            {documentos.length === 0 ? (
              <div className="documentos-empty">
                <div className="documentos-empty-icon">
                  <FileText size={24} />
                </div>

                <strong>
                  Nenhum documento vinculado
                </strong>

                <p>
                  Adicione os documentos necessários para
                  continuar a solicitação.
                </p>
              </div>
            ) : (
              <div className="documentos-list">
                {documentos.map((item, index) => (
                  <div
                    className="documento-item"
                    key={getDocumentKey(item, index)}
                  >
                    <div className="documento-icon">
                      <FileText size={20} />
                    </div>

                    <div className="documento-info">
                      <div className="documento-title-row">
                        <strong>
                          {item.file_name ||
                            "Documento sem nome"}
                        </strong>

                        {item.id && (
                          <CheckCircle2
                            size={16}
                            className="documento-success-icon"
                          />
                        )}
                      </div>

                      <span className="documento-type">
                        {getDocumentTypeLabel(
                          item.document_type
                        )}
                      </span>

                      {item.description && (
                        <small>
                          {item.description}
                        </small>
                      )}

                      {item.external_url && (
                        <small className="documento-reference-text">
                          Documento externo
                        </small>
                      )}

                      {item.storage_key && (
                        <small className="documento-reference-text">
                          Armazenamento: {item.storage_key}
                        </small>
                      )}
                    </div>

                    {item.id && onRemove && (
                      <button
                        type="button"
                        className="documento-remove"
                        onClick={() =>
                          handleRemove(item.id)
                        }
                        title="Remover documento"
                        disabled={loading}
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}