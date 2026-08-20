import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import "./Recebiveis.css";
import DashboardLayout from "../../../layout/DashboardLayout";
import ReceivableCard from "../../../components/antecipacao/ReceivableCard";
import useAntecipacao from "../../../hooks/useAntecipacao";

/* =========================================================
   CONSTANTES
========================================================= */

const RECEIVABLE_TYPES = [
  {
    value: "MEDICAL_SHIFT",
    label: "Plantões médicos",
  },
  {
    value: "BOLETO",
    label: "Boleto",
  },
  {
    value: "DUPLICATE",
    label: "Duplicata",
  },
  {
    value: "SERVICE",
    label: "Serviço",
  },
  {
    value: "INVOICE",
    label: "Nota fiscal",
  },
  {
    value: "CONTRACT",
    label: "Contrato",
  },
  {
    value: "OTHER",
    label: "Outro",
  },
];

const DOCUMENT_TYPES = [
  {
    value: "INVOICE",
    label: "Nota fiscal",
  },
  {
    value: "CONTRACT",
    label: "Contrato",
  },
  {
    value: "SHIFT_REPORT",
    label: "Relatório de plantões",
  },
  {
    value: "RECEIVABLE_PROOF",
    label: "Comprovante do recebível",
  },
  {
    value: "OTHER",
    label: "Outro documento",
  },
];

/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatCurrencyInput(value) {
  const numbers = String(value || "").replace(/\D/g, "");

  if (!numbers) {
    return "";
  }

  return (Number(numbers) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseCurrency(value) {
  if (!value) {
    return 0;
  }

  return Number(
    String(value)
      .replace(/\./g, "")
      .replace(",", ".")
  );
}

function formatCurrency(value) {
  const number = Number(value || 0);

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function createEmptyReceivable() {
  return {
    external_id: "",
    receivable_type: "MEDICAL_SHIFT",
    debtor_name: "",
    debtor_document: "",
    debtor_document_type: "CNPJ",
    due_date: "",
    original_amount: "",
    reference_number: "",
    currency_code: "BRL",

    boleto: {
      bank_code: "",
      barcode: "",
      digitable_line: "",
      document_number: "",
      nosso_numero: "",
      beneficiary_document: "",
      beneficiary_document_type: "CNPJ",
      beneficiary_name: "",
      payer_document: "",
      payer_document_type: "CNPJ",
      payer_name: "",
      status: "OPEN",
    },

    medical_shifts: [],
  };
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function Recebiveis({
  advanceId,
  onBack,
  onNext,
}) {
  const {
    getAntecipacao,
    adicionarRecebivel,
    loading,
    error,
  } = useAntecipacao();

  const [advance, setAdvance] = useState(null);

  const [receivables, setReceivables] = useState([]);

  const [form, setForm] = useState(createEmptyReceivable());

  const [showForm, setShowForm] = useState(false);

  const [localError, setLocalError] = useState("");

  const [saving, setSaving] = useState(false);

  /* =========================================================
     CARREGAR SOLICITAÇÃO
  ========================================================= */

  useEffect(() => {
    if (!advanceId || !getAntecipacao) {
      return;
    }

    let mounted = true;

    async function loadAdvance() {
      try {
        const result = await getAntecipacao(advanceId);

        if (!mounted) {
          return;
        }

        setAdvance(result);

        if (Array.isArray(result?.receivables)) {
          setReceivables(result.receivables);
        }
      } catch (err) {
        if (!mounted) {
          return;
        }

        setLocalError(
          err?.message ||
            err?.error ||
            "Não foi possível carregar os recebíveis."
        );
      }
    }

    loadAdvance();

    return () => {
      mounted = false;
    };
  }, [advanceId, getAntecipacao]);

  /* =========================================================
     VALOR TOTAL
  ========================================================= */

  const totalAmount = useMemo(() => {
    return receivables.reduce(
      (total, item) =>
        total + Number(item?.original_amount || 0),
      0
    );
  }, [receivables]);

  /* =========================================================
     ALTERAÇÃO FORM
  ========================================================= */

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setLocalError("");
  }

  /* =========================================================
     VALOR
  ========================================================= */

  function handleAmountChange(event) {
    setForm((prev) => ({
      ...prev,
      original_amount: formatCurrencyInput(
        event.target.value
      ),
    }));

    setLocalError("");
  }

  /* =========================================================
     BOLETO
  ========================================================= */

  function handleBoletoChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      boleto: {
        ...prev.boleto,
        [name]: value,
      },
    }));

    setLocalError("");
  }

  /* =========================================================
     ADICIONAR RECEBÍVEL
  ========================================================= */

  async function handleAddReceivable(event) {
    event.preventDefault();

    setLocalError("");

    if (!advanceId) {
      setLocalError(
        "Não foi possível identificar a solicitação de antecipação."
      );
      return;
    }

    if (!form.external_id.trim()) {
      setLocalError(
        "Informe o identificador externo do recebível."
      );
      return;
    }

    if (!form.debtor_name.trim()) {
      setLocalError(
        "Informe o nome do devedor."
      );
      return;
    }

    if (!form.due_date) {
      setLocalError(
        "Informe a data de vencimento."
      );
      return;
    }

    const originalAmount = parseCurrency(
      form.original_amount
    );

    if (!originalAmount || originalAmount <= 0) {
      setLocalError(
        "Informe um valor válido para o recebível."
      );
      return;
    }

    const payload = {
      assignment_allowed: true,
      assignment_restriction: "",
      currency_code: form.currency_code,

      debtor_document: form.debtor_document.trim(),
      debtor_document_type: form.debtor_document_type,
      debtor_name: form.debtor_name.trim(),

      due_date: form.due_date,

      external_id: form.external_id.trim(),

      original_amount: originalAmount.toFixed(2),

      receivable_type: form.receivable_type,

      reference_number:
        form.reference_number.trim(),
    };

    /*
     * Os dados específicos de boleto somente são enviados
     * quando o tipo selecionado for BOLETO.
     */
    if (form.receivable_type === "BOLETO") {
      payload.boleto = {
        ...form.boleto,
        bank_code: form.boleto.bank_code.trim(),
        barcode: form.boleto.barcode.trim(),
        digitable_line:
          form.boleto.digitable_line.trim(),
        document_number:
          form.boleto.document_number.trim(),
        nosso_numero:
          form.boleto.nosso_numero.trim(),
        beneficiary_document:
          form.boleto.beneficiary_document.trim(),
        beneficiary_name:
          form.boleto.beneficiary_name.trim(),
        payer_document:
          form.boleto.payer_document.trim(),
        payer_name:
          form.boleto.payer_name.trim(),
      };
    }

    setSaving(true);

    try {
      const result = await adicionarRecebivel(
        advanceId,
        payload
      );

      if (result) {
        setReceivables((prev) => [
          ...prev,
          result,
        ]);
      }

      setForm(createEmptyReceivable());
      setShowForm(false);
    } catch (err) {
      setLocalError(
        err?.message ||
          err?.error ||
          "Não foi possível adicionar o recebível."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     REMOVER LOCAL
     
     A API fornecida não possui endpoint para remoção.
     Portanto não simulamos DELETE.
  ========================================================= */

  function handleRemoveLocal(index) {
    setReceivables((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  /* =========================================================
     CONTINUAR
  ========================================================= */

  function handleContinue() {
    if (!receivables.length) {
      setLocalError(
        "Adicione pelo menos um recebível antes de continuar."
      );
      return;
    }

    if (onNext) {
      onNext({
        advance,
        receivables,
      });
    }
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <DashboardLayout>

    
    <div className="recebiveis-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="recebiveis-header">

        <button
          type="button"
          className="recebiveis-back-button"
          onClick={onBack}
          disabled={loading || saving}
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div>
          <h1>Recebíveis</h1>

          <p>
            Adicione os recebíveis que farão parte
            desta antecipação.
          </p>
        </div>

      </div>

      {/* =====================================================
          RESUMO
      ===================================================== */}

      <div className="recebiveis-summary">

        <div className="recebiveis-summary-item">

          <span>Solicitação</span>

          <strong>
            {advance?.external_id ||
              advance?.id ||
              advanceId ||
              "-"}
          </strong>

        </div>

        <div className="recebiveis-summary-item">

          <span>Recebíveis adicionados</span>

          <strong>
            {receivables.length}
          </strong>

        </div>

        <div className="recebiveis-summary-item">

          <span>Valor total</span>

          <strong>
            {formatCurrency(totalAmount)}
          </strong>

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {(localError || error) && (
        <div className="recebiveis-error">

          <strong>
            Não foi possível concluir a operação.
          </strong>

          <span>
            {localError ||
              error?.message ||
              error?.error ||
              "Verifique os dados informados."}
          </span>

        </div>
      )}

      {/* =====================================================
          RECEBÍVEIS
      ===================================================== */}

      <section className="recebiveis-section">

        <div className="recebiveis-section-header">

          <div>
            <h2>Recebíveis adicionados</h2>

            <p>
              Estes recebíveis serão considerados
              na solicitação de antecipação.
            </p>
          </div>

          <button
            type="button"
            className="recebiveis-add-button"
            onClick={() => {
              setShowForm(true);
              setLocalError("");
            }}
            disabled={saving}
          >
            <Plus size={18} />
            Adicionar recebível
          </button>

        </div>

        {receivables.length === 0 ? (
          <div className="recebiveis-empty">

            <div className="recebiveis-empty-icon">
              <FileText size={25} />
            </div>

            <h3>Nenhum recebível adicionado</h3>

            <p>
              Adicione um boleto, plantão médico,
              duplicata ou outro recebível elegível.
            </p>

            <button
              type="button"
              onClick={() => {
                setShowForm(true);
                setLocalError("");
              }}
            >
              <Plus size={17} />
              Adicionar recebível
            </button>

          </div>
        ) : (
          <div className="recebiveis-list">

            {receivables.map((receivable, index) => (
              <div
                className="recebiveis-list-item"
                key={
                  receivable?.id ||
                  receivable?.external_id ||
                  index
                }
              >

                <ReceivableCard
                  receivable={receivable}
                />

                {!receivable?.id && (
                  <button
                    type="button"
                    className="recebiveis-remove-button"
                    onClick={() =>
                      handleRemoveLocal(index)
                    }
                    title="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

              </div>
            ))}

          </div>
        )}

      </section>

      {/* =====================================================
          FORMULÁRIO
      ===================================================== */}

      {showForm && (
        <section className="recebiveis-form-section">

          <div className="recebiveis-form-header">

            <div>
              <h2>Novo recebível</h2>

              <p>
                Informe os dados do recebível.
              </p>
            </div>

            <button
              type="button"
              className="recebiveis-close-button"
              onClick={() => {
                setShowForm(false);
                setForm(createEmptyReceivable());
              }}
              disabled={saving}
            >
              Cancelar
            </button>

          </div>

          <form
            className="recebiveis-form"
            onSubmit={handleAddReceivable}
          >

            {/* =================================================
                TIPO
            ================================================= */}

            <div className="recebiveis-field">

              <label htmlFor="receivable_type">
                Tipo de recebível
              </label>

              <select
                id="receivable_type"
                name="receivable_type"
                value={form.receivable_type}
                onChange={handleChange}
                disabled={saving}
                required
              >
                {RECEIVABLE_TYPES.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                ))}
              </select>

            </div>

            {/* =================================================
                ID EXTERNO
            ================================================= */}

            <div className="recebiveis-field">

              <label htmlFor="external_id">
                Identificador externo
              </label>

              <input
                id="external_id"
                name="external_id"
                value={form.external_id}
                onChange={handleChange}
                placeholder="Ex.: rec-001"
                disabled={saving}
                required
              />

            </div>

            {/* =================================================
                DEVEDOR
            ================================================= */}

            <div className="recebiveis-field">

              <label htmlFor="debtor_name">
                Devedor
              </label>

              <input
                id="debtor_name"
                name="debtor_name"
                value={form.debtor_name}
                onChange={handleChange}
                placeholder="Nome do devedor"
                disabled={saving}
                required
              />

            </div>

            <div className="recebiveis-field">

              <label htmlFor="debtor_document_type">
                Tipo do documento
              </label>

              <select
                id="debtor_document_type"
                name="debtor_document_type"
                value={form.debtor_document_type}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="CNPJ">CNPJ</option>
                <option value="CPF">CPF</option>
              </select>

            </div>

            <div className="recebiveis-field">

              <label htmlFor="debtor_document">
                Documento do devedor
              </label>

              <input
                id="debtor_document"
                name="debtor_document"
                value={form.debtor_document}
                onChange={handleChange}
                placeholder="Documento"
                disabled={saving}
              />

            </div>

            {/* =================================================
                VALOR
            ================================================= */}

            <div className="recebiveis-field">

              <label htmlFor="original_amount">
                Valor original
              </label>

              <div className="recebiveis-currency">

                <span>R$</span>

                <input
                  id="original_amount"
                  name="original_amount"
                  value={form.original_amount}
                  onChange={handleAmountChange}
                  placeholder="0,00"
                  inputMode="decimal"
                  disabled={saving}
                  required
                />

              </div>

            </div>

            {/* =================================================
                VENCIMENTO
            ================================================= */}

            <div className="recebiveis-field">

              <label htmlFor="due_date">
                Vencimento
              </label>

              <input
                id="due_date"
                name="due_date"
                type="date"
                value={form.due_date}
                onChange={handleChange}
                disabled={saving}
                required
              />

            </div>

            {/* =================================================
                REFERÊNCIA
            ================================================= */}

            <div className="recebiveis-field">

              <label htmlFor="reference_number">
                Número de referência
                <span>opcional</span>
              </label>

              <input
                id="reference_number"
                name="reference_number"
                value={form.reference_number}
                onChange={handleChange}
                placeholder="Ex.: NF-12345"
                disabled={saving}
              />

            </div>

            {/* =================================================
                BOLETO
            ================================================= */}

            {form.receivable_type === "BOLETO" && (
              <div className="recebiveis-specific">

                <div className="recebiveis-specific-header">
                  <h3>Dados do boleto</h3>

                  <p>
                    Informe os dados necessários para
                    identificar o boleto.
                  </p>
                </div>

                <div className="recebiveis-form-grid">

                  <div className="recebiveis-field">

                    <label htmlFor="bank_code">
                      Banco
                    </label>

                    <input
                      id="bank_code"
                      name="bank_code"
                      value={form.boleto.bank_code}
                      onChange={handleBoletoChange}
                      placeholder="001"
                      disabled={saving}
                    />

                  </div>

                  <div className="recebiveis-field">

                    <label htmlFor="document_number">
                      Número do documento
                    </label>

                    <input
                      id="document_number"
                      name="document_number"
                      value={form.boleto.document_number}
                      onChange={handleBoletoChange}
                      disabled={saving}
                    />

                  </div>

                  <div className="recebiveis-field recebiveis-field-full">

                    <label htmlFor="barcode">
                      Código de barras
                    </label>

                    <input
                      id="barcode"
                      name="barcode"
                      value={form.boleto.barcode}
                      onChange={handleBoletoChange}
                      placeholder="Código de barras"
                      disabled={saving}
                    />

                  </div>

                  <div className="recebiveis-field recebiveis-field-full">

                    <label htmlFor="digitable_line">
                      Linha digitável
                    </label>

                    <input
                      id="digitable_line"
                      name="digitable_line"
                      value={form.boleto.digitable_line}
                      onChange={handleBoletoChange}
                      placeholder="Linha digitável"
                      disabled={saving}
                    />

                  </div>

                  <div className="recebiveis-field">

                    <label htmlFor="nosso_numero">
                      Nosso número
                    </label>

                    <input
                      id="nosso_numero"
                      name="nosso_numero"
                      value={form.boleto.nosso_numero}
                      onChange={handleBoletoChange}
                      disabled={saving}
                    />

                  </div>

                  <div className="recebiveis-field">

                    <label htmlFor="beneficiary_name">
                      Beneficiário
                    </label>

                    <input
                      id="beneficiary_name"
                      name="beneficiary_name"
                      value={form.boleto.beneficiary_name}
                      onChange={handleBoletoChange}
                      disabled={saving}
                    />

                  </div>

                  <div className="recebiveis-field">

                    <label htmlFor="beneficiary_document">
                      Documento do beneficiário
                    </label>

                    <input
                      id="beneficiary_document"
                      name="beneficiary_document"
                      value={
                        form.boleto.beneficiary_document
                      }
                      onChange={handleBoletoChange}
                      disabled={saving}
                    />

                  </div>

                  <div className="recebiveis-field">

                    <label htmlFor="payer_name">
                      Pagador
                    </label>

                    <input
                      id="payer_name"
                      name="payer_name"
                      value={form.boleto.payer_name}
                      onChange={handleBoletoChange}
                      disabled={saving}
                    />

                  </div>

                  <div className="recebiveis-field">

                    <label htmlFor="payer_document">
                      Documento do pagador
                    </label>

                    <input
                      id="payer_document"
                      name="payer_document"
                      value={form.boleto.payer_document}
                      onChange={handleBoletoChange}
                      disabled={saving}
                    />

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="recebiveis-form-actions">

              <button
                type="button"
                className="recebiveis-cancel-button"
                onClick={() => {
                  setShowForm(false);
                  setForm(createEmptyReceivable());
                }}
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="recebiveis-save-button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      className="recebiveis-spinner"
                    />

                    Adicionando...
                  </>
                ) : (
                  <>
                    <Plus size={17} />

                    Adicionar recebível
                  </>
                )}
              </button>

            </div>

          </form>

        </section>
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="recebiveis-footer">

        <div className="recebiveis-footer-info">

          <CheckCircle2 size={17} />

          <span>
            Você poderá revisar os recebíveis antes
            de enviar a solicitação para análise.
          </span>

        </div>

        <button
          type="button"
          className="recebiveis-continue-button"
          onClick={handleContinue}
          disabled={
            loading ||
            saving ||
            receivables.length === 0
          }
        >
          Continuar

          <ArrowRight size={18} />
        </button>

      </div>

    </div>
    </DashboardLayout>
  );
}