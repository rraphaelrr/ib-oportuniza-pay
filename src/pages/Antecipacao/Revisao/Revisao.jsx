import React from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Landmark,
  Receipt,
  Send,
  Wallet,
} from "lucide-react";
import DashboardLayout from "../../../layout/DashboardLayout";
import "./Revisao.css";

function formatCurrency(value) {
  const number = Number(value || 0);

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("pt-BR");
}

function getSegmentLabel(segment) {
  const labels = {
    MEDICAL: "Médico",
    FINANCIAL: "Financeiro",
    SERVICES: "Serviços",
    OTHER: "Outros",
  };

  return labels[segment] || segment || "-";
}

function getReceivableTypeLabel(type) {
  const labels = {
    MEDICAL_SHIFT: "Plantão médico",
    BOLETO: "Boleto",
    DUPLICATE: "Duplicata",
    SERVICE: "Serviço",
    INVOICE: "Nota fiscal",
    CONTRACT: "Contrato",
    OTHER: "Outro",
  };

  return labels[type] || type || "-";
}

export default function Revisao({
  advance = {},
  receivables = [],
  documents = [],
  simulation = null,
  onBack,
  onSubmit,
  loading = false,
}) {
  const requestedAmount =
    advance.requested_amount ?? advance.requestedAmount;

  const grossAmount =
    advance.gross_receivables_amount ??
    advance.grossReceivablesAmount;

  const eligibleAmount =
    advance.eligible_receivables_amount ??
    advance.eligibleReceivablesAmount;

  const averageTerm =
    advance.average_term_days ??
    advance.averageTermDays;

  const currency =
    advance.currency_code ??
    advance.currencyCode ??
    "BRL";

  const segment = advance.segment;

  const externalId =
    advance.external_id ??
    advance.externalId;

  const notes = advance.notes;

  const hasSimulation = Boolean(simulation);

  const totalReceivables = receivables.reduce(
    (total, item) =>
      total + Number(
        item.eligible_amount ??
        item.original_amount ??
        item.originalAmount ??
        0
      ),
    0
  );

  function handleSubmit() {
    if (!onSubmit || loading) return;

    onSubmit();
  }

  return (
    <DashboardLayout>
    <div className="revisao-container">
      <div className="revisao-header">
        <div>
          <span className="revisao-eyebrow">
            ÚLTIMA ETAPA
          </span>

          <h2>Revise sua solicitação</h2>

          <p>
            Confira os dados antes de enviar a antecipação para análise.
          </p>
        </div>

        <div className="revisao-header-icon">
          <CheckCircle2 size={22} />
        </div>
      </div>

      <div className="revisao-content">
        {/* =====================================================
            RESUMO FINANCEIRO
        ===================================================== */}

        <section className="revisao-section">
          <div className="revisao-section-title">
            <div>
              <h3>Resumo financeiro</h3>

              <p>
                Valores informados para a solicitação.
              </p>
            </div>
          </div>

          <div className="revisao-summary-grid">
            <div className="revisao-summary-card">
              <div className="revisao-summary-icon">
                <Wallet size={18} />
              </div>

              <div>
                <span>Valor solicitado</span>

                <strong>
                  {formatCurrency(requestedAmount)}
                </strong>
              </div>
            </div>

            <div className="revisao-summary-card">
              <div className="revisao-summary-icon">
                <Receipt size={18} />
              </div>

              <div>
                <span>Recebíveis brutos</span>

                <strong>
                  {formatCurrency(
                    grossAmount || totalReceivables
                  )}
                </strong>
              </div>
            </div>

            <div className="revisao-summary-card">
              <div className="revisao-summary-icon">
                <Landmark size={18} />
              </div>

              <div>
                <span>Valor elegível</span>

                <strong>
                  {formatCurrency(eligibleAmount)}
                </strong>
              </div>
            </div>

            <div className="revisao-summary-card">
              <div className="revisao-summary-icon">
                <FileText size={18} />
              </div>

              <div>
                <span>Prazo médio</span>

                <strong>
                  {averageTerm
                    ? `${averageTerm} dias`
                    : "-"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            DADOS DA SOLICITAÇÃO
        ===================================================== */}

        <section className="revisao-section">
          <div className="revisao-section-title">
            <div>
              <h3>Dados da solicitação</h3>

              <p>
                Informações gerais da antecipação.
              </p>
            </div>
          </div>

          <div className="revisao-data-card">
            <div className="revisao-data-row">
              <span>Identificação externa</span>

              <strong>
                {externalId || "-"}
              </strong>
            </div>

            <div className="revisao-data-row">
              <span>Segmento</span>

              <strong>
                {getSegmentLabel(segment)}
              </strong>
            </div>

            <div className="revisao-data-row">
              <span>Moeda</span>

              <strong>
                {currency}
              </strong>
            </div>

            {notes && (
              <div className="revisao-data-row revisao-data-row-column">
                <span>Observações</span>

                <strong>
                  {notes}
                </strong>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            RECEBÍVEIS
        ===================================================== */}

        <section className="revisao-section">
          <div className="revisao-section-title">
            <div>
              <h3>Recebíveis</h3>

              <p>
                Recebíveis que fazem parte da antecipação.
              </p>
            </div>

            <span className="revisao-count">
              {receivables.length}
            </span>
          </div>

          {receivables.length === 0 ? (
            <div className="revisao-empty">
              Nenhum recebível adicionado.
            </div>
          ) : (
            <div className="revisao-receivables">
              {receivables.map((item, index) => (
                <div
                  className="revisao-receivable"
                  key={item.id || item.external_id || index}
                >
                  <div className="revisao-receivable-icon">
                    <Receipt size={18} />
                  </div>

                  <div className="revisao-receivable-info">
                    <strong>
                      {item.debtor_name ||
                        item.debtorName ||
                        "Recebível"}
                    </strong>

                    <span>
                      {getReceivableTypeLabel(
                        item.receivable_type ??
                        item.receivableType
                      )}
                    </span>
                  </div>

                  <div className="revisao-receivable-details">
                    <span>Vencimento</span>

                    <strong>
                      {formatDate(item.due_date ?? item.dueDate)}
                    </strong>
                  </div>

                  <div className="revisao-receivable-value">
                    <span>Elegível</span>

                    <strong>
                      {formatCurrency(
                        item.eligible_amount ??
                        item.eligibleAmount ??
                        item.original_amount ??
                        item.originalAmount
                      )}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =====================================================
            DOCUMENTOS
        ===================================================== */}

        <section className="revisao-section">
          <div className="revisao-section-title">
            <div>
              <h3>Documentação</h3>

              <p>
                Documentos vinculados à solicitação.
              </p>
            </div>

            <span className="revisao-count">
              {documents.length}
            </span>
          </div>

          {documents.length === 0 ? (
            <div className="revisao-empty">
              Nenhum documento vinculado.
            </div>
          ) : (
            <div className="revisao-documents">
              {documents.map((document, index) => (
                <div
                  className="revisao-document"
                  key={document.id || index}
                >
                  <div className="revisao-document-icon">
                    <FileText size={17} />
                  </div>

                  <div>
                    <strong>
                      {document.file_name ||
                        document.fileName ||
                        "Documento"}
                    </strong>

                    <span>
                      {document.document_type ||
                        document.documentType ||
                        "Documento"}
                    </span>
                  </div>

                  <CheckCircle2
                    size={17}
                    className="revisao-document-check"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =====================================================
            SIMULAÇÃO
        ===================================================== */}

        {hasSimulation && (
          <section className="revisao-section">
            <div className="revisao-section-title">
              <div>
                <h3>Simulação</h3>

                <p>
                  Resultado da última simulação realizada.
                </p>
              </div>
            </div>

            <div className="revisao-simulation">
              <div>
                <span>Valor bruto</span>

                <strong>
                  {formatCurrency(simulation.gross_amount)}
                </strong>
              </div>

              <div>
                <span>Valor líquido ao cliente</span>

                <strong>
                  {formatCurrency(simulation.client_net_amount)}
                </strong>
              </div>

              <div>
                <span>Custo total</span>

                <strong>
                  {formatCurrency(simulation.total_cost_amount)}
                </strong>
              </div>

              <div>
                <span>Custo efetivo</span>

                <strong>
                  {simulation.total_effective_percentage != null
                    ? `${Number(
                        simulation.total_effective_percentage
                      ).toFixed(2)}%`
                    : "-"}
                </strong>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            AVISO
        ===================================================== */}

        <div className="revisao-notice">
          <CheckCircle2 size={18} />

          <div>
            <strong>
              Tudo pronto para envio
            </strong>

            <p>
              Ao enviar, a solicitação será encaminhada para análise.
              Os fundos poderão apresentar propostas de antecipação.
            </p>
          </div>
        </div>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="revisao-actions">
          <button
            type="button"
            className="revisao-button revisao-button-secondary"
            onClick={onBack}
            disabled={loading}
          >
            <ArrowLeft size={17} />

            Voltar
          </button>

          <button
            type="button"
            className="revisao-button revisao-button-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            <Send size={17} />

            {loading
              ? "Enviando..."
              : "Enviar para análise"}
          </button>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}