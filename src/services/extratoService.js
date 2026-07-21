// src/services/extratoService.js

const categorias = [
  "PIX",
  "Transferência",
  "TED",
  "DOC",
  "Pagamento",
  "Boleto",
  "Cartão",
];

const pessoas = [
  "João Pedro",
  "Maria Oliveira",
  "Carlos Henrique",
  "Ana Beatriz",
  "Hospital São Lucas",
  "Farmácia Vida",
  "Clínica Saúde Total",
  "Laboratório Alpha",
];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(list) {
  return list[random(0, list.length - 1)];
}

function gerarMovimento(id) {
  const positivo = Math.random() > 0.45;

  const categoria = randomItem(categorias);

  const data = new Date();

  data.setDate(data.getDate() - random(0, 90));

  data.setHours(random(0, 23));
  data.setMinutes(random(0, 59));
  data.setSeconds(random(0, 59));

  return {
    id,

    descricao: positivo
      ? `${categoria} Recebido`
      : `${categoria} Enviado`,

    categoria,

    tipo: positivo ? "entrada" : "saida",

    valor: Number(
      (Math.random() * 9000 + 15).toFixed(2)
    ),

    data,

    favorecido: randomItem(pessoas),

    status: "Concluído",

    bancoOrigem: "Oportuniza Pay",

    bancoDestino: randomItem([
      "Banco do Brasil",
      "Caixa Econômica",
      "Bradesco",
      "Santander",
      "Itaú",
      "Nubank",
      "Inter",
      "C6 Bank",
    ]),
  };
}

const DATABASE = Array.from(
  {
    length: 600,
  },
  (_, index) => gerarMovimento(index + 1)
).sort((a, b) => b.data - a.data);

function filtrar(lista, filtros) {
  let dados = [...lista];

  if (filtros.tipo) {
    dados = dados.filter(
      (i) => i.tipo === filtros.tipo
    );
  }

  if (filtros.categoria) {
    dados = dados.filter(
      (i) => i.categoria === filtros.categoria
    );
  }

  if (filtros.dataDe) {
    dados = dados.filter(
      (i) =>
        new Date(i.data) >=
        new Date(filtros.dataDe)
    );
  }

  if (filtros.dataAte) {
    dados = dados.filter(
      (i) =>
        new Date(i.data) <=
        new Date(filtros.dataAte)
    );
  }

  return dados;
}

const extratoService = {
  async list({
    page = 1,
    limit = 20,
    ...filters
  }) {
    await new Promise((r) =>
      setTimeout(r, 600)
    );

    const dados = filtrar(
      DATABASE,
      filters
    );

    const start = (page - 1) * limit;

    const end = start + limit;

    return {
      page,

      total: dados.length,

      totalPages: Math.ceil(
        dados.length / limit
      ),

      data: dados.slice(start, end),
    };
  },

  async findById(id) {
    await new Promise((r) =>
      setTimeout(r, 300)
    );

    return DATABASE.find(
      (i) => i.id === Number(id)
    );
  },
};

export default extratoService;