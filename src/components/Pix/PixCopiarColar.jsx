import React, { useState } from "react";
import {
  ArrowLeft,
  ClipboardPaste,
  Search,
} from "lucide-react";

import "../../pages/Pix/Pix.css";

export default function PixCopiarColar({
  onBack,
  onContinuar,
}) {
  const [codigo, setCodigo] = useState("");

  const colar = async () => {
    try {
      const texto = await navigator.clipboard.readText();
      setCodigo(texto);
    } catch {
      alert("Não foi possível acessar a área de transferência.");
    }
  };

  const continuar = () => {
    if (!codigo.trim()) {
      alert("Cole um código Pix.");
      return;
    }

    onContinuar?.(codigo);
  };

  return (
    <div className="pix-page">

      <div className="pix-header">

        <button
          className="pix-back"
          onClick={onBack}
        >
          <ArrowLeft size={22} />
        </button>

        <h2>Pix Copia e Cola</h2>

      </div>

      <div className="pix-card">

        <label>Código Pix</label>

        <textarea
          rows={8}
          placeholder="Cole aqui o código Pix..."
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />

        <div className="pix-actions-inline">

          <button
            className="secondary"
            onClick={colar}
          >
            <ClipboardPaste size={18} />
            Colar
          </button>

          <button
            className="pix-primary-button"
            onClick={continuar}
          >
            <Search size={18} />
            Validar Código
          </button>

        </div>

      </div>

      <div className="pix-card">

        <h3>Como funciona?</h3>

        <p>
          O Pix Copia e Cola permite realizar pagamentos utilizando um
          código gerado por outra pessoa ou empresa, sem precisar
          escanear um QR Code.
        </p>

        <ol className="pix-info-list">
          <li>Copie o código Pix.</li>
          <li>Cole no campo acima.</li>
          <li>Confira os dados do recebedor.</li>
          <li>Informe o valor, se necessário.</li>
          <li>Confirme a transferência.</li>
        </ol>

      </div>

    </div>
  );
}