const VIA_CEP = "https://viacep.com.br/ws";

class CepService {
  async buscar(cep) {
    try {
      const cepLimpo = cep.replace(/\D/g, "");

      if (cepLimpo.length !== 8) {
        return {
          success: false,
          message: "CEP inválido.",
        };
      }

      const response = await fetch(
        `${VIA_CEP}/${cepLimpo}/json/`
      );

      const data = await response.json();

      if (data.erro) {
        return {
          success: false,
          message: "CEP não encontrado.",
        };
      }

      return {
        success: true,
        data: {
          cep: data.cep,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
          complemento: data.complemento,
          ibge: data.ibge,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Erro ao consultar CEP.",
      };
    }
  }

  formatar(cep) {
    return cep
      .replace(/\D/g, "")
      .replace(/^(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  }

  validar(cep) {
    return /^\d{5}-?\d{3}$/.test(cep);
  }
}

export default new CepService();