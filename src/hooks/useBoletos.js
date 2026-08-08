import { useCallback, useState } from "react";

import {
  listarBoletos,
  buscarBoleto,
  criarBoleto,
  atualizarBoleto,
  cancelarBoleto,
  obterBoletoPDF,
  gerarBoletosLote,
} from "../services/boletoService";

export default function useBoletos() {
  const [boletos, setBoletos] = useState([]);
  const [boleto, setBoleto] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  /**
   * Limpa o erro atual
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Lista boletos
   */
  const carregarBoletos = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await listarBoletos(params);

      /*
       * Mantemos compatibilidade caso a API retorne:
       *
       * [
       *   ...
       * ]
       *
       * ou:
       *
       * {
       *   data: [],
       *   pagination: {}
       * }
       */

      const lista = Array.isArray(response)
        ? response
        : response?.data || response?.boletos || [];

      setBoletos(lista);

      if (response?.pagination) {
        setPagination((prev) => ({
          ...prev,
          ...response.pagination,
        }));
      }

      return response;
    } catch (err) {
      console.error("Erro ao carregar boletos:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Não foi possível carregar os boletos.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca um boleto específico
   */
  const carregarBoleto = useCallback(async (id) => {
    if (!id) {
      throw new Error("ID do boleto não informado.");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await buscarBoleto(id);

      const data =
        response?.data ||
        response?.boleto ||
        response;

      setBoleto(data);

      return data;
    } catch (err) {
      console.error("Erro ao buscar boleto:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Não foi possível carregar o boleto.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Emite um boleto
   */
  const emitirBoleto = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await criarBoleto(data);

      return response;
    } catch (err) {
      console.error("Erro ao emitir boleto:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Não foi possível emitir o boleto.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Atualiza um boleto
   */
  const editarBoleto = useCallback(async (id, data) => {
    if (!id) {
      throw new Error("ID do boleto não informado.");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await atualizarBoleto(id, data);

      return response;
    } catch (err) {
      console.error("Erro ao atualizar boleto:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Não foi possível atualizar o boleto.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cancela um boleto
   */
  const cancelar = useCallback(async (id) => {
    if (!id) {
      throw new Error("ID do boleto não informado.");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await cancelarBoleto(id);

      /*
       * Atualiza a lista localmente para evitar
       * uma nova requisição somente para mudar o status.
       */
      setBoletos((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "CANCELLED",
              }
            : item
        )
      );

      if (boleto?.id === id) {
        setBoleto((prev) =>
          prev
            ? {
                ...prev,
                status: "CANCELLED",
              }
            : prev
        );
      }

      return response;
    } catch (err) {
      console.error("Erro ao cancelar boleto:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Não foi possível cancelar o boleto.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }, [boleto]);

  /**
   * Gera boletos em lote
   */
  const emitirEmLote = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await gerarBoletosLote(data);

      return response;
    } catch (err) {
      console.error("Erro ao gerar boletos em lote:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Não foi possível gerar os boletos em lote.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtém o PDF do boleto
   */
  const baixarPDF = useCallback(async (id, nomeArquivo) => {
    if (!id) {
      throw new Error("ID do boleto não informado.");
    }

    setLoading(true);
    setError(null);

    try {
      const blob = await obterBoletoPDF(id);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = nomeArquivo || `boleto-${id}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      return blob;
    } catch (err) {
      console.error("Erro ao baixar boleto:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Não foi possível baixar o PDF do boleto.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpa o boleto selecionado
   */
  const limparBoleto = useCallback(() => {
    setBoleto(null);
  }, []);

  /**
   * Limpa todos os estados
   */
  const reset = useCallback(() => {
    setBoletos([]);
    setBoleto(null);
    setError(null);

    setPagination({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    });
  }, []);

  return {
    // Lista
    boletos,
    setBoletos,

    // Boleto individual
    boleto,
    setBoleto,

    // Estado
    loading,
    error,

    // Paginação
    pagination,
    setPagination,

    // Ações
    carregarBoletos,
    carregarBoleto,
    emitirBoleto,
    editarBoleto,
    cancelar,
    emitirEmLote,
    baixarPDF,

    // Utilidades
    limparBoleto,
    clearError,
    reset,
  };
}