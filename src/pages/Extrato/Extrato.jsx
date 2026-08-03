import React, { useState } from "react";

import DashboardLayout from "../../layout/DashboardLayout";

import TimelineMovimentacoes from "../../components/TimelineMovimentacoes";
import LoadingMovimentos from "../../components/LoadingMovimentos";
import EmptyState from "../../components/EmptyState";
import ComprovanteModal from "../../components/ComprovanteModal";
import FiltroExtrato from "../../components/FiltroExtrato";
import Produtos from "../../components/Produtos";

import useExtrato from "../../hooks/useExtrato";

import "./Extrato.css";

export default function Extrato() {
  const session = JSON.parse(localStorage.getItem("@op_pay_session") || "{}");
  const user = JSON.parse(localStorage.getItem("user"));
  const accountId = user?.user?.account_id;

  const {
    movimentos = [],
    loading,
    hasMore,
    carregarMais,
    buscar,
  } = useExtrato(accountId);

  const [movimentoSelecionado, setMovimentoSelecionado] = useState(null);
  const [showComprovante, setShowComprovante] = useState(false);

  function abrirComprovante(movimento) {
    setMovimentoSelecionado(movimento);
    setShowComprovante(true);
  }

  function fecharComprovante() {
    setMovimentoSelecionado(null);
    setShowComprovante(false);
  }

  return (
    <DashboardLayout>
      <div className="extrato-page">
        <div className="extrato-top">
          <div>
            <h1>Extrato</h1>
            <p>Consulte suas movimentações</p>
          </div>
        </div>

        {Produtos.filtroExtrato && (
          <div className="extrato-card">
            <FiltroExtrato
              onFilter={(filtros) => buscar(filtros)}
              onClear={() =>
                buscar({
                  periodo: "7",
                  tipo: "todos",
                  busca: "",
                })
              }
            />
          </div>
        )}

        <div className="extrato-card">
          <section className="extrato-content">
            {loading && movimentos.length === 0 && <LoadingMovimentos />}

            {!loading && movimentos.length === 0 && (
              <EmptyState
                title="Nenhuma movimentação"
                description="Não encontramos movimentações para esse período."
              />
            )}

            {movimentos.length > 0 && (
              <TimelineMovimentacoes
                movimentacoes={movimentos}
                onSelect={abrirComprovante}
              />
            )}

            {hasMore && !loading && (
              <button className="btn-carregar" onClick={carregarMais}>
                Carregar mais
              </button>
            )}

            {loading && movimentos.length > 0 && <LoadingMovimentos />}
          </section>
        </div>

        <ComprovanteModal
          open={showComprovante}
          movimento={movimentoSelecionado}
          onClose={fecharComprovante}
        />
      </div>
    </DashboardLayout>
  );
}
