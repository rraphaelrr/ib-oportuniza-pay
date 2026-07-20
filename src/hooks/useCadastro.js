import useCadastroContext from "../context/CadastroContext";

import cadastroService from "../services/cadastroService";

export default function useCadastro() {
  const {
    cadastro,
    step,
    loading,

    setLoading,

    nextStep,
    previousStep,
    goToStep,

    updateField,
    updateMany,

    resetCadastro,
  } = useCadastroContext();

  async function finalizarCadastro() {
    try {
      setLoading(true);

      const response =
        await cadastroService.cadastrar(
          cadastro,
        );

      return response;
    } finally {
      setLoading(false);
    }
  }

  function setDocumentoFrente(
    image,
  ) {
    updateField(
      "documentoFrente",
      image,
    );
  }

  function setDocumentoVerso(
    image,
  ) {
    updateField(
      "documentoVerso",
      image,
    );
  }

  function setSelfie(image) {
    updateField("selfie", image);
  }

  function setCartaoCNPJ(image) {
    updateField("cartaoCNPJ", image);
  }

  function confirmarEmail() {
    updateField(
      "emailValidado",
      true,
    );
  }

  function confirmarTelefone() {
    updateField(
      "telefoneValidado",
      true,
    );
  }

  const isPF =
    cadastro.tipoConta === "PF";

  const isPJ =
    cadastro.tipoConta === "PJ";

  return {
    cadastro,

    step,

    loading,

    isPF,
    isPJ,

    nextStep,
    previousStep,
    goToStep,

    updateField,
    updateMany,

    finalizarCadastro,

    confirmarEmail,
    confirmarTelefone,

    setDocumentoFrente,
    setDocumentoVerso,
    setSelfie,
    setCartaoCNPJ,

    resetCadastro,
  };
}