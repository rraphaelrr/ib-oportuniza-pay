import React from "react";

import BoletoStatus from "../../components/boletos/BoletoStatus";
import BoletoActions from "../../components/boletos/BoletoActions";
import ClienteCard from "../../components/boletos/ClienteCard";
import ContratoCard from "../../components/boletos/ContratoCard";
import ParcelaTable from "../../components/boletos/ParcelaTable";

import "./BoletoDetalhes.css";
import DashboardLayout from "../../layout/DashboardLayout";

function formatCurrency(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "R$ 0,00";
  }

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("pt-BR");
}

function formatDateTime(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("pt-BR");
}

function InfoItem({ label, value, highlight = false }) {
  return (
    <div className="boleto-detail-info-item">
      <span className="boleto-detail-info-label">{label}</span>

      <strong
        className={
          highlight
            ? "boleto-detail-info-value boleto-detail-info-value-highlight"
            : "boleto-detail-info-value"
        }
      >
        {value || "-"}
      </strong>
    </div>
  );
}

export default function BoletoDetalhes({
  boleto,
  loading = false,

  onBack,

  onDownload,
  onShare,
  onCopy,
  onCancel,

  onViewClient,
  onViewContract,

  onViewParcela,

  cliente,
  contrato,
  parcelas = [],
}) {
  if (loading) {
    return (
      <div className="boleto-detalhes">
        <div className="boleto-detalhes-loading">
          <div className="boleto-detalhes-spinner" />

          <span>Carregando boleto...</span>
        </div>
      </div>
    );
  }

  if (!boleto) {
    return (
      <div className="boleto-detalhes">
        <div className="boleto-detalhes-empty">
          <div className="boleto-detalhes-empty-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <rect x="4" y="3" width="16" height="18" rx="2" />

              <path d="M8 8h8" />
              <path d="M8 12h8" />
              <path d="M8 16h5" />
            </svg>
          </div>

          <h2>Boleto não encontrado</h2>

          <p>Não foi possível localizar as informações deste boleto.</p>

          <button
            type="button"
            className="boleto-detalhes-back-button"
            onClick={onBack}
          >
            Voltar para boletos
          </button>
        </div>
      </div>
    );
  }

  const clientData =
    cliente || boleto.client || boleto.payer || boleto.customer;

  const contractData = contrato || boleto.contract;

  const boletoStatus = String(boleto.status || "").toUpperCase();

  const isPaid = boletoStatus === "PAID";
  const isOverdue = boletoStatus === "OVERDUE";
  const isCancelled = boletoStatus === "CANCELLED";

  const digitableLine =
    boleto.digitable_line || boleto.barcode || boleto.pix_copy_paste;

  return (
    <DashboardLayout>
      <div className="boleto-detalhes">
        {/* =================================================
          HEADER
      ================================================= */}

        <header className="boleto-detalhes-header">
          <div className="boleto-detalhes-header-left">
            <button
              type="button"
              className="boleto-detalhes-back"
              onClick={onBack}
              aria-label="Voltar"
              title="Voltar"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </button>

            <div>
              <div className="boleto-detalhes-title-row">
                <h1>Boleto</h1>

                <BoletoStatus status={boleto.status} />
              </div>

              <p>
                {boleto.number
                  ? `Boleto #${boleto.number}`
                  : boleto.id
                    ? `ID: ${boleto.id}`
                    : "Detalhes da cobrança"}
              </p>
            </div>
          </div>

          <BoletoActions
            boleto={boleto}
            onDownload={onDownload}
            onShare={onShare}
            onCopy={onCopy}
            onCancel={onCancel}
          />
        </header>

        {/* =================================================
          RESUMO
      ================================================= */}

        <section className="boleto-detalhes-summary">
          <div className="boleto-detalhes-summary-main">
            <span className="boleto-detalhes-summary-label">
              Valor do boleto
            </span>

            <strong className="boleto-detalhes-summary-value">
              {formatCurrency(boleto.amount)}
            </strong>
          </div>

          <div className="boleto-detalhes-summary-item">
            <span>Vencimento</span>

            <strong className={isOverdue ? "boleto-detalhes-overdue" : ""}>
              {formatDate(boleto.due_date)}
            </strong>
          </div>

          <div className="boleto-detalhes-summary-item">
            <span>Emissão</span>

            <strong>
              {formatDate(boleto.issue_date || boleto.created_at)}
            </strong>
          </div>

          {isPaid && (
            <div className="boleto-detalhes-summary-item">
              <span>Pagamento</span>

              <strong>{formatDate(boleto.paid_at)}</strong>
            </div>
          )}
        </section>

        {/* =================================================
          INFORMAÇÕES DO BOLETO
      ================================================= */}

        <section className="boleto-detalhes-card">
          <div className="boleto-detalhes-card-header">
            <div>
              <h2>Informações do boleto</h2>

              <p>Dados da cobrança e registro.</p>
            </div>
          </div>

          <div className="boleto-detalhes-info-grid">
            <InfoItem label="Nosso número" value={boleto.our_number} />

            <InfoItem
              label="Número do boleto"
              value={boleto.number || boleto.id}
            />

            <InfoItem
              label="Valor original"
              value={formatCurrency(boleto.amount)}
              highlight
            />

            <InfoItem
              label="Valor pago"
              value={
                boleto.paid_amount != null
                  ? formatCurrency(boleto.paid_amount)
                  : "-"
              }
            />

            <InfoItem label="Vencimento" value={formatDate(boleto.due_date)} />

            <InfoItem
              label="Data de pagamento"
              value={formatDate(boleto.paid_at)}
            />

            <InfoItem
              label="Criado em"
              value={formatDateTime(boleto.created_at)}
            />

            <InfoItem
              label="Atualizado em"
              value={formatDateTime(boleto.updated_at)}
            />
          </div>
        </section>

        {/* =================================================
          LINHA DIGITÁVEL
      ================================================= */}

        {digitableLine && (
          <section className="boleto-detalhes-card">
            <div className="boleto-detalhes-card-header">
              <div>
                <h2>Linha digitável</h2>

                <p>Código utilizado para pagamento do boleto.</p>
              </div>
            </div>

            <div className="boleto-detalhes-code">
              <span>{digitableLine}</span>

              <button type="button" onClick={() => onCopy?.(boleto)}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="11" height="11" rx="2" />

                  <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
                </svg>
                Copiar
              </button>
            </div>
          </section>
        )}

        {/* =================================================
          CLIENTE
      ================================================= */}

        {clientData && (
          <section className="boleto-detalhes-card">
            <div className="boleto-detalhes-card-header">
              <div>
                <h2>Cliente / Pagador</h2>

                <p>Pessoa responsável pelo pagamento.</p>
              </div>

              {onViewClient && (
                <button
                  type="button"
                  className="boleto-detalhes-link"
                  onClick={() => onViewClient(boleto)}
                >
                  Ver cliente
                </button>
              )}
            </div>

            <ClienteCard cliente={clientData} />
          </section>
        )}

        {/* =================================================
          CONTRATO
      ================================================= */}

        {contractData && (
          <section className="boleto-detalhes-card">
            <div className="boleto-detalhes-card-header">
              <div>
                <h2>Contrato</h2>

                <p>Contrato relacionado à cobrança.</p>
              </div>

              {onViewContract && (
                <button
                  type="button"
                  className="boleto-detalhes-link"
                  onClick={() => onViewContract(boleto)}
                >
                  Ver contrato
                </button>
              )}
            </div>

            <ContratoCard contrato={contractData} />
          </section>
        )}

        {/* =================================================
          PARCELAS
      ================================================= */}

        {parcelas.length > 0 && (
          <section className="boleto-detalhes-card">
            <div className="boleto-detalhes-card-header">
              <div>
                <h2>Parcelas</h2>

                <p>Parcelas relacionadas ao contrato.</p>
              </div>
            </div>

            <ParcelaTable parcelas={parcelas} onView={onViewParcela} />
          </section>
        )}

        {/* =================================================
          CANCELAMENTO
      ================================================= */}

        {isCancelled && (
          <section className="boleto-detalhes-alert boleto-detalhes-alert-cancelled">
            <div className="boleto-detalhes-alert-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />

                <path d="M9 9l6 6" />
                <path d="m15 9-6 6" />
              </svg>
            </div>

            <div>
              <strong>Boleto cancelado</strong>

              <p>Esta cobrança não está mais disponível para pagamento.</p>
            </div>
          </section>
        )}

        {/* =================================================
          PAGAMENTO
      ================================================= */}

        {isPaid && (
          <section className="boleto-detalhes-alert boleto-detalhes-alert-paid">
            <div className="boleto-detalhes-alert-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />

                <path d="m8 12 2.5 2.5L16 9" />
              </svg>
            </div>

            <div>
              <strong>Boleto pago</strong>

              <p>O pagamento desta cobrança foi registrado.</p>
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
