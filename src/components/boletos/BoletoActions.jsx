import React from "react";
import "./BoletoActions.css";

function ActionIcon({ type }) {
  const icons = {
    view: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),

    download: (
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </>
    ),

    share: (
      <>
        <circle cx="18" cy="5" r="2.5" />
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="19" r="2.5" />
        <path d="m8.3 10.8 7.4-4.6" />
        <path d="m8.3 13.2 7.4 4.6" />
      </>
    ),

    copy: (
      <>
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
      </>
    ),

    cancel: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
  };

  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[type]}
    </svg>
  );
}

export default function BoletoActions({
  boleto,
  onView,
  onDownload,
  onShare,
  onCopy,
  onCancel,
  compact = false,
}) {
  if (!boleto) {
    return null;
  }

  const status = String(boleto.status || "").toUpperCase();

  const canCancel =
    !["PAID", "CANCELLED"].includes(status);

  const handleCopy = async () => {
    const value =
      boleto.digitable_line ||
      boleto.barcode ||
      boleto.pix_copy_paste;

    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      onCopy?.(boleto);
    } catch (error) {
      console.error("Não foi possível copiar:", error);
    }
  };

  return (
    <div
      className={`boleto-actions ${
        compact ? "boleto-actions-compact" : ""
      }`}
    >
      <button
        type="button"
        className="boleto-action"
        title="Visualizar boleto"
        aria-label="Visualizar boleto"
        onClick={() => onView?.(boleto)}
      >
        <ActionIcon type="view" />
        {!compact && <span>Visualizar</span>}
      </button>

      <button
        type="button"
        className="boleto-action"
        title="Baixar PDF"
        aria-label="Baixar PDF"
        onClick={() => onDownload?.(boleto)}
      >
        <ActionIcon type="download" />
        {!compact && <span>PDF</span>}
      </button>

      <button
        type="button"
        className="boleto-action"
        title="Compartilhar boleto"
        aria-label="Compartilhar boleto"
        onClick={() => onShare?.(boleto)}
      >
        <ActionIcon type="share" />
        {!compact && <span>Compartilhar</span>}
      </button>

      <button
        type="button"
        className="boleto-action"
        title="Copiar linha digitável"
        aria-label="Copiar linha digitável"
        onClick={handleCopy}
        disabled={
          !boleto.digitable_line &&
          !boleto.barcode &&
          !boleto.pix_copy_paste
        }
      >
        <ActionIcon type="copy" />
        {!compact && <span>Copiar</span>}
      </button>

      {canCancel && (
        <button
          type="button"
          className="boleto-action boleto-action-danger"
          title="Cancelar boleto"
          aria-label="Cancelar boleto"
          onClick={() => onCancel?.(boleto)}
        >
          <ActionIcon type="cancel" />
          {!compact && <span>Cancelar</span>}
        </button>
      )}
    </div>
  );
}