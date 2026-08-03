import React, { useState } from "react";

import DashboardLayout from "../../layout/DashboardLayout";

import usePix from "../../hooks/usePix";

import PixTabs from "../../components/pix/PixTabs";
import PixEnviar from "../../components/pix/PixEnviar";
import PixReceber from "../../components/pix/PixReceber";
import PixQRCodeModal from "../../components/pix/PixQRCodeModal";
import ComprovanteModal from "../../components/ComprovanteModal";

import "./Pix.css";

// ==============================
// CONSTANTES
// ==============================

const ABAS = {
  ENVIAR: "ENVIAR",
  RECEBER: "RECEBER",
};

const TIPOS_PIX = {
  CHAVE: "chave",
  QRCODE: "qrcode",
};

// ==============================
// HELPERS
// ==============================

function montarMovimentoPix({ pagamento, dadosPix, chaveConsultada }) {
  return {
    id: pagamento.id,

    tipo: "saida",

    descricao: dadosPix?.descricao || "Pagamento Pix",

    nome: chaveConsultada?.holder?.name || "Cliente Pix",

    valor: pagamento.amount,

    amount: pagamento.amount,

    data: new Date().toISOString(),

    chavePix: pagamento.pix_key,

    banco: chaveConsultada?.bank_account?.bank_name || "Banco Mock",

    e2e: pagamento.end_to_end_id,
  };
}

export default function Pix() {
  // ==============================
  // HOOKS
  // ==============================

  const { loading, gerarQRCode, consultarPix, enviarPix } = usePix();

  // ==============================
  // CONTROLE DE ABA
  // ==============================

  const [aba, setAba] = useState(ABAS.ENVIAR);

  // ==============================
  // ESTADO PRINCIPAL PIX
  // ==============================

  const [pix, setPix] = useState({
    tipo: null,

    dados: null,

    destinatario: null,

    chaveInfo: null,

    movimento: null,
  });

  // ==============================
  // QR CODE
  // ==============================

  const [qrCode, setQrCode] = useState({
    aberto: false,

    payload: "",

    valor: "",

    descricao: "",

    txid: "",

    codigo: "",
  });

  // ==============================
  // COMPROVANTE
  // ==============================

  const [mostrarComprovante, setMostrarComprovante] = useState(false);

  // ==============================
  // CONSULTAR PIX
  // ==============================

  async function handleConsultarPix(dados) {
    try {
      const resposta = await consultarPix(dados);

      const info = resposta.info;

      setPix((prev) => ({
        ...prev,

        tipo: dados.tipo,

        dados,
      }));

      if (dados.tipo === TIPOS_PIX.CHAVE) {
        setPix((prev) => ({
          ...prev,

          chaveInfo: info,

          destinatario: {
            key: info.key,

            key_type: info.key_type,

            holder_name: info.holder_name || "JOÃO DA SILVA",

            holder_document: info.holder_document || "*.456.789-**",

            bank_name: info.bank_name || "BANCO EXEMPLO S.A.",

            branch: info.branch || "0001",

            account: info.account || "12345678",
          },
        }));
      }

      if (dados.tipo === TIPOS_PIX.QRCODE) {
        setPix((prev) => ({
          ...prev,

          destinatario: null,

          chaveInfo: null,
        }));
      }
    } catch (error) {
      alert(error.message);
    }
  }

  // ==============================
  // ENVIAR PIX
  // ==============================

  async function handleEnviarPix(formulario) {
    try {
      const resposta = await enviarPix({
        ...pix.dados,

        ...formulario,

        tipo: pix.tipo,

        chaveInfo: pix.chaveInfo,
      });
      console.log("RESPOSTA:", resposta);
      console.log("PAGAMENTO:", resposta.pagamento);
      if (resposta.sucesso) {
        const movimento = montarMovimentoPix({
          pagamento: resposta.pagamento.pagamento,

          dadosPix: pix.dados,

          chaveConsultada: pix.chaveInfo,
        });

        setPix((prev) => ({
          ...prev,

          movimento,
        }));

        setMostrarComprovante(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  }

  // ==============================
  // GERAR QR CODE
  // ==============================

  async function handleGerarQRCode(dados) {
    try {
      const resposta = await gerarQRCode(dados);

      setQrCode({
        aberto: true,

        payload: resposta.qr_code,

        valor: resposta.amount,

        descricao: dados.descricao,

        codigo: resposta.qr_code,

        txid: resposta.tx_id,
      });
    } catch (error) {
      alert(error.message);
    }
  }

  // ==============================
  // FECHAR COMPROVANTE
  // ==============================

  function fecharComprovante() {
    setMostrarComprovante(false);

    setPix((prev) => ({
      ...prev,

      movimento: null,
    }));
  }

  // ==============================
  // FECHAR QR CODE
  // ==============================

  function fecharQRCode() {
    setQrCode((prev) => ({
      ...prev,

      aberto: false,
    }));
  }

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="pix-loading">Processando Pix...</div>
      </DashboardLayout>
    );
  }

  // ==============================
  // RENDER
  // ==============================

  return (
    <DashboardLayout>
      <div className="pix-page">
        <div className="pix-left">
          <PixTabs active={aba} onChange={setAba} />

          <div className="pix-card">
            {aba === ABAS.ENVIAR && (
              <PixEnviar
                tipoPix={pix.tipo}
                onConsultar={handleConsultarPix}
                onEnviar={handleEnviarPix}
                destinatario={pix.destinatario}
                loading={loading}
              />
            )}

            {aba === ABAS.RECEBER && <PixReceber onGerar={handleGerarQRCode} />}
          </div>
        </div>
      </div>

      {/* ============================
          MODAL QR CODE
      ============================= */}

      <PixQRCodeModal
        open={qrCode.aberto}
        payload={qrCode.payload}
        valor={qrCode.valor}
        descricao={qrCode.descricao}
        qrCode={qrCode.codigo}
        txid={qrCode.txid}
        onClose={fecharQRCode}
      />

      {/* ============================
          MODAL COMPROVANTE
      ============================= */}

      <ComprovanteModal
        open={mostrarComprovante}
        movimento={pix.movimento}
        onClose={fecharComprovante}
      />
    </DashboardLayout>
  );
}
