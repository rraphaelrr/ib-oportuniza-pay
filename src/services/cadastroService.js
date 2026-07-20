// src/services/cadastroService.js

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:3001";

class CadastroService {
  // ==========================
  // Buscar CEP
  // ==========================
  async buscarCEP(cep) {
    try {
      cep = cep.replace(/\D/g, "");

      if (cep.length !== 8) {
        throw new Error("CEP inválido.");
      }

      const response = await fetch(
        `https://viacep.com.br/ws/${cep}/json/`
      );

      const data = await response.json();

      if (data.erro) {
        throw new Error("CEP não encontrado.");
      }

      return {
        success: true,
        endereco: {
          cep: data.cep,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        },
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  // ==========================
  // Enviar token SMS
  // ==========================
  async enviarCodigoSMS(telefone) {
    try {
      // Simulação

      await this.delay(1000);

      console.log("SMS enviado para", telefone);

      return {
        success: true,
        codigo: "123456", // remover quando integrar API
      };

      /*
      return await fetch(`${API_URL}/cadastro/sms`,{
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({telefone})
      }).then(r=>r.json())
      */
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  // ==========================
  // Validar SMS
  // ==========================
  async validarSMS(codigo) {
    await this.delay(700);

    return {
      success: codigo === "123456",
      message:
        codigo === "123456"
          ? "Telefone confirmado."
          : "Código inválido.",
    };
  }

  // ==========================
  // Enviar Token Email
  // ==========================
  async enviarCodigoEmail(email) {
    try {
      await this.delay(1000);

      console.log("Email enviado para", email);

      return {
        success: true,
        codigo: "123456",
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  // ==========================
  // Validar Email
  // ==========================
  async validarEmail(codigo) {
    await this.delay(700);

    return {
      success: codigo === "123456",
      message:
        codigo === "123456"
          ? "Email confirmado."
          : "Código inválido.",
    };
  }

  // ==========================
  // Upload Documento
  // ==========================
  async uploadDocumento(file) {
    try {
      await this.delay(1200);

      return {
        success: true,
        url:
          "https://dummyimage.com/600x400/003399/ffffff.png",
      };

      /*
      const formData=new FormData();
      formData.append("file",file);

      return await fetch(`${API_URL}/upload`,{
          method:"POST",
          body:formData
      }).then(r=>r.json());
      */
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  // ==========================
  // Upload Selfie
  // ==========================
  async uploadSelfie(file) {
    return this.uploadDocumento(file);
  }

  // ==========================
  // Buscar CNPJ
  // ==========================
  async buscarCNPJ(cnpj) {
    try {
      cnpj = cnpj.replace(/\D/g, "");

      await this.delay(1000);

      // Simulação

      return {
        success: true,
        empresa: {
          razaoSocial: "EMPRESA DEMONSTRAÇÃO LTDA",
          nomeFantasia: "Empresa Teste",
          cnpj,
          situacao: "ATIVA",
          abertura: "01/01/2020",
        },
      };

      /*
      return await fetch(`${API_URL}/cnpj/${cnpj}`)
      .then(r=>r.json())
      */
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  // ==========================
  // Validar CPF
  // ==========================
  validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11) return false;

    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;

    for (let i = 0; i < 9; i++) {
      soma += Number(cpf[i]) * (10 - i);
    }

    let resto = (soma * 10) % 11;

    if (resto === 10) resto = 0;

    if (resto !== Number(cpf[9])) return false;

    soma = 0;

    for (let i = 0; i < 10; i++) {
      soma += Number(cpf[i]) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10) resto = 0;

    return resto === Number(cpf[10]);
  }

  // ==========================
  // Validar CNPJ
  // ==========================
  validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, "");

    if (cnpj.length !== 14) return false;

    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;

    let numeros = cnpj.substring(0, tamanho);

    const digitos = cnpj.substring(tamanho);

    let soma = 0;

    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros[tamanho - i] * pos--;

      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado !== Number(digitos[0])) return false;

    tamanho++;

    numeros = cnpj.substring(0, tamanho);

    soma = 0;

    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros[tamanho - i] * pos--;

      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    return resultado === Number(digitos[1]);
  }

  // ==========================
  // Validar Email
  // ==========================
  validarFormatoEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ==========================
  // Enviar Cadastro
  // ==========================
  async cadastrar(dados) {
    try {
      await this.delay(2500);

      console.log("Cadastro enviado:", dados);

      return {
        success: true,
        protocolo:
          "OP" +
          Math.floor(
            100000000 + Math.random() * 900000000
          ),
      };

      /*
      return await fetch(`${API_URL}/cadastro`,{
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify(dados)
      }).then(r=>r.json())
      */
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  // ==========================
  // Utilitário
  // ==========================
  delay(ms) {
    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );
  }
}

export default new CadastroService();