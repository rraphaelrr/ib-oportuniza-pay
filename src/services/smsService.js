class SmsService {
  // ===========================
  // Enviar código SMS
  // ===========================

  async enviar(telefone) {
    try {
      await this.delay(1200);

      console.log(
        "SMS enviado para:",
        telefone
      );

      return {
        success: true,
        token: "123456", // somente demonstração
        message: "Código enviado com sucesso.",
      };

      /*
      return await fetch(`${API_URL}/sms/send`,{
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({telefone})
      }).then(r=>r.json());
      */
    } catch (e) {
      return {
        success: false,
        message: e.message,
      };
    }
  }

  // ===========================
  // Validar Código
  // ===========================

  async validar(codigo) {
    await this.delay(800);

    if (codigo === "123456") {
      return {
        success: true,
        message: "Telefone confirmado.",
      };
    }

    return {
      success: false,
      message: "Código inválido.",
    };
  }

  // ===========================
  // Reenviar SMS
  // ===========================

  async reenviar(telefone) {
    return this.enviar(telefone);
  }

  // ===========================
  // Gerador de Token (mock)
  // ===========================

  gerarCodigo() {
    return Math.floor(
      100000 + Math.random() * 900000
    ).toString();
  }

  delay(ms) {
    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );
  }
}

export default new SmsService();