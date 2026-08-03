import { useCallback, useEffect, useState } from "react";
import { getExtrato } from "../services/extratoService";

const ENTRY_TYPE_LABELS = {
  MANUAL_CREDIT: "Crédito Manual",
  MANUAL_DEBIT: "Débito Manual",

  PIX_IN: "Pix Recebido",
  PIX_OUT: "Pix Enviado",

  TED_IN: "TED Recebida",
  TED_OUT: "TED Enviada",

  TRANSFER_IN: "Transferência Recebida",
  TRANSFER_OUT: "Transferência Enviada",

  BOLETO_PAYMENT: "Pagamento de Boleto",
  BOLETO_RECEIPT: "Recebimento de Boleto",

  CARD_PAYMENT: "Pagamento com Cartão",
  CARD_REFUND: "Estorno de Cartão",

  CASH_IN: "Depósito",
  CASH_OUT: "Saque",

  FEE: "Tarifa",
  REFUND: "Estorno",
};

export default function useExtrato(accountId) {
  const [movimentos, setMovimentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const carregarExtrato = useCallback(async () => {
    if (!accountId) return;

    try {
      setLoading(true);

      const response = await getExtrato(accountId);

      const lista = response?.items ?? [];

      const movimentacoes = lista.map((item) => ({
        id: item.ledger_entry_id,

        tipo: item.direction === "CREDIT" ? "entrada" : "saida",

        descricao:
          ENTRY_TYPE_LABELS[item.entry_type] ||
          item.entry_type
            ?.replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase()) ||
          "Movimentação",

        nome: item.metadata?.name || "Conta",

        valor:
          item.direction === "DEBIT"
            ? -Number(item.amount)
            : Number(item.amount),

        data: item.created_at,

        status: "Concluído",

        categoria:
          ENTRY_TYPE_LABELS[item.entry_type] || item.entry_type,

        saldoAnterior: Number(item.balance_before),

        saldoPosterior: Number(item.balance_after),

        metadata: item.metadata,
      }));

      setMovimentos(movimentacoes);

      setHasMore(response.total > movimentacoes.length);
    } catch (err) {
      console.error(err);
      setMovimentos([]);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    carregarExtrato();
  }, [carregarExtrato]);

  async function buscar() {
    await carregarExtrato();
  }

  function carregarMais() {
    // Implementar paginação quando disponível na API
  }

  return {
    movimentos,
    loading,
    hasMore,
    buscar,
    carregarMais,
  };
}