import React, { useState } from "react";

import TimelineMovimentacoes from "../../components/TimelineMovimentacoes";
import LoadingMovimentos from "../../components/LoadingMovimentos";
import EmptyState from "../../components/EmptyState";
import ComprovanteModal from "../../components/ComprovanteModal";

import useExtrato from "../../hooks/useExtrato";
import DashboardLayout from "../../layout/DashboardLayout";
import "./Extrato.css";
import FiltroExtrato from "../../components/FiltroExtrato";

export default function Extrato() {
  const {
    movimentos = [],
    loading,
    hasMore,
    carregarMais,
    buscar,
  } = useExtrato();
  console.log(movimentos);
  const [movimentoSelecionado, setMovimentoSelecionado] = useState(null);

  const [showComprovante, setShowComprovante] = useState(false);

  function abrirComprovante(movimento) {
    setMovimentoSelecionado(movimento);

    setShowComprovante(true);
  }

  function fecharComprovante() {
    setShowComprovante(false);

    setMovimentoSelecionado(null);
  }

  return (
    <DashboardLayout>
      <div className="extrato-page">
        <header className="extrato-header">
          <div>
            <h1 style={{color: "white"}}>Extrato</h1>

            <p style={{color: "white"}}>Consulte suas movimentações</p>
          </div>
        </header>

        <FiltroExtrato
          onFilter={(filtros) => {
            buscar(filtros);
          }}
          onClear={() => {
            buscar({
              periodo: "7",
              tipo: "todos",
              busca: "",
            });
          }}
        />

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

        <ComprovanteModal
          open={showComprovante}
          movimento={movimentoSelecionado}
          onClose={fecharComprovante}
        />
      </div>
    </DashboardLayout>
  );
}
