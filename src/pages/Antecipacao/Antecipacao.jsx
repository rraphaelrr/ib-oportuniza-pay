import React, { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../../layout/DashboardLayout";

import useAntecipacao from "../../hooks/useAntecipacao";

import AdvanceStatusBadge from "../../components/antecipacao/AdvanceStatusBadge";
import AdvanceSummaryCard from "../../components/antecipacao/AdvanceSummaryCard";
import OfferCard from "../../components/antecipacao/OfferCard";
import ReceivableCard from "../../components/antecipacao/ReceivableCard";
import SimulationResult from "../../components/antecipacao/SimulationResult";
import StepIndicator from "../../components/antecipacao/StepIndicator";

import "./Antecipacao.css";

/*
|--------------------------------------------------------------------------
| CONSTANTES
|--------------------------------------------------------------------------
*/

const STEPS = [
  {
    id: 1,
    label: "Solicitação",
  },
  {
    id: 2,
    label: "Recebíveis",
  },
  {
    id: 3,
    label: "Documentos",
  },
  {
    id: 4,
    label: "Análise",
  },
  {
    id: 5,
    label: "Ofertas",
  },
];

const SEGMENTS = [
  {
    value: "MEDICAL",
    label: "Médico",
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
    label: "Serviços",
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
    label: "Outros",
  },
];

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
    label: "Outros",
  },
];

/*
|--------------------------------------------------------------------------
| FORMATAÇÃO
|--------------------------------------------------------------------------
*/

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return "R$ 0,00";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "R$ 0,00";
  }

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("pt-BR");
}

/*
|--------------------------------------------------------------------------
| COMPONENTE
|--------------------------------------------------------------------------
*/

export default function Antecipacao() {
  /*
  |--------------------------------------------------------------------------
  | HOOK
  |--------------------------------------------------------------------------
  */

  const {
    antecipacoes,
    antecipacao,
    ofertas,
    simulacao,

    loading,
    error,

    carregarAntecipacoes,
    carregarAntecipacao,
    carregarOfertas,

    criar,
    simular,
    adicionarRecebivel,
    enviarParaAnalise,
    aceitar,

    limparSimulacao,
    clearError,
  } = useAntecipacao();

  /*
  |--------------------------------------------------------------------------
  | ESTADOS DA TELA
  |--------------------------------------------------------------------------
  */

  const [step, setStep] = useState(1);

  const [showForm, setShowForm] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | FORMULÁRIO
  |--------------------------------------------------------------------------
  */

  const [form, setForm] = useState({
    account_id: "",
    agency_id: "",
    external_id: "",
    origin_partner_id: "",
    requested_amount: "",
    average_term_days: "",
    currency_code: "BRL",
    segment: "MEDICAL",
    notes: "",
  });

  /*
  |--------------------------------------------------------------------------
  | RECEBÍVEL
  |--------------------------------------------------------------------------
  */

  const [receivableForm, setReceivableForm] = useState({
    external_id: "",
    debtor_name: "",
    debtor_document: "",
    debtor_document_type: "CNPJ",
    due_date: "",
    original_amount: "",
    currency_code: "BRL",
    receivable_type: "MEDICAL_SHIFT",
    reference_number: "",
  });

  /*
  |--------------------------------------------------------------------------
  | CARREGAMENTO INICIAL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    carregarAntecipacoes();
  }, [carregarAntecipacoes]);

  /*
  |--------------------------------------------------------------------------
  | ATUALIZAR FORM
  |--------------------------------------------------------------------------
  */

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateReceivableForm(field, value) {
    setReceivableForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | NOVA SOLICITAÇÃO
  |--------------------------------------------------------------------------
  */

  function handleNovaAntecipacao() {
    setSelectedId(null);
    setShowForm(true);
    setStep(1);
    limparSimulacao();
    clearError();

    setForm({
      account_id: "",
      agency_id: "",
      external_id: `advance-${Date.now()}`,
      origin_partner_id: "",
      requested_amount: "",
      average_term_days: "",
      currency_code: "BRL",
      segment: "MEDICAL",
      notes: "",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | CRIAR SOLICITAÇÃO
  |--------------------------------------------------------------------------
  */

  async function handleCriar(e) {
    e.preventDefault();

    try {
      const payload = {
        account_id: form.account_id,
        agency_id: form.agency_id,
        external_id: form.external_id,
        origin_partner_id: form.origin_partner_id,
        requested_amount: form.requested_amount,
        average_term_days: Number(form.average_term_days),
        currency_code: form.currency_code,
        segment: form.segment,
        notes: form.notes,
      };

      const data = await criar(payload);

      setSelectedId(data.id);

      setStep(2);

      await carregarAntecipacao(data.id);
    } catch (err) {
      // O hook já trata o erro.
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SIMULAÇÃO
  |--------------------------------------------------------------------------
  */

  async function handleSimular() {
    if (!form.account_id) {
      return;
    }

    if (!form.requested_amount) {
      return;
    }

    try {
      await simular({
        account_id: form.account_id,
        amount: form.requested_amount,
        currency_code: form.currency_code,
        due_date: getSimulationDueDate(),
        receivable_type:
          form.segment === "MEDICAL"
            ? "MEDICAL_SHIFT"
            : form.segment,
        segment: form.segment,
        term_days: Number(form.average_term_days || 0),
      });
    } catch (err) {
      // O hook já trata o erro.
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DATA DA SIMULAÇÃO
  |--------------------------------------------------------------------------
  */

  function getSimulationDueDate() {
    const days = Number(form.average_term_days || 0);

    const date = new Date();

    date.setDate(date.getDate() + days);

    return date.toISOString().split("T")[0];
  }

  /*
  |--------------------------------------------------------------------------
  | ADICIONAR RECEBÍVEL
  |--------------------------------------------------------------------------
  */

  async function handleAdicionarRecebivel(e) {
    e.preventDefault();

    if (!selectedId) {
      return;
    }

    try {
      await adicionarRecebivel(selectedId, {
        ...receivableForm,
        original_amount: receivableForm.original_amount,
      });

      setReceivableForm({
        external_id: "",
        debtor_name: "",
        debtor_document: "",
        debtor_document_type: "CNPJ",
        due_date: "",
        original_amount: "",
        currency_code: "BRL",
        receivable_type: "MEDICAL_SHIFT",
        reference_number: "",
      });

      await carregarAntecipacao(selectedId);
    } catch (err) {
      // O hook já trata o erro.
    }
  }

  /*
  |--------------------------------------------------------------------------
  | ENVIAR PARA ANÁLISE
  |--------------------------------------------------------------------------
  */

  async function handleEnviarAnalise() {
    if (!selectedId) {
      return;
    }

    try {
      await enviarParaAnalise(selectedId, {
        reason: "Documentação suficiente",
      });

      await carregarAntecipacao(selectedId);

      setStep(4);
    } catch (err) {
      // O hook já trata o erro.
    }
  }

  /*
  |--------------------------------------------------------------------------
  | ACEITAR OFERTA
  |--------------------------------------------------------------------------
  */

  async function handleAceitarOferta(offerId) {
    if (!selectedId) {
      return;
    }

    try {
      await aceitar(selectedId, offerId);

      await carregarAntecipacao(selectedId);

      await carregarOfertas(selectedId);
    } catch (err) {
      // O hook já trata o erro.
    }
  }

  /*
  |--------------------------------------------------------------------------
  | ABRIR SOLICITAÇÃO
  |--------------------------------------------------------------------------
  */

  async function handleAbrirAntecipacao(id) {
    try {
      setSelectedId(id);
      setShowForm(true);

      await carregarAntecipacao(id);

      await carregarOfertas(id);

      setStep(2);
    } catch (err) {
      // O hook já trata o erro.
    }
  }

  /*
  |--------------------------------------------------------------------------
  | VOLTAR PARA LISTA
  |--------------------------------------------------------------------------
  */

  function handleVoltar() {
    setShowForm(false);
    setSelectedId(null);
    setStep(1);
    limparSimulacao();
    clearError();

    carregarAntecipacoes();
  }

  /*
  |--------------------------------------------------------------------------
  | RECEBÍVEIS
  |--------------------------------------------------------------------------
  */

  const recebiveis = useMemo(() => {
    return antecipacao?.receivables || [];
  }, [antecipacao]);

  /*
  |--------------------------------------------------------------------------
  | STATUS
  |--------------------------------------------------------------------------
  */

  const status = antecipacao?.status;

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <DashboardLayout>
      <div className="antecipacao-page">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="antecipacao-header">
          <div>
            <h1>Antecipação de Recebíveis</h1>

            <p>
              Antecipe seus recebíveis e acompanhe as propostas
              dos fundos.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              className="antecipacao-primary-button"
              onClick={handleNovaAntecipacao}
            >
              Nova antecipação
            </button>
          )}
        </div>

        {/* =====================================================
            ERRO
        ====================================================== */}

        {error && (
          <div className="antecipacao-error">
            <span>{error}</span>

            <button
              type="button"
              onClick={clearError}
            >
              ×
            </button>
          </div>
        )}

        {/* =====================================================
            LISTA
        ====================================================== */}

        {!showForm && (
          <section className="antecipacao-list-section">
            <div className="section-heading">
              <div>
                <h2>Minhas antecipações</h2>

                <p>
                  Acompanhe suas solicitações de antecipação.
                </p>
              </div>
            </div>

            {loading && antecipacoes.length === 0 ? (
              <div className="antecipacao-loading">
                Carregando antecipações...
              </div>
            ) : antecipacoes.length === 0 ? (
              <div className="antecipacao-empty">
                <div className="antecipacao-empty-icon">
                  ↗
                </div>

                <h3>Nenhuma antecipação encontrada</h3>

                <p>
                  Crie sua primeira solicitação de antecipação
                  de recebíveis.
                </p>

                <button
                  type="button"
                  className="antecipacao-primary-button"
                  onClick={handleNovaAntecipacao}
                >
                  Criar antecipação
                </button>
              </div>
            ) : (
              <div className="antecipacao-grid">
                {antecipacoes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="antecipacao-list-card"
                    onClick={() =>
                      handleAbrirAntecipacao(item.id)
                    }
                  >
                    <div className="antecipacao-list-card-top">
                      <span className="antecipacao-list-id">
                        {item.external_id || item.id}
                      </span>

                      <AdvanceStatusBadge
                        status={item.status}
                      />
                    </div>

                    <div className="antecipacao-list-card-value">
                      {formatCurrency(
                        item.requested_amount
                      )}
                    </div>

                    <div className="antecipacao-list-card-info">
                      <span>
                        {item.segment || "Não informado"}
                      </span>

                      <span>
                        {item.average_term_days
                          ? `${item.average_term_days} dias`
                          : "-"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            FLUXO DE CRIAÇÃO / DETALHE
        ====================================================== */}

        {showForm && (
          <section className="antecipacao-workflow">
            {/* =================================================
                VOLTAR
            ================================================== */}

            <button
              type="button"
              className="antecipacao-back-button"
              onClick={handleVoltar}
            >
              ← Voltar para antecipações
            </button>

            {/* =================================================
                STEPS
            ================================================== */}

            <StepIndicator
              steps={STEPS}
              currentStep={step}
            />

            {/* =================================================
                RESUMO
            ================================================== */}

            {antecipacao && (
              <AdvanceSummaryCard
                advance={antecipacao}
              />
            )}

            {/* =================================================
                STEP 1
            ================================================== */}

            {step === 1 && (
              <div className="antecipacao-step">
                <div className="antecipacao-step-header">
                  <div>
                    <span className="antecipacao-step-number">
                      01
                    </span>

                    <div>
                      <h2>Nova solicitação</h2>

                      <p>
                        Informe os dados da antecipação.
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  className="antecipacao-form"
                  onSubmit={handleCriar}
                >
                  <div className="antecipacao-form-grid">
                    <div className="antecipacao-field">
                      <label>Conta</label>

                      <input
                        type="text"
                        value={form.account_id}
                        onChange={(e) =>
                          updateForm(
                            "account_id",
                            e.target.value
                          )
                        }
                        placeholder="ID da conta"
                        required
                      />
                    </div>

                    <div className="antecipacao-field">
                      <label>Agência</label>

                      <input
                        type="text"
                        value={form.agency_id}
                        onChange={(e) =>
                          updateForm(
                            "agency_id",
                            e.target.value
                          )
                        }
                        placeholder="ID da agência"
                        required
                      />
                    </div>

                    <div className="antecipacao-field">
                      <label>ID externo</label>

                      <input
                        type="text"
                        value={form.external_id}
                        onChange={(e) =>
                          updateForm(
                            "external_id",
                            e.target.value
                          )
                        }
                        placeholder="Identificador da operação"
                        required
                      />
                    </div>

                    <div className="antecipacao-field">
                      <label>Partner de origem</label>

                      <input
                        type="text"
                        value={form.origin_partner_id}
                        onChange={(e) =>
                          updateForm(
                            "origin_partner_id",
                            e.target.value
                          )
                        }
                        placeholder="ID do partner"
                        required
                      />
                    </div>

                    <div className="antecipacao-field">
                      <label>Valor solicitado</label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.requested_amount}
                        onChange={(e) =>
                          updateForm(
                            "requested_amount",
                            e.target.value
                          )
                        }
                        placeholder="0,00"
                        required
                      />
                    </div>

                    <div className="antecipacao-field">
                      <label>Prazo médio</label>

                      <div className="antecipacao-input-with-suffix">
                        <input
                          type="number"
                          min="1"
                          value={form.average_term_days}
                          onChange={(e) =>
                            updateForm(
                              "average_term_days",
                              e.target.value
                            )
                          }
                          placeholder="Ex.: 45"
                          required
                        />

                        <span>dias</span>
                      </div>
                    </div>

                    <div className="antecipacao-field">
                      <label>Segmento</label>

                      <select
                        value={form.segment}
                        onChange={(e) =>
                          updateForm(
                            "segment",
                            e.target.value
                          )
                        }
                      >
                        {SEGMENTS.map((item) => (
                          <option
                            key={item.value}
                            value={item.value}
                          >
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="antecipacao-field">
                      <label>Moeda</label>

                      <select
                        value={form.currency_code}
                        onChange={(e) =>
                          updateForm(
                            "currency_code",
                            e.target.value
                          )
                        }
                      >
                        <option value="BRL">
                          BRL — Real brasileiro
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="antecipacao-field">
                    <label>Observações</label>

                    <textarea
                      value={form.notes}
                      onChange={(e) =>
                        updateForm(
                          "notes",
                          e.target.value
                        )
                      }
                      placeholder="Informações adicionais sobre a solicitação..."
                      rows={4}
                    />
                  </div>

                  {/* SIMULAÇÃO */}

                  <div className="antecipacao-simulation-box">
                    <div>
                      <h3>Antes de criar</h3>

                      <p>
                        Simule os custos e o valor líquido da
                        antecipação.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="antecipacao-secondary-button"
                      onClick={handleSimular}
                      disabled={loading}
                    >
                      {loading
                        ? "Simulando..."
                        : "Simular antecipação"}
                    </button>
                  </div>

                  {simulacao && (
                    <SimulationResult
                      simulation={simulacao}
                    />
                  )}

                  <div className="antecipacao-form-actions">
                    <button
                      type="submit"
                      className="antecipacao-primary-button"
                      disabled={loading}
                    >
                      {loading
                        ? "Criando..."
                        : "Criar solicitação"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* =================================================
                STEP 2
            ================================================== */}

            {step === 2 && (
              <div className="antecipacao-step">
                <div className="antecipacao-step-header">
                  <div>
                    <span className="antecipacao-step-number">
                      02
                    </span>

                    <div>
                      <h2>Recebíveis</h2>

                      <p>
                        Adicione os recebíveis que farão parte
                        da antecipação.
                      </p>
                    </div>
                  </div>
                </div>

                {recebiveis.length > 0 && (
                  <div className="receivables-list">
                    {recebiveis.map((item) => (
                      <ReceivableCard
                        key={item.id}
                        receivable={item}
                      />
                    ))}
                  </div>
                )}

                <form
                  className="antecipacao-form"
                  onSubmit={handleAdicionarRecebivel}
                >
                  <div className="antecipacao-form-title">
                    Adicionar recebível
                  </div>

                  <div className="antecipacao-form-grid">
                    <div className="antecipacao-field">
                      <label>ID externo</label>

                      <input
                        type="text"
                        value={
                          receivableForm.external_id
                        }
                        onChange={(e) =>
                          updateReceivableForm(
                            "external_id",
                            e.target.value
                          )
                        }
                        placeholder="rec-001"
                        required
                      />
                    </div>

                    <div className="antecipacao-field">
                      <label>Devedor</label>

                      <input
                        type="text"
                        value={
                          receivableForm.debtor_name
                        }
                        onChange={(e) =>
                          updateReceivableForm(
                            "debtor_name",
                            e.target.value
                          )
                        }
                        placeholder="Nome do devedor"
                        required
                      />
                    </div>

                    <div className="antecipacao-field">
                      <label>Documento</label>

                      <input
                        type="text"
                        value={
                          receivableForm.debtor_document
                        }
                        onChange={(e) =>
                          updateReceivableForm(
                            "debtor_document",
                            e.target.value
                          )
                        }
                        placeholder="CNPJ / CPF"
                      />
                    </div>

                    <div className="antecipacao-field">
                      <label>Vencimento</label>

                      <input
                        type="date"
                        value={
                          receivableForm.due_date
                        }
                        onChange={(e) =>
                          updateReceivableForm(
                            "due_date",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="antecipacao-field">
                      <label>Valor original</label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          receivableForm.original_amount
                        }
                        onChange={(e) =>
                          updateReceivableForm(
                            "original_amount",
                            e.target.value
                          )
                        }
                        placeholder="0,00"
                        required
                      />
                    </div>

                    <div className="antecipacao-field">
                      <label>Tipo</label>

                      <select
                        value={
                          receivableForm.receivable_type
                        }
                        onChange={(e) =>
                          updateReceivableForm(
                            "receivable_type",
                            e.target.value
                          )
                        }
                      >
                        {RECEIVABLE_TYPES.map((item) => (
                          <option
                            key={item.value}
                            value={item.value}
                          >
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="antecipacao-field">
                      <label>Referência</label>

                      <input
                        type="text"
                        value={
                          receivableForm.reference_number
                        }
                        onChange={(e) =>
                          updateReceivableForm(
                            "reference_number",
                            e.target.value
                          )
                        }
                        placeholder="Número de referência"
                      />
                    </div>
                  </div>

                  <div className="antecipacao-form-actions">
                    <button
                      type="submit"
                      className="antecipacao-secondary-button"
                      disabled={loading}
                    >
                      {loading
                        ? "Adicionando..."
                        : "Adicionar recebível"}
                    </button>
                  </div>
                </form>

                <div className="antecipacao-navigation-actions">
                  <button
                    type="button"
                    className="antecipacao-primary-button"
                    disabled={
                      loading ||
                      recebiveis.length === 0
                    }
                    onClick={() => setStep(3)}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                STEP 3
            ================================================== */}

            {step === 3 && (
              <div className="antecipacao-step">
                <div className="antecipacao-step-header">
                  <div>
                    <span className="antecipacao-step-number">
                      03
                    </span>

                    <div>
                      <h2>Documentação</h2>

                      <p>
                        Revise os documentos necessários antes
                        de enviar a solicitação.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="antecipacao-documents-placeholder">
                  <div className="antecipacao-documents-icon">
                    ↑
                  </div>

                  <h3>Documentos</h3>

                  <p>
                    O vínculo de documentos será realizado pelo
                    endpoint de documentos da antecipação.
                  </p>

                  <span>
                    POST /partner/v1/receivable-advances/{"{id}"}
                    /documents
                  </span>
                </div>

                <div className="antecipacao-navigation-actions">
                  <button
                    type="button"
                    className="antecipacao-outline-button"
                    onClick={() => setStep(2)}
                  >
                    Voltar
                  </button>

                  <button
                    type="button"
                    className="antecipacao-primary-button"
                    onClick={handleEnviarAnalise}
                    disabled={loading}
                  >
                    {loading
                      ? "Enviando..."
                      : "Enviar para análise"}
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                STEP 4
            ================================================== */}

            {step === 4 && (
              <div className="antecipacao-step">
                <div className="antecipacao-step-header">
                  <div>
                    <span className="antecipacao-step-number">
                      04
                    </span>

                    <div>
                      <h2>Em análise</h2>

                      <p>
                        Sua solicitação foi enviada para análise
                        dos fundos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="antecipacao-analysis">
                  <div className="antecipacao-analysis-icon">
                    ✓
                  </div>

                  <h3>Solicitação enviada</h3>

                  <p>
                    Aguarde o retorno dos fundos participantes.
                    Assim que houver propostas, elas aparecerão
                    nesta tela.
                  </p>

                  {antecipacao?.status && (
                    <AdvanceStatusBadge
                      status={antecipacao.status}
                    />
                  )}
                </div>

                <div className="antecipacao-navigation-actions">
                  <button
                    type="button"
                    className="antecipacao-primary-button"
                    onClick={async () => {
                      await carregarAntecipacao(
                        selectedId
                      );

                      await carregarOfertas(
                        selectedId
                      );

                      setStep(5);
                    }}
                    disabled={loading}
                  >
                    Ver ofertas
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                STEP 5
            ================================================== */}

            {step === 5 && (
              <div className="antecipacao-step">
                <div className="antecipacao-step-header">
                  <div>
                    <span className="antecipacao-step-number">
                      05
                    </span>

                    <div>
                      <h2>Propostas recebidas</h2>

                      <p>
                        Compare as condições oferecidas pelos
                        fundos.
                      </p>
                    </div>
                  </div>
                </div>

                {ofertas.length === 0 ? (
                  <div className="antecipacao-empty-small">
                    <h3>Nenhuma proposta disponível</h3>

                    <p>
                      Ainda não existem ofertas para esta
                      antecipação.
                    </p>

                    <button
                      type="button"
                      className="antecipacao-secondary-button"
                      onClick={() =>
                        carregarOfertas(selectedId)
                      }
                      disabled={loading}
                    >
                      Atualizar ofertas
                    </button>
                  </div>
                ) : (
                  <div className="offers-list">
                    {ofertas.map((offer) => (
                      <OfferCard
                        key={offer.id}
                        offer={offer}
                        onAccept={() =>
                          handleAceitarOferta(
                            offer.id
                          )
                        }
                        loading={loading}
                      />
                    ))}
                  </div>
                )}

                {antecipacao && (
                  <div className="antecipacao-current-status">
                    <span>Status da solicitação</span>

                    <AdvanceStatusBadge
                      status={status}
                    />
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}