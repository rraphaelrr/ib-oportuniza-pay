class EmailService {
  // ====================================
  // Enviar código por e-mail
  // ====================================

  async enviar(email) {
    try {
      await this.delay(1200);

      console.log("E-mail enviado para:", email);

      return {
        success: true,
        token: "123456", // Mock
        message: "Código enviado com sucesso.",
      };

      /*
      return await fetch(`${API_URL}/email/send`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email})
      }).then(r=>r.json())
      */
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // ====================================
  // Validar Código
  // ====================================

  async validar(codigo) {
    await this.delay(700);

    if (codigo === "123456") {
      return {
        success: true,
        message: "E-mail confirmado.",
      };
    }

    return {
      success: false,
      message: "Código inválido.",
    };
  }

  // ====================================
  // Reenviar Código
  // ====================================

  async reenviar(email) {
    return this.enviar(email);
  }

  // ====================================
  // Validação de formato
  // ====================================

  validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  gerarCodigo() {
    return Math.floor(
      100000 + Math.random() * 900000
    ).toString();
  }

  delay(ms) {
    return new Promise(resolve =>
      setTimeout(resolve, ms)
    );
  }
}

export default new EmailService();