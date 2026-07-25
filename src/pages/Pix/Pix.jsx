// src/pages/Pix/Pix.jsx

import React, { useState } from "react";

import usePix from "../../hooks/usePix";

import PixHome from "../../components/pix/PixHome";
import PixEnviar from "../../components/pix/PixEnviar";
import PixReceber from "../../components/pix/PixReceber";
import PixQRCode from "../../components/pix/PixQRCode";
import PixCopiarColar from "../../components/pix/PixCopiarColar";
import PixHistorico from "../../components/pix/PixHistorico";
import PixFavoritos from "../../components/pix/PixFavoritos";
import PixComprovante from "../../components/pix/PixComprovante";
import PixChaveCard from "../../components/pix/PixChaveCard";
import DashboardLayout from "../../layout/DashboardLayout";
import "./Pix.css";

const TELAS = {
  HOME: "HOME",
  ENVIAR: "ENVIAR",
  RECEBER: "RECEBER",
  QRCODE: "QRCODE",
  COPIA_COLA: "COPIA_COLA",
  HISTORICO: "HISTORICO",
  FAVORITOS: "FAVORITOS",
  CHAVES: "CHAVES",
  COMPROVANTE: "COMPROVANTE",
};

export default function Pix() {
  const {
    loading,
    favoritos,
    historico,
    chaves,
    buscarChave,
    gerarQRCode,
    enviarPix,
    removerFavorito,
  } = usePix();

  const [tela, setTela] = useState(TELAS.HOME);

  const [payloadQRCode, setPayloadQRCode] = useState("");

  const [comprovante, setComprovante] = useState(null);

  const voltarHome = () => {
    setTela(TELAS.HOME);
  };

  async function handleBuscar(chave) {
    try {
      const resultado = await buscarChave(chave);

      alert(
        `Destinatário encontrado:\n\n${resultado.nome}\n${resultado.banco}`,
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleEnviarPix(dados) {
    try {
      const resposta = await enviarPix(dados);

      if (resposta.sucesso) {
        setComprovante(resposta.comprovante);
        setTela(TELAS.COMPROVANTE);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleGerarQRCode(dados) {
    try {
      const payload = await gerarQRCode(dados);

      setPayloadQRCode(payload);

      setTela(TELAS.QRCODE);

      return payload;
    } catch (err) {
      alert(err.message);
    }
  }

  function handleSelecionarHistorico(item) {
    setComprovante({
      nome: item.nome,
      chave: item.chave || "-",
      banco: item.banco || "Oportuniza Pay",
      valor: item.valor,
      descricao: item.descricao,
      data: item.data,
      idTransacao: item.id.toString(),
      e2e: "E2E-" + item.id,
    });

    setTela(TELAS.COMPROVANTE);
  }

  function handleCopiarQRCode() {
    alert("Código Pix copiado.");
  }

  function handleCompartilharQRCode() {
    alert("Compartilhamento em desenvolvimento.");
  }

  function handleSalvarQRCode() {
    alert("Salvar QRCode em desenvolvimento.");
  }

  function handleDownloadComprovante() {
    alert("Download PDF em desenvolvimento.");
  }

  function handleCompartilharComprovante() {
    alert("Compartilhar comprovante.");
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="pix-loading">
          <div className="spinner" />
          <p>Processando...</p>
        </div>
      </DashboardLayout>
    );
  }

  let content;

  switch (tela) {
    case TELAS.ENVIAR:
      content = (
        <PixEnviar
          onBack={voltarHome}
          onBuscar={handleBuscar}
          onContinuar={handleEnviarPix}
          onLerQRCode={() => setTela(TELAS.COPIA_COLA)}
        />
      );
      break;

    case TELAS.RECEBER:
      content = (
        <PixReceber
          onBack={voltarHome}
          onGerar={handleGerarQRCode}
        />
      );
      break;

    case TELAS.QRCODE:
      content = (
        <PixQRCode
          payload={payloadQRCode}
          onBack={voltarHome}
          onCopy={handleCopiarQRCode}
          onShare={handleCompartilharQRCode}
          onDownload={handleSalvarQRCode}
        />
      );
      break;

    case TELAS.COPIA_COLA:
      content = (
        <PixCopiarColar
          onBack={voltarHome}
          onContinuar={(codigo) =>
            alert(`Código recebido:\n\n${codigo}`)
          }
        />
      );
      break;

    case TELAS.HISTORICO:
      content = (
        <PixHistorico
          historico={historico}
          onBack={voltarHome}
          onSelecionar={handleSelecionarHistorico}
        />
      );
      break;

    case TELAS.FAVORITOS:
      content = (
        <PixFavoritos
          favoritos={favoritos}
          onBack={voltarHome}
          onEnviar={() => setTela(TELAS.ENVIAR)}
          onRemover={(favorito) =>
            removerFavorito(favorito.id)
          }
        />
      );
      break;

    case TELAS.CHAVES:
      content = (
        <div className="pix-page">
          <div className="pix-header">
            <button
              className="pix-back"
              onClick={voltarHome}
            >
              ←
            </button>

            <h2>Minhas Chaves Pix</h2>
          </div>

          <div className="pix-card">
            {chaves.map((item) => (
              <PixChaveCard
                key={item.id}
                tipo={item.tipo}
                chave={item.chave}
                principal={item.principal}
                onCopy={() => alert("Chave copiada.")}
              />
            ))}
          </div>
        </div>
      );
      break;

    case TELAS.COMPROVANTE:
      content = (
        <PixComprovante
          comprovante={comprovante}
          onBack={voltarHome}
          onDownload={handleDownloadComprovante}
          onShare={handleCompartilharComprovante}
        />
      );
      break;

    case TELAS.HOME:
    default:
      content = (
        <PixHome
          favoritos={favoritos}
          historico={historico}
          onEnviar={() => setTela(TELAS.ENVIAR)}
          onReceber={() => setTela(TELAS.RECEBER)}
          onHistorico={() => setTela(TELAS.HISTORICO)}
          onFavoritos={() => setTela(TELAS.FAVORITOS)}
          onChaves={() => setTela(TELAS.CHAVES)}
        />
      );
  }

  return <DashboardLayout>{content}</DashboardLayout>;
}
