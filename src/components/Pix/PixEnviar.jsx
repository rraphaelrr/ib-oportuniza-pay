import React, { useState } from "react";
import {
  KeyRound,
  DollarSign,
  MessageSquare,
  Search,
  SendHorizontal,
} from "lucide-react";

import { maskCurrency } from "../../utils/formatCurrency";
import { isQRCodePix } from "../../utils/pixValidator";

export default function PixEnviar({
  tipoPix,
  onConsultar,
  onEnviar,
  destinatario,
  loading,
}) {
  // ==============================
  // ESTADOS
  // ==============================
  const [chavePix, setChavePix] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");

  console.log(destinatario);

  // ==============================
  // HELPERS
  // ==============================

  function getPixKeyType(tipo) {
    const tipos = {
      EVP: "Chave Aleatória",
      CPF: "CPF",
      CNPJ: "CNPJ",
      EMAIL: "E-mail",
      PHONE: "Telefone",
    };

    return tipos[tipo?.toUpperCase()] || tipo || "-";
  }

  function handleValorChange(e) {
    const raw = e.target.value.replace(/[^\d,.-]/g, "").replace(",", ".");

    if (!raw) {
      setValor("");
      return;
    }

    const numero = Number(raw);

    if (!Number.isNaN(numero)) {
      setValor(numero.toFixed(2));
    }
  }

  // ==============================
  // EVENTOS
  // ==============================

  function handleConsultar() {
    if (!chavePix.trim()) return;

    onConsultar?.({
      chavePix,
      tipo: isQRCodePix(chavePix) ? "qrcode" : "chave",
    });
  }

  function handleEnviar(e) {
    e.preventDefault();

    onEnviar?.({
      chavePix,
      valor,
      descricao,
    });
  }

  // ==============================
  // RENDER
  // ==============================

  return (
    <form className="pix-form" onSubmit={handleEnviar}>
      <h2>Enviar Pix</h2>

      <p className="pix-subtitle">
        Digite uma chave Pix ou um código Copia e Cola.
      </p>

      <div className="pix-field">
        <label>Chave Pix ou QR Code</label>

        <div className="pix-input pix-input-consulta">
          <KeyRound size={18} />

          <textarea
            rows={3}
            placeholder="CPF, CNPJ, Email, Telefone, Chave Aleatória ou Pix Copia e Cola"
            value={chavePix}
            onChange={(e) => setChavePix(e.target.value)}
          />

          <button
            type="button"
            className="pix-search-btn"
            onClick={handleConsultar}
            disabled={loading || !chavePix.trim()}
          >
            <Search size={18} />
            Consultar
          </button>
        </div>
      </div>

      {(destinatario || tipoPix === "qrcode") && (
        <>
          <div className="pix-destinatario-card">
            <div className="pix-destinatario-header">
              <h3>
                {tipoPix === "qrcode"
                  ? "QR Code Pix identificado"
                  : "Destinatário encontrado"}
              </h3>
            </div>

            <div className="pix-destinatario-grid">
            

              {tipoPix === "chave" && destinatario && (
                <>
                  <div className="pix-info">
                    <label>Nome:</label>
                    <strong>{destinatario.holder_name}</strong>
                  </div>

                  <div className="pix-info">
                    <label>Documento:</label>
                    <strong>{destinatario.holder_document}</strong>
                  </div>

                  <div className="pix-info">
                    <label>Banco:</label>
                    <strong>{destinatario.bank_name}</strong>
                  </div>

                  <div className="pix-info">
                    <label>Tipo da chave:</label>
                    <strong>{getPixKeyType(destinatario.key_type)}</strong>
                  </div>

                  <div className="pix-info">
                    <label>Agência:</label>
                    <strong>{destinatario.branch}</strong>
                  </div>

                  <div className="pix-info">
                    <label>Conta:</label>
                    <strong>{destinatario.account}</strong>
                  </div>

                  <div className="pix-info">
                    <label>Chave Pix:</label>
                    <strong>{destinatario.key}</strong>
                  </div>
                </>
              )}

              {tipoPix === "qrcode" && (
                <>
                  <div className="pix-info">
                    <label>Tipo:</label>
                    <strong>Pix Copia e Cola</strong>
                  </div>

                  <div className="pix-info">
                    <label>Código:</label>
                    <strong className="pix-code">{chavePix}</strong>
                  </div>

                  <div className="pix-info">
                    <label>Status:</label>
                    <strong>QR Code identificado</strong>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="pix-field">
            <label>Valor</label>

            <div className="pix-input">
              <DollarSign size={18} />

              <input
                type="text"
                inputMode="decimal"
                placeholder="R$ 0,00"
                value={valor ? maskCurrency(valor) : ""}
                onChange={handleValorChange}
              />
            </div>
          </div>

          <div className="pix-field">
            <label>Descrição</label>

            <div className="pix-input">
              <MessageSquare size={18} />

              <input
                type="text"
                placeholder="Mensagem opcional"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="pix-primary-btn"
            disabled={!valor || loading}
          >
            <SendHorizontal size={18} />
            Enviar Pix
          </button>
        </>
      )}
    </form>
  );
}
