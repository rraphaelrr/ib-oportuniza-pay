// src/services/comprovanteService.js

function random(size) {
  return Math.random()
    .toString(36)
    .substring(2, size)
    .toUpperCase();
}

function endToEnd() {
  return (
    "E" +
    Date.now() +
    Math.floor(
      Math.random() * 999999999999
    )
  );
}

const comprovanteService = {
  async gerar(movimento) {
    await new Promise((r) =>
      setTimeout(r, 500)
    );

    return {
      numero:
        "CP-" +
        Date.now(),

      txId:
        "TX" +
        random(15),

      endToEnd:
        endToEnd(),

      autenticacao:
        random(10) +
        "-" +
        random(10),

      status:
        movimento.status ||

        "Concluído",

      data:
        movimento.data,

      valor:
        movimento.valor,

      categoria:
        movimento.categoria,

      descricao:
        movimento.descricao,

      origem: {
        nome:
          "Raphael Souza Rodrigues",

        documento:
          "123.456.789-00",

        banco:
          "Oportuniza Pay",

        agencia:
          "0001",

        conta:
          "00012345-6",

        chavePix:
          "raphael@email.com",
      },

      destino: {
        nome:
          movimento.favorecido,

        documento:
          "***.***.***-**",

        banco:
          movimento.bancoDestino,

        agencia:
          String(
            Math.floor(
              Math.random() * 9999
            )
          ).padStart(4, "0"),

        conta:
          Math.floor(
            Math.random() * 999999
          ) + "-0",

        chavePix:
          "destino@email.com",
      },
    };
  },
};

export default comprovanteService;