import { useCallback, useState } from "react";

import {
  getAntecipacoes,
  criarAntecipacao,
  simularAntecipacao,
  getAntecipacaoById,
  adicionarDocumento,
  getOfertas,
  aceitarOferta,
  adicionarRecebivel,
  enviarAntecipacao,
} from "../services/antecipacaoService";

/*
|--------------------------------------------------------------------------
| HOOK - ANTECIPAÇÃO DE RECEBÍVEIS
|--------------------------------------------------------------------------
*/

export default function useAntecipacao() {
  /*
  |--------------------------------------------------------------------------
  | ESTADOS
  |--------------------------------------------------------------------------
  */

  const [antecipacoes, setAntecipacoes] = useState([]);

  const [antecipacao, setAntecipacao] = useState(null);

  const [ofertas, setOfertas] = useState([]);

  const [simulacao, setSimulacao] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | LIMPAR ERRO
  |--------------------------------------------------------------------------
  */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | TRATAMENTO DE ERRO
  |--------------------------------------------------------------------------
  */

  const handleError = useCallback((err) => {
    console.error("Erro na antecipação:", err);

    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Não foi possível realizar a operação.";

    setError(message);

    throw err;
  }, []);

  /*
  |--------------------------------------------------------------------------
  | EXECUTOR
  |--------------------------------------------------------------------------
  | Centraliza loading e tratamento de erro.
  |--------------------------------------------------------------------------
  */

  const execute = useCallback(
    async (callback) => {
      setLoading(true);
      setError(null);

      try {
        return await callback();
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  /*
  |--------------------------------------------------------------------------
  | LISTAR ANTECIPAÇÕES
  |--------------------------------------------------------------------------
  */

  const carregarAntecipacoes = useCallback(async () => {
    return execute(async () => {
      const data = await getAntecipacoes();

      const lista = Array.isArray(data) ? data : [];

      setAntecipacoes(lista);

      return lista;
    });
  }, [execute]);

  /*
  |--------------------------------------------------------------------------
  | CRIAR ANTECIPAÇÃO
  |--------------------------------------------------------------------------
  */

  const criar = useCallback(
    async (payload) => {
      return execute(async () => {
        const data = await criarAntecipacao(payload);

        setAntecipacao(data);

        return data;
      });
    },
    [execute],
  );

  /*
  |--------------------------------------------------------------------------
  | SIMULAR ANTECIPAÇÃO
  |--------------------------------------------------------------------------
  */

  const simular = useCallback(
    async (payload) => {
      return execute(async () => {
        const data = await simularAntecipacao(payload);

        setSimulacao(data);

        return data;
      });
    },
    [execute],
  );

  /*
  |--------------------------------------------------------------------------
  | LIMPAR SIMULAÇÃO
  |--------------------------------------------------------------------------
  */

  const limparSimulacao = useCallback(() => {
    setSimulacao(null);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CONSULTAR ANTECIPAÇÃO
  |--------------------------------------------------------------------------
  */

  const carregarAntecipacao = useCallback(
    async (id) => {
      return execute(async () => {
        const data = await getAntecipacaoById(id);

        setAntecipacao(data);

        /*
        | A API de detalhes já pode retornar as ofertas.
        | Aproveitamos para manter o estado sincronizado.
        */

        if (Array.isArray(data?.offers)) {
          setOfertas(data.offers);
        }

        return data;
      });
    },
    [execute],
  );

  /*
  |--------------------------------------------------------------------------
  | ADICIONAR RECEBÍVEL
  |--------------------------------------------------------------------------
  */

  const adicionarRecebivelNaAntecipacao = useCallback(
    async (antecipacaoId, payload) => {
      return execute(async () => {
        const data = await adicionarRecebivel(antecipacaoId, payload);

        /*
        | Atualiza a antecipação caso o objeto atual
        | contenha a lista de recebíveis.
        */

        setAntecipacao((current) => {
          if (!current) {
            return current;
          }

          const recebiveisAtuais = Array.isArray(current.receivables)
            ? current.receivables
            : [];

          return {
            ...current,
            receivables: [...recebiveisAtuais, data],
          };
        });

        return data;
      });
    },
    [execute],
  );

  /*
  |--------------------------------------------------------------------------
  | ADICIONAR DOCUMENTO
  |--------------------------------------------------------------------------
  */

  const adicionarDocumentoNaAntecipacao = useCallback(
    async (antecipacaoId, payload) => {
      return execute(async () => {
        const data = await adicionarDocumento(antecipacaoId, payload);

        return data;
      });
    },
    [execute],
  );

  /*
  |--------------------------------------------------------------------------
  | CARREGAR OFERTAS
  |--------------------------------------------------------------------------
  */

  const carregarOfertas = useCallback(
    async (antecipacaoId) => {
      return execute(async () => {
        const data = await getOfertas(antecipacaoId);

        const lista = Array.isArray(data) ? data : [];

        setOfertas(lista);

        return lista;
      });
    },
    [execute],
  );

  /*
  |--------------------------------------------------------------------------
  | ACEITAR OFERTA
  |--------------------------------------------------------------------------
  */

  const aceitar = useCallback(
    async (antecipacaoId, offerId) => {
      return execute(async () => {
        const data = await aceitarOferta(antecipacaoId, offerId);

        /*
        | Atualiza a oferta aceita localmente.
        */

        setOfertas((current) =>
          current.map((offer) =>
            offer.id === offerId
              ? {
                  ...offer,
                  status: data?.status || "ACCEPTED",
                }
              : offer,
          ),
        );

        /*
        | Atualiza a antecipação atual, se existir.
        */

        setAntecipacao((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            status: current.status === "OFFERED" ? "ACCEPTED" : current.status,
          };
        });

        return data;
      });
    },
    [execute],
  );

  /*
  |--------------------------------------------------------------------------
  | ENVIAR PARA ANÁLISE
  |--------------------------------------------------------------------------
  */

  const enviarParaAnalise = useCallback(
    async (antecipacaoId, payload = {}) => {
      return execute(async () => {
        const data = await enviarAntecipacao(antecipacaoId, payload);

        /*
        | Mantém o objeto atual sincronizado.
        */

        setAntecipacao((current) => {
          if (!current) {
            return data;
          }

          return {
            ...current,
            ...data,
            status: data?.status || current.status,
          };
        });

        /*
        | Atualiza também a lista, caso a antecipação
        | já esteja carregada nela.
        */

        setAntecipacoes((current) =>
          current.map((item) =>
            item.id === antecipacaoId
              ? {
                  ...item,
                  ...data,
                  status: data?.status || item.status,
                }
              : item,
          ),
        );

        return data;
      });
    },
    [execute],
  );

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const reset = useCallback(() => {
    setAntecipacoes([]);
    setAntecipacao(null);
    setOfertas([]);
    setSimulacao(null);
    setError(null);
    setLoading(false);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | RETORNO
  |--------------------------------------------------------------------------
  */

  return {
    /*
    | Estado
    */
    antecipacoes,
    antecipacao,
    ofertas,
    simulacao,

    loading,
    error,

    /*
    | Consultas
    */
    carregarAntecipacoes,
    carregarAntecipacao,
    carregarOfertas,

    /*
    | Operações
    */
    criar,
    simular,
    adicionarRecebivel: adicionarRecebivelNaAntecipacao,
    adicionarDocumento: adicionarDocumentoNaAntecipacao,
    enviarParaAnalise,
    aceitar,

    /*
    | Utilitários
    */
    limparSimulacao,
    clearError,
    reset,
  };
}
