import React from "react";
import BoletoStatus from "./BoletoStatus";
import BoletoActions from "./BoletoActions";

import "./BoletoDetails.css";

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

  return parsedDate.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function maskDocument(document) {
  if (!document) return "-";

  const value = String(document);

  if (value.length === 11) {
    return value.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-**"
    );
  }

  if (value.length === 14) {
    return value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.***.***/****-**"
    );
  }

  return value;
}

function InfoItem({ label, value, highlight = false }) {
  return (
    <div className="boleto-details-info-item">
      <span>{label}</span>

      <strong className={highlight ? "highlight" : ""}>
        {value || "-"}
      </strong>
    </div>
  );
}

function Section({ title, children, action }) {
  return (
    <section className="boleto-details-section">
      <div className="boleto-details-section-header">
        <h3>{title}</h3>

        {action}
      </div>

      <div className="boleto-details-section-content">
        {children}
      </div>
    </section>
  );
}

export default function BoletoDetails({
  boleto,
  onViewClient,
  onViewContract,
  onViewPayment,
  onViewInstallment,
  onView,
  onDownload,
  onShare,
  onCopy,
  onCancel,
}) {
  if (!boleto) {
    return (
      <div className="boleto-details-empty">
        <span>Nenhum boleto selecionado.</span>
      </div>
    );
  }

  const client =
    boleto.client ||
    boleto.payer ||
    boleto.customer ||
    {};

  const contract = boleto.contract || null;
  const installment = boleto.installment || null;
  const payment = boleto.payment || null;

  const clientName =
    client.name || "Cliente não informado";

  const clientDocument =
    client.document ||
    client.document_number;

  const contractNumber =
    contract?.number ||
    contract?.id;

  const installmentNumber =
    installment?.number;

  const isPaid =
    String(boleto.status || "").toUpperCase() === "PAID";

  return (
    <div className="boleto-details">

      {/* Cabeçalho */}

      <div className="boleto-details-header">

        <div className="boleto-details-title">

          <div className="boleto-details-back">
            <span>Boleto</span>

            <span>/</span>

            <strong>
              #{boleto.number || boleto.id}
            </strong>
          </div>

          <div className="boleto-details-heading">
            <h2>
              Boleto #{boleto.number || boleto.id}
            </h2>

            <BoletoStatus
              status={boleto.status}
            />
          </div>
        </div>

        <BoletoActions
          boleto={boleto}
          onView={onView}
          onDownload={onDownload}
          onShare={onShare}
          onCopy={onCopy}
          onCancel={onCancel}
        />
      </div>

      {/* Resumo */}

      <div className="boleto-details-summary">

        <div className="boleto-details-summary-main">

          <span>Valor do boleto</span>

          <strong>
            {formatCurrency(boleto.amount)}
          </strong>

          {boleto.description && (
            <p>{boleto.description}</p>
          )}

        </div>

        <div className="boleto-details-summary-item">
          <span>Vencimento</span>

          <strong>
            {formatDate(boleto.due_date)}
          </strong>
        </div>

        <div className="boleto-details-summary-item">
          <span>Emissão</span>

          <strong>
            {formatDate(boleto.issued_at)}
          </strong>
        </div>

        {isPaid && payment && (
          <div className="boleto-details-summary-item">
            <span>Pagamento</span>

            <strong className="boleto-details-paid">
              {formatDate(payment.paid_at)}
            </strong>
          </div>
        )}

      </div>

      <div className="boleto-details-grid">

        {/* Cliente */}

        <Section
          title="Cliente"
          action={
            <button
              type="button"
              className="boleto-details-link"
              onClick={() =>
                onViewClient?.(boleto)
              }
            >
              Ver cliente
            </button>
          }
        >
          <div className="boleto-details-client">

            <div className="boleto-details-avatar">
              {clientName
                .trim()
                .split(" ")
                .slice(0, 2)
                .map((word) => word[0])
                .join("")
                .toUpperCase()}
            </div>

            <div className="boleto-details-client-info">

              <strong>{clientName}</strong>

              <span>
                {maskDocument(clientDocument)}
              </span>

              {client.email && (
                <span>{client.email}</span>
              )}

              {client.phone && (
                <span>{client.phone}</span>
              )}

            </div>

          </div>
        </Section>

        {/* Contrato */}

        <Section
          title="Contrato"
          action={
            contract && (
              <button
                type="button"
                className="boleto-details-link"
                onClick={() =>
                  onViewContract?.(boleto)
                }
              >
                Ver contrato
              </button>
            )
          }
        >
          <div className="boleto-details-info-grid">

            <InfoItem
              label="Contrato"
              value={
                contractNumber
                  ? `#${contractNumber}`
                  : "-"
              }
            />

            <InfoItem
              label="Descrição"
              value={contract?.description}
            />

            <InfoItem
              label="Valor contratado"
              value={
                contract?.total_amount
                  ? formatCurrency(
                      contract.total_amount
                    )
                  : "-"
              }
            />

            <InfoItem
              label="Status"
              value={contract?.status}
            />

          </div>
        </Section>

        {/* Parcela */}

        <Section
          title="Parcela"
          action={
            installment && (
              <button
                type="button"
                className="boleto-details-link"
                onClick={() =>
                  onViewInstallment?.(boleto)
                }
              >
                Ver parcela
              </button>
            )
          }
        >
          <div className="boleto-details-info-grid">

            <InfoItem
              label="Parcela"
              value={
                installmentNumber
                  ? `${installmentNumber}ª parcela`
                  : "-"
              }
            />

            <InfoItem
              label="Valor"
              value={
                installment?.amount
                  ? formatCurrency(
                      installment.amount
                    )
                  : formatCurrency(
                      boleto.amount
                    )
              }
            />

            <InfoItem
              label="Vencimento"
              value={formatDate(
                installment?.due_date ||
                boleto.due_date
              )}
            />

            <InfoItem
              label="Status"
              value={installment?.status}
            />

          </div>
        </Section>

        {/* Cobrança */}

        <Section title="Dados da cobrança">

          <div className="boleto-details-info-grid">

            <InfoItem
              label="Valor original"
              value={formatCurrency(
                boleto.amount
              )}
            />

            <InfoItem
              label="Multa"
              value={
                boleto.fine
                  ? formatCurrency(
                      boleto.fine
                    )
                  : "R$ 0,00"
              }
            />

            <InfoItem
              label="Juros"
              value={
                boleto.interest
                  ? formatCurrency(
                      boleto.interest
                    )
                  : "R$ 0,00"
              }
            />

            <InfoItem
              label="Desconto"
              value={
                boleto.discount
                  ? formatCurrency(
                      boleto.discount
                    )
                  : "R$ 0,00"
              }
            />

          </div>

        </Section>

        {/* Dados bancários */}

        <Section title="Dados do boleto">

          <div className="boleto-details-code">

            <div>
              <span>Linha digitável</span>

              <strong>
                {boleto.digitable_line ||
                  "-"}
              </strong>
            </div>

            <button
              type="button"
              onClick={() =>
                onCopy?.(boleto)
              }
            >
              Copiar
            </button>

          </div>

          <div className="boleto-details-info-grid">

            <InfoItem
              label="Código de barras"
              value={boleto.barcode}
            />

            <InfoItem
              label="Nosso número"
              value={boleto.our_number}
            />

            <InfoItem
              label="Provider"
              value={boleto.provider}
            />

            <InfoItem
              label="ID externo"
              value={boleto.provider_id}
            />

          </div>

        </Section>

        {/* Pagamento */}

        {payment && (
          <Section
            title="Pagamento"
            action={
              <button
                type="button"
                className="boleto-details-link"
                onClick={() =>
                  onViewPayment?.(boleto)
                }
              >
                Ver pagamento
              </button>
            }
          >
            <div className="boleto-details-info-grid">

              <InfoItem
                label="Valor pago"
                value={
                  payment.amount
                    ? formatCurrency(
                        payment.amount
                      )
                    : "-"
                }
                highlight
              />

              <InfoItem
                label="Data do pagamento"
                value={formatDateTime(
                  payment.paid_at
                )}
              />

              <InfoItem
                label="Data de liquidação"
                value={formatDateTime(
                  payment.settled_at
                )}
              />

              <InfoItem
                label="Identificador"
                value={
                  payment.id
                }
              />

            </div>
          </Section>
        )}

      </div>
    </div>
  );
}