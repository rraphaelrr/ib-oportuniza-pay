class UploadService {
  // ====================================
  // Upload Genérico
  // ====================================

  async upload(file) {
    try {
      await this.delay(1800);

      if (!file) {
        return {
          success: false,
          message: "Nenhum arquivo selecionado.",
        };
      }

      console.log("Arquivo enviado:", file);

      return {
        success: true,
        file: {
          id: Date.now(),
          nome: file.name || "arquivo.jpg",
          tamanho: file.size || 0,
          tipo: file.type || "image/jpeg",
          url: URL.createObjectURL(file),
        },
      };

      /*
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/upload`,{
        method:"POST",
        body:formData
      });

      return await response.json();
      */

    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // ====================================
  // Upload Documento
  // ====================================

  async uploadDocumento(file) {
    return this.upload(file);
  }

  // ====================================
  // Upload Selfie
  // ====================================

  async uploadSelfie(file) {
    return this.upload(file);
  }

  // ====================================
  // Upload Cartão CNPJ
  // ====================================

  async uploadCartaoCNPJ(file) {
    return this.upload(file);
  }

  // ====================================
  // Validar arquivo
  // ====================================

  validar(file) {
    if (!file) {
      return {
        success: false,
        message: "Arquivo obrigatório.",
      };
    }

    const tiposPermitidos = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (!tiposPermitidos.includes(file.type)) {
      return {
        success: false,
        message: "Tipo de arquivo não permitido.",
      };
    }

    const tamanhoMaximo = 10 * 1024 * 1024;

    if (file.size > tamanhoMaximo) {
      return {
        success: false,
        message: "Arquivo maior que 10MB.",
      };
    }

    return {
      success: true,
    };
  }

  // ====================================
  // Excluir Upload
  // ====================================

  async remover(id) {
    await this.delay(500);

    console.log("Arquivo removido:", id);

    return {
      success: true,
    };

    /*
    return await fetch(`${API_URL}/upload/${id}`,{
      method:"DELETE"
    }).then(r=>r.json())
    */
  }

  delay(ms) {
    return new Promise(resolve =>
      setTimeout(resolve, ms)
    );
  }
}

export default new UploadService();