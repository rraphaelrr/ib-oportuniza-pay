// src/hooks/usePix.js

import { useCallback, useMemo, useState } from "react";

export default function usePix() {
  const [loading, setLoading] = useState(false);

  const [chaves] = useState([
    {
      id: 1,
      tipo: "cpf",
      chave: "123.456.789-00",
      principal: true,
    },
    {
      id: 2,
      tipo: "email",
      chave: "raphael@oportuniza.com",
      principal: false,
    },
    {
      id: 3,
      tipo: "telefone",
      chave: "(11) 99999-9999",
      principal: false,
    },
    {
      id: 4,
      tipo: "aleatoria",
      chave: "550e8400-e29b-41d4-a716-446655440000",
      principal: false,
    },
  ]);

  const [favoritos, setFavoritos] = useState([
    {
      id: 1,
      nome: "João Silva",
      chave: "joao@gmail.com",
      banco: "Banco do Brasil",
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      chave: "(11) 98888-9999",
      banco: "Itaú",
    },
    {
      id: 3,
      nome: "Empresa XPTO",
      chave: "12.345.678/0001-99",
      banco: "Bradesco",
    },
  ]);

  const [historico, setHistorico] = useState([
    {
      id: 1,
      tipo: "entrada",
      nome: "João Silva",
      descricao: "Pix recebido",
      valor: 250,
      data: "24/07/2026 10:45",
    },
    {
      id: 2,
      tipo: "saida",
      nome: "Netflix",
      descricao: "Pagamento",
      valor: 55.9,
      data: "23/07/2026 21:18",
    },
    {
      id: 3,
      tipo: "entrada",
      nome: "Empresa XPTO",
      descricao: "Pagamento",
      valor: 3500,
      data: "22/07/2026 08:10",
    },
  ]);

  const buscarChave = useCallback(async (chave) => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);

    return {
      nome: "João Silva",
      banco: "Banco Inter",
      chave,
      documento: "***.456.789-**",
    };
  }, []);

  const gerarQRCode = useCallback(
    async ({ chave, valor, descricao }) => {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      setLoading(false);

      return `00020126580014BR.GOV.BCB.PIX0114${
        chave || "pix@oportuniza.com"
      }52040000530398654${valor || ""}5802BR5917Oportuniza Pay6009Sao Paulo62070503***6304ABCD${
        descricao || ""
      }`;
    },
    []
  );

  const enviarPix = useCallback(
    async ({ chave, valor, descricao }) => {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const movimento = {
        id: Date.now(),
        tipo: "saida",
        nome: "Destinatário",
        descricao: descricao || "Transferência Pix",
        valor: Number(
          String(valor)
            .replace(/[^\d,]/g, "")
            .replace(",", ".")
        ),
        data: new Date().toLocaleString("pt-BR"),
      };

      setHistorico((old) => [movimento, ...old]);

      setLoading(false);

      return {
        sucesso: true,
        comprovante: {
          nome: "Destinatário",
          chave,
          banco: "Banco Inter",
          valor,
          descricao,
          data: movimento.data,
          idTransacao: crypto.randomUUID(),
          e2e:
            "E" +
            Math.random()
              .toString(36)
              .substring(2)
              .toUpperCase(),
        },
      };
    },
    []
  );

  const removerFavorito = useCallback((id) => {
    setFavoritos((old) =>
      old.filter((item) => item.id !== id)
    );
  }, []);

  const adicionarFavorito = useCallback((favorito) => {
    setFavoritos((old) => [
      {
        id: Date.now(),
        ...favorito,
      },
      ...old,
    ]);
  }, []);

  const obterComprovante = useCallback(
    (id) => historico.find((item) => item.id === id),
    [historico]
  );

  const estatisticas = useMemo(() => {
    const enviados = historico.filter(
      (x) => x.tipo === "saida"
    ).length;

    const recebidos = historico.filter(
      (x) => x.tipo === "entrada"
    ).length;

    return {
      enviados,
      recebidos,
      total: historico.length,
    };
  }, [historico]);

  return {
    loading,

    chaves,
    favoritos,
    historico,
    estatisticas,

    buscarChave,
    gerarQRCode,
    enviarPix,

    adicionarFavorito,
    removerFavorito,

    obterComprovante,
  };
}