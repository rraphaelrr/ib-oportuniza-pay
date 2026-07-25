// src/services/pixService.js

/**
 * Serviço responsável por todas as chamadas da API PIX.
 * Atualmente utiliza dados mockados.
 * Basta substituir os métodos fetch pelos endpoints reais.
 */

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const MOCK_DELAY = 800;

const wait = (ms = MOCK_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function request(url, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    ...options,
  });

  if (!response.ok) {
    let error = "Erro ao processar a requisição.";

    try {
      const body = await response.json();
      error = body.message || error;
    } catch {}

    throw new Error(error);
  }

  return response.json();
}

const pixService = {
  /**
   * Busca uma chave PIX.
   */
  async buscarChave(chave) {
    // ===== API REAL =====
    // return request("/pix/buscar-chave", {
    //   method: "POST",
    //   body: JSON.stringify({ chave }),
    // });

    await wait();

    return {
      sucesso: true,
      data: {
        nome: "João Silva",
        banco: "Banco Inter",
        documento: "***.456.789-**",
        chave,
      },
    };
  },

  /**
   * Envia um PIX.
   */
  async enviarPix(payload) {
    // ===== API REAL =====
    // return request("/pix/enviar", {
    //   method: "POST",
    //   body: JSON.stringify(payload),
    // });

    await wait(1500);

    return {
      sucesso: true,
      comprovante: {
        idTransacao: crypto.randomUUID(),
        e2e:
          "E" +
          Math.random()
            .toString(36)
            .substring(2)
            .toUpperCase(),
        data: new Date().toLocaleString("pt-BR"),
        ...payload,
      },
    };
  },

  /**
   * Gera QRCode PIX.
   */
  async gerarQRCode(payload) {
    // ===== API REAL =====
    // return request("/pix/qrcode", {
    //   method: "POST",
    //   body: JSON.stringify(payload),
    // });

    await wait();

    return {
      sucesso: true,
      payload:
        "00020126580014BR.GOV.BCB.PIX0114PIX@OPORTUNIZA.COM5204000053039865406100.005802BR5920OPORTUNIZA PAY6009SAO PAULO62070503***6304ABCD",
    };
  },

  /**
   * Valida um código Pix Copia e Cola.
   */
  async validarPayload(payload) {
    // ===== API REAL =====
    // return request("/pix/validar", {
    //   method: "POST",
    //   body: JSON.stringify({ payload }),
    // });

    await wait();

    return {
      sucesso: true,
      data: {
        nome: "Empresa XPTO",
        banco: "Banco do Brasil",
        valor: 150.75,
        payload,
      },
    };
  },

  /**
   * Lista chaves PIX.
   */
  async listarChaves() {
    // ===== API REAL =====
    // return request("/pix/chaves");

    await wait();

    return [
      {
        id: 1,
        tipo: "cpf",
        chave: "123.456.789-00",
        principal: true,
      },
      {
        id: 2,
        tipo: "telefone",
        chave: "(11)99999-9999",
      },
      {
        id: 3,
        tipo: "email",
        chave: "usuario@email.com",
      },
      {
        id: 4,
        tipo: "aleatoria",
        chave: crypto.randomUUID(),
      },
    ];
  },

  /**
   * Lista favoritos.
   */
  async listarFavoritos() {
    // ===== API REAL =====
    // return request("/pix/favoritos");

    await wait();

    return [
      {
        id: 1,
        nome: "João Silva",
        chave: "joao@email.com",
        banco: "Banco Inter",
      },
      {
        id: 2,
        nome: "Maria Oliveira",
        chave: "(11)99999-8888",
        banco: "Itaú",
      },
    ];
  },

  /**
   * Lista histórico PIX.
   */
  async listarHistorico() {
    // ===== API REAL =====
    // return request("/pix/historico");

    await wait();

    return [
      {
        id: 1,
        tipo: "entrada",
        nome: "Empresa XPTO",
        descricao: "Pagamento",
        valor: 2500,
        data: "24/07/2026 09:20",
      },
      {
        id: 2,
        tipo: "saida",
        nome: "Netflix",
        descricao: "Assinatura",
        valor: 55.9,
        data: "23/07/2026 21:18",
      },
      {
        id: 3,
        tipo: "saida",
        nome: "João Silva",
        descricao: "Transferência",
        valor: 150,
        data: "22/07/2026 14:55",
      },
    ];
  },

  /**
   * Obtém comprovante.
   */
  async obterComprovante(id) {
    // ===== API REAL =====
    // return request(`/pix/comprovante/${id}`);

    await wait();

    return {
      id,
      nome: "João Silva",
      chave: "joao@email.com",
      banco: "Banco Inter",
      valor: 150,
      descricao: "Pagamento",
      data: "24/07/2026 14:20",
      idTransacao: crypto.randomUUID(),
      e2e:
        "E" +
        Math.random()
          .toString(36)
          .substring(2)
          .toUpperCase(),
    };
  },

  /**
   * Remove favorito.
   */
  async removerFavorito(id) {
    // ===== API REAL =====
    // return request(`/pix/favoritos/${id}`, {
    //   method: "DELETE",
    // });

    await wait();

    return {
      sucesso: true,
      id,
    };
  },

  /**
   * Adiciona favorito.
   */
  async adicionarFavorito(payload) {
    // ===== API REAL =====
    // return request("/pix/favoritos", {
    //   method: "POST",
    //   body: JSON.stringify(payload),
    // });

    await wait();

    return {
      sucesso: true,
      id: crypto.randomUUID(),
      ...payload,
    };
  },

  /**
   * Devolução PIX.
   */
  async devolverPix(id, valor) {
    // ===== API REAL =====
    // return request(`/pix/devolver/${id}`, {
    //   method: "POST",
    //   body: JSON.stringify({ valor }),
    // });

    await wait();

    return {
      sucesso: true,
      id,
      valor,
    };
  },
};

export default pixService;