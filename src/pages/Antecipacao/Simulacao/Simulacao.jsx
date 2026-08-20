import React, { useEffect, useState } from "react";
import { ArrowLeft, Calculator, CheckCircle2, Loader2 } from "lucide-react";
import DashboardLayout from "../../../layout/DashboardLayout";
import "./Simulacao.css";

import SimulationResult from "../../../components/antecipacao/SimulationResult";
import useAntecipacao from "../../../hooks/useAntecipacao";

/* =========================================================
   FORMATAÇÃO
========================================================= */

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

function formatCurrencyInput(value) {
  const numbers = String(value || "").replace(/\D/g, "");

  if (!numbers) {
    return "";
  }

  const number = Number(numbers) / 100;

  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseCurrency(value) {
  if (!value) {
    return 0;
  }

  return Number(String(value).replace(/\./g, "").replace(",", "."));
}

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
    value: "OTHER",
    label: "Outros",
  },
];

/* =========================================================
   COMPONENTE
========================================================= */

export default function Simulacao({ onBack, accountId }) {
  const { simular, simulacao, loading, error, limparSimulacao } =
    useAntecipacao();
const user = JSON.parse(localStorage.getItem("user"))
      console.log()
  const [form, setForm] = useState({
    account_id: user.user.account_id,
    amount: "",
    currency_code: "BRL",
    due_date: "",
    funding_partner_id: "",
    receivable_type: "MEDICAL_SHIFT",
    segment: "MEDICAL",
    term_days: "30",
  });

  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  /* =========================================================
     ATUALIZA CONTA
  ========================================================= */

  useEffect(() => {
    if (accountId) {
      setForm((prev) => ({
        ...prev,
        account_id: accountId,
      }));
    }
  }, [accountId]);

  /* =========================================================
     LIMPA SIMULAÇÃO AO ENTRAR
  ========================================================= */

  useEffect(() => {
    limparSimulacao?.();

    return () => {
      limparSimulacao?.();
    };
  }, [limparSimulacao]);

  /* =========================================================
     ALTERAÇÃO DOS CAMPOS
  ========================================================= */

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitted(false);
  }

  /* =========================================================
     VALOR
  ========================================================= */

  function handleAmountChange(event) {
    const formatted = formatCurrencyInput(event.target.value);

    setForm((prev) => ({
      ...prev,
      amount: formatted,
    }));

    setSubmitted(false);
  }

  function calculateDueDate(termDays) {
    const date = new Date();

    date.setDate(date.getDate() + Number(termDays));

    return date.toISOString().split("T")[0];
  }
  /* =========================================================
     SUBMIT
  ========================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    console.log("SUBMIT FOI CHAMADO");
    console.log("FORM:", form);

    const amount = parseCurrency(form.amount);

    console.log("AMOUNT:", amount);

    if (!form.account_id) {
      console.log("ERRO: account_id vazio");
      return;
    }

    if (!amount || amount <= 0) {
      console.log("ERRO: amount inválido");
      return;
    }

    if (!form.due_date) {
      console.log("ERRO: due_date vazio");
      return;
    }

    if (!form.term_days || Number(form.term_days) <= 0) {
      console.log("ERRO: term_days inválido");
      return;
    }

    const termDays = Number(form.term_days);

    const dueDate = calculateDueDate(termDays);

    const payload = {
      account_id: form.account_id,
      amount: amount.toFixed(2),
      currency_code: form.currency_code,
      receivable_type: form.receivable_type,
      segment: form.segment,
      term_days: termDays,
      due_date: dueDate,
    };

    if (form.funding_partner_id.trim()) {
      payload.funding_partner_id = form.funding_partner_id.trim();
    }

    console.log("PAYLOAD:", payload);

    setSubmitted(true);

    try {
      const result = await simular(payload);

      console.log("RESULTADO DA SIMULAÇÃO:", result);
    } catch (err) {
      console.error("ERRO NA SIMULAÇÃO:", err);
    }
  }

  /* =========================================================
     NOVA SIMULAÇÃO
  ========================================================= */

  function handleNewSimulation() {
    limparSimulacao?.();

    setSubmitted(false);

    setForm((prev) => ({
      ...prev,
      amount: "",
      due_date: "",
      term_days: "30",
      funding_partner_id: "",
    }));
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <DashboardLayout>

    
    <div className="simulacao-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="simulacao-header">
        

        <div className="simulacao-title-wrapper">
          <div className="simulacao-icon">
            <Calculator size={22} />
          </div>

          <div>
            <h1>Simular antecipação</h1>

            <p>
              Consulte as condições antes de solicitar a antecipação dos seus
              recebíveis.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <div className="simulacao-content">
        {!simulacao ? (
          <form className="simulacao-form-card" onSubmit={handleSubmit}>
            <div className="simulacao-card-header">
              <div>
                <h2>Dados da antecipação</h2>

                <p>Informe os dados do recebível para calcular as condições.</p>
              </div>
            </div>

            {/* =================================================
                VALOR
            ================================================= */}

            <div className="simulacao-form-grid">
              <div className="simulacao-field simulacao-field-full">
                <label htmlFor="amount">Valor do recebível</label>

                <div className="simulacao-input-prefix">
                  <span>R$</span>

                  <input
                    id="amount"
                    name="amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={form.amount}
                    onChange={handleAmountChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* =================================================
                  DATA DE VENCIMENTO
              ================================================= */}

              <div className="simulacao-field">
                <label htmlFor="due_date">Data de vencimento</label>

                <input
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={form.due_date}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* =================================================
                  PRAZO
              ================================================= */}

              <div className="simulacao-field">
                <label htmlFor="term_days">Prazo desejado</label>

                <div className="simulacao-input-suffix">
                  <input
                    id="term_days"
                    name="term_days"
                    type="number"
                    min="1"
                    value={form.term_days}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <span>dias</span>
                </div>
              </div>

              {/* =================================================
                  TIPO
              ================================================= */}

              <div className="simulacao-field">
                <label htmlFor="receivable_type">Tipo de recebível</label>

                <select
                  id="receivable_type"
                  name="receivable_type"
                  value={form.receivable_type}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {RECEIVABLE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* =================================================
                  SEGMENTO
              ================================================= */}

              <div className="simulacao-field">
                <label htmlFor="segment">Segmento</label>

                <select
                  id="segment"
                  name="segment"
                  value={form.segment}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {SEGMENTS.map((segment) => (
                    <option key={segment.value} value={segment.value}>
                      {segment.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* =================================================
                  FUNDO
              ================================================= */}

              <div className="simulacao-field simulacao-field-full">
                <label htmlFor="funding_partner_id">
                  Fundo financiador
                  <span className="optional-label">opcional</span>
                </label>

                <input
                  id="funding_partner_id"
                  name="funding_partner_id"
                  type="text"
                  placeholder="ID do fundo financiador"
                  value={form.funding_partner_id}
                  onChange={handleChange}
                  disabled={loading}
                />

                <small>
                  Deixe em branco para permitir que a plataforma determine o
                  fundo aplicável.
                </small>
              </div>
            </div>

            {/* =================================================
                ERRO
            ================================================= */}

            {error && (
              <div className="simulacao-error">
                <strong>Não foi possível realizar a simulação.</strong>

                <span>
                  {error?.message ||
                    error?.error ||
                    "Ocorreu um erro ao consultar as condições."}
                </span>
              </div>
            )}

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="simulacao-form-footer">
              <div className="simulacao-security-info">
                <CheckCircle2 size={16} />

                <span>
                  A simulação não cria uma solicitação de antecipação.
                </span>
              </div>

              <button
                type="submit"
                className="simulacao-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="simulacao-loading-icon" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Calculator size={18} />
                    Simular antecipação
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="simulacao-result-wrapper">
            <SimulationResult simulation={simulacao} />

            <div className="simulacao-result-actions">
              <button
                type="button"
                className="simulacao-secondary-button"
                onClick={handleNewSimulation}
              >
                Nova simulação
              </button>

              {onBack && (
                <button
                  type="button"
                  className="simulacao-primary-button"
                  onClick={onBack}
                >
                  Continuar
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
}
