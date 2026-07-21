import { useState } from "react";

export default function useExtrato() {

  const movimentacoesMock = [
    {
      id: 1,
      tipo: "entrada",
      descricao: "Pix recebido",
      nome: "João Silva",
      valor: 250.00,
      data: "2026-07-21T14:30:00",
      status: "Concluído",
      categoria: "Pix",
    },
    {
      id: 2,
      tipo: "saida",
      descricao: "Pagamento de boleto",
      nome: "Energia Elétrica",
      valor: -180.50,
      data: "2026-07-20T09:15:00",
      status: "Concluído",
      categoria: "Boleto",
    },
    {
      id: 3,
      tipo: "saida",
      descricao: "Compra no cartão",
      nome: "Supermercado Extra",
      valor: -320.90,
      data: "2026-07-19T18:42:00",
      status: "Concluído",
      categoria: "Cartão",
    },
    {
      id: 4,
      tipo: "entrada",
      descricao: "Pagamento recebido",
      nome: "Empresa XPTO LTDA",
      valor: 3500.00,
      data: "2026-07-18T10:00:00",
      status: "Concluído",
      categoria: "Transferência",
    },
    {
      id: 5,
      tipo: "saida",
      descricao: "Transferência Pix",
      nome: "Maria Oliveira",
      valor: -75.00,
      data: "2026-07-17T16:25:00",
      status: "Concluído",
      categoria: "Pix",
    },
    {
      id: 6,
      tipo: "saida",
      descricao: "Assinatura Netflix",
      nome: "Netflix",
      valor: -55.90,
      data: "2026-07-16T12:00:00",
      status: "Concluído",
      categoria: "Assinatura",
    },
    {
      id: 7,
      tipo: "entrada",
      descricao: "Estorno de compra",
      nome: "Loja Online",
      valor: 120.00,
      data: "2026-07-15T15:40:00",
      status: "Concluído",
      categoria: "Estorno",
    },
  ];


  const [movimentos, setMovimentos] = useState(movimentacoesMock);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);


  function buscar(filtros = {}) {

    setLoading(true);


    setTimeout(() => {

      let resultado = [...movimentacoesMock];


      if (filtros.tipo && filtros.tipo !== "todos") {
        resultado = resultado.filter(
          item => item.tipo === filtros.tipo
        );
      }


      if (filtros.busca) {
        resultado = resultado.filter(item =>
          item.descricao
            .toLowerCase()
            .includes(filtros.busca.toLowerCase())
        );
      }


      setMovimentos(resultado);
      setLoading(false);

    }, 500);
  }


  function carregarMais() {

    setLoading(true);

    setTimeout(() => {

      const novos = [
        {
          id: 8,
          tipo: "saida",
          descricao: "Compra farmácia",
          nome: "Drogaria São Paulo",
          valor: -89.90,
          data: "2026-07-14T11:20:00",
          status: "Concluído",
          categoria: "Compra",
        },
        {
          id: 9,
          tipo: "entrada",
          descricao: "Pix recebido",
          nome: "Carlos Mendes",
          valor: 600,
          data: "2026-07-13T08:30:00",
          status: "Concluído",
          categoria: "Pix",
        },
      ];


      setMovimentos(old => [
        ...old,
        ...novos
      ]);

      setHasMore(false);
      setLoading(false);

    }, 700);

  }


  return {
    movimentos,
    loading,
    hasMore,
    buscar,
    carregarMais,
  };
}