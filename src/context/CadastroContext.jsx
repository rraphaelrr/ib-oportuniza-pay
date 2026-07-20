import React, {
  createContext,
  useContext,
  useState,
} from "react";

const CadastroContext = createContext({});

const initialData = {
  tipoConta: "",

  // PF
  cpf: "",
  nome: "",
  nascimento: "",
  rg: "",
  nomeMae: "",
  sexo: "",

  // PJ
  cnpj: "",
  razaoSocial: "",
  nomeFantasia: "",
  inscricaoEstadual: "",
  inscricaoMunicipal: "",
  abertura: "",
  atividadePrincipal: "",
  cartaoCNPJ: null,

  // Endereço
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",

  // Contato
  email: "",
  telefone: "",
  emailToken: "",
  smsToken: "",
  emailValidado: false,
  telefoneValidado: false,

  // Documentos
  documentoFrente: null,
  documentoVerso: null,
  selfie: null,
};

export function CadastroProvider({
  children,
}) {
  const [step, setStep] = useState(0);

  const [loading, setLoading] =
    useState(false);

  const [cadastro, setCadastro] =
    useState(initialData);

  function updateField(
    field,
    value,
  ) {
    setCadastro((old) => ({
      ...old,
      [field]: value,
    }));
  }

  function updateMany(values) {
    setCadastro((old) => ({
      ...old,
      ...values,
    }));
  }

  function nextStep() {
    setStep((old) => old + 1);
  }

  function previousStep() {
    setStep((old) =>
      old > 0 ? old - 1 : 0,
    );
  }

  function goToStep(index) {
    setStep(index);
  }

  function resetCadastro() {
    setCadastro(initialData);
    setStep(0);
    setLoading(false);
  }

  return (
    <CadastroContext.Provider
      value={{
        step,
        cadastro,
        loading,

        setLoading,

        nextStep,
        previousStep,
        goToStep,

        updateField,
        updateMany,

        resetCadastro,
      }}
    >
      {children}
    </CadastroContext.Provider>
  );
}

export default function useCadastroContext() {
  return useContext(CadastroContext);
}