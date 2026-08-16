import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Stepper from "../../components/Stepper";

import StepTipoConta from "./steps/StepTipoConta";
import StepDadosPessoais from "./steps/StepDadosPessoais";
import StepEmpresa from "./steps/StepEmpresa";
import StepEndereco from "./steps/StepEndereco";
import StepContato from "./steps/StepContato";
import StepDocumentos from "./steps/StepDocumentos";
import StepConfirmacao from "./steps/StepConfirmacao";
import StepSucesso from "./steps/StepSucesso";
import StepSenha from "./steps/StepSenha";

import "./Cadastro.css";

import {
  createAccount,
  uploadAccountAttachment,
} from "../../services/accountService";

/* =========================================================
   STORAGE DA TENTATIVA DE CADASTRO
========================================================= */

const ONBOARDING_STORAGE_KEY =
  "op_onboarding_identity";

/* =========================================================
   CRIA OU RECUPERA A IDENTIDADE DA TENTATIVA
========================================================= */

function getOnboardingIdentity() {
  const stored = sessionStorage.getItem(
    ONBOARDING_STORAGE_KEY
  );

  if (stored) {
    try {
      const parsed = JSON.parse(stored);

      if (
        parsed?.external_id &&
        parsed?.idempotency_key
      ) {
        return parsed;
      }
    } catch (error) {
      console.warn(
        "Identidade de onboarding inválida. Gerando uma nova."
      );
    }
  }

  const identity = {
    external_id: uuidv4(),
    idempotency_key: uuidv4(),
  };

  sessionStorage.setItem(
    ONBOARDING_STORAGE_KEY,
    JSON.stringify(identity)
  );

  return identity;
}

/* =========================================================
   REMOVE A IDENTIDADE APÓS SUCESSO
========================================================= */

function clearOnboardingIdentity() {
  sessionStorage.removeItem(
    ONBOARDING_STORAGE_KEY
  );
}

/* =========================================================
   VALIDAÇÃO DE E-MAIL
========================================================= */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function Cadastro() {
  const [step, setStep] = useState(0);

  const [loading, setLoading] = useState(false);

  const [protocolo, setProtocolo] = useState("");

  /*
   * IMPORTANTE:
   *
   * Essa identidade representa UMA tentativa de abertura
   * de conta.
   *
   * Ela não deve mudar enquanto o cadastro estiver sendo
   * tentado novamente.
   */
  const [onboardingIdentity] = useState(
    getOnboardingIdentity
  );

  /* =========================================================
     FORMULÁRIO
  ========================================================= */

  const initialForm = {
    tipoConta: "",
    agencyId: "",

    // =====================================================
    // PESSOA FÍSICA
    // =====================================================

    cpf: "",
    nome: "",
    dataNascimento: "",
    rg: "",
    nomeMae: "",
    sexo: "",

    // =====================================================
    // PESSOA JURÍDICA
    // =====================================================

    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    inscricaoEstadual: "",
    inscricaoMunicipal: "",
    naturezaJuridica: "",
    capitalSocial: "",
    fundacao: "",
    cnae: "",

    // =====================================================
    // ENDEREÇO
    // =====================================================

    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",

    // =====================================================
    // CONTATO
    // =====================================================

    email: "",
    telefone: "",

    // =====================================================
    // SENHA
    // =====================================================

    numericPassword: "",
    confirmNumericPassword: "",

    // =====================================================
    // DOCUMENTOS
    // =====================================================

    documentoFrente: null,
    documentoVerso: null,
    selfie: null,
    cartaoCNPJ: null,

    // =====================================================
    // TERMOS
    // =====================================================

    aceite: false,
  };

  const [form, setForm] = useState(initialForm);

  /* =========================================================
     ATUALIZA UM CAMPO
  ========================================================= */

  function updateField(field, value) {
    setForm((old) => ({
      ...old,
      [field]: value,
    }));
  }

  /* =========================================================
     ATUALIZA VÁRIOS CAMPOS
  ========================================================= */

  function updateFields(values) {
    setForm((old) => ({
      ...old,
      ...values,
    }));
  }

  /* =========================================================
     ETAPAS - PESSOA FÍSICA
  ========================================================= */

  const stepsPF = [
    {
      id: 1,
      title: "Tipo",
      component: StepTipoConta,
    },

    {
      id: 2,
      title: "Pessoal",
      component: StepDadosPessoais,
    },

    {
      id: 3,
      title: "Endereço",
      component: StepEndereco,
    },

    {
      id: 4,
      title: "Contato",
      component: StepContato,
    },

    {
      id: 5,
      title: "Senha",
      component: StepSenha,
    },

    {
      id: 6,
      title: "Documentos",
      component: StepDocumentos,
    },

    {
      id: 7,
      title: "Confirmação",
      component: StepConfirmacao,
    },

    {
      id: 8,
      title: "Sucesso",
      component: StepSucesso,
    },
  ];

  /* =========================================================
     ETAPAS - PESSOA JURÍDICA
  ========================================================= */

  const stepsPJ = [
    {
      id: 1,
      title: "Tipo",
      component: StepTipoConta,
    },

    {
      id: 2,
      title: "Responsável",
      component: StepDadosPessoais,
    },

    {
      id: 3,
      title: "Empresa",
      component: StepEmpresa,
    },

    {
      id: 4,
      title: "Endereço",
      component: StepEndereco,
    },

    {
      id: 5,
      title: "Contato",
      component: StepContato,
    },

    {
      id: 6,
      title: "Senha",
      component: StepSenha,
    },

    {
      id: 7,
      title: "Documentos",
      component: StepDocumentos,
    },

    {
      id: 8,
      title: "Confirmação",
      component: StepConfirmacao,
    },

    {
      id: 9,
      title: "Sucesso",
      component: StepSucesso,
    },
  ];

  /* =========================================================
     DEFINE AS ETAPAS
  ========================================================= */

  const steps =
    form.tipoConta?.toUpperCase() === "PJ"
      ? stepsPJ
      : stepsPF;

  const CurrentStep =
    steps[step]?.component;

  /* =========================================================
     AVANÇAR
  ========================================================= */

  function next() {
    if (step < steps.length - 1) {
      setStep((old) => old + 1);
    }
  }

  /* =========================================================
     VOLTAR
  ========================================================= */

  function back() {
    if (step > 0) {
      setStep((old) => old - 1);
    }
  }

  /* =========================================================
     FINALIZAR CADASTRO
  ========================================================= */

  async function handleSubmit() {
    /*
     * Impede múltiplos submits.
     *
     * Mesmo que o usuário clique várias vezes,
     * somente a primeira requisição será iniciada.
     */
    if (loading) {
      return;
    }

    /* =====================================================
       NORMALIZAÇÃO DO E-MAIL
    ===================================================== */

    const normalizedEmail = String(
      form.email || ""
    )
      .trim()
      .toLowerCase();

    /* =====================================================
       VALIDAÇÃO DO E-MAIL
    ===================================================== */

    if (!normalizedEmail) {
      alert("Informe seu e-mail.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      alert(
        "Informe um endereço de e-mail válido."
      );
      return;
    }

    /*
     * Criamos uma cópia do formulário.
     *
     * O e-mail enviado para a API será exatamente
     * o e-mail normalizado.
     */
    const submitForm = {
      ...form,
      email: normalizedEmail,
    };

    /*
     * Mantém também o estado React sincronizado.
     */
    setForm((old) => ({
      ...old,
      email: normalizedEmail,
    }));

    try {
      setLoading(true);

      console.log(
        "Iniciando criação da conta..."
      );

      console.log(
        "external_id:",
        onboardingIdentity.external_id
      );

      console.log(
        "Idempotency-Key:",
        onboardingIdentity.idempotency_key
      );

      /*
       * IMPORTANTE:
       *
       * NÃO gerar UUID aqui.
       *
       * A mesma identidade será utilizada caso
       * o usuário precise tentar novamente.
       */
      const response = await createAccount(
        submitForm,
        onboardingIdentity
      );

      console.log(
        "Conta criada:",
        response
      );

      /* ===================================================
         ID DA CONTA
      =================================================== */

      const accountId = response.id;

      /* ===================================================
         ANEXOS
      =================================================== */

      const attachments = [];

      /* Documento frente */

      if (form.documentoFrente) {
        attachments.push({
          file: form.documentoFrente,

          attachmentType:
            "identity_document",

          description:
            "document_front",
        });
      }

      /* Documento verso */

      if (form.documentoVerso) {
        attachments.push({
          file: form.documentoVerso,

          attachmentType:
            "identity_document",

          description:
            "document_back",
        });
      }

      /* Selfie */

      if (form.selfie) {
        attachments.push({
          file: form.selfie,

          attachmentType: "selfie",

          description:
            "selfie_with_document",
        });
      }

      /* Cartão CNPJ */

      if (form.cartaoCNPJ) {
        attachments.push({
          file: form.cartaoCNPJ,

          attachmentType:
            "company_document",

          description:
            "cnpj_card",
        });
      }

      /* ===================================================
         UPLOAD DOS ANEXOS
      =================================================== */

      if (attachments.length > 0) {
        await uploadAccountAttachment(
          accountId,
          attachments
        );

        console.log(
          "Todos os anexos enviados."
        );
      }

      /* ===================================================
         PROTOCOLO
      =================================================== */

      setProtocolo(
        response.account_number
      );

      /* ===================================================
         CADASTRO CONCLUÍDO
      =================================================== */

      /*
       * Agora que a conta foi criada com sucesso,
       * não precisamos mais manter a identidade
       * dessa tentativa.
       */
      clearOnboardingIdentity();

      /* ===================================================
         TELA DE SUCESSO
      =================================================== */

      setStep(
        steps.length - 1
      );
    } catch (error) {
      console.error(
        "Erro ao criar conta:",
        error
      );

      /* ===================================================
         CÓDIGO DO ERRO
      =================================================== */

      const errorCode =
        error.response?.data?.error?.code;

      /* ===================================================
         MENSAGENS
      =================================================== */

      const errorMessages = {
        weak_password:
          "A senha escolhida é muito fraca. Volte à etapa de senha e escolha uma senha mais segura.",

        invalid_password:
          "A senha informada é inválida. Verifique a senha e tente novamente.",

        cpf_already_exists:
          "Este CPF já possui uma conta cadastrada.",

        cnpj_already_exists:
          "Este CNPJ já possui uma conta cadastrada.",

        email_already_exists:
          "Este e-mail já possui uma conta cadastrada.",

        invalid_cpf:
          "O CPF informado é inválido.",

        invalid_cnpj:
          "O CNPJ informado é inválido.",
      };

      const message =
        errorMessages[errorCode] ||
        error.response?.data?.message ||
        "Não foi possível criar a conta. Verifique os dados e tente novamente.";

      /* ===================================================
         ERRO DE SENHA
      =================================================== */

      if (
        errorCode === "weak_password" ||
        errorCode === "invalid_password"
      ) {
        const passwordStepIndex =
          steps.findIndex(
            (item) =>
              item.component === StepSenha
          );

        if (passwordStepIndex !== -1) {
          setStep(
            passwordStepIndex
          );
        }
      }

      /* ===================================================
         AVISO
      =================================================== */

      alert(message);

      /*
       * IMPORTANTE:
       *
       * NÃO fazemos:
       *
       * clearOnboardingIdentity();
       *
       * aqui.
       *
       * Se a API falhar, o usuário pode tentar
       * novamente usando a MESMA Idempotency-Key
       * e o MESMO external_id.
       */
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     VOLTAR PARA LOGIN
  ========================================================= */

  function handleHome() {
    /*
     * Se o usuário decidiu abandonar o cadastro,
     * podemos descartar a identidade da tentativa.
     */
    clearOnboardingIdentity();

    window.location.href = "/login";
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="cadastro">
      <div className="cadastro-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="cadastro-header">
          <h1>
            Abertura de Conta
          </h1>

          <p>
            Preencha seus dados para abrir
            sua conta digital.
          </p>
        </div>

        {/* =================================================
            STEPPER
        ================================================= */}

        <Stepper
          steps={steps}
          currentStep={step}
        />

        {/* =================================================
            CONTEÚDO
        ================================================= */}

        <div className="cadastro-body">
          {CurrentStep && (
            <CurrentStep
              values={form}

              updateField={
                updateField
              }

              updateFields={
                updateFields
              }

              next={next}

              back={back}

              onSubmit={
                handleSubmit
              }

              loading={loading}

              protocolo={
                protocolo
              }

              onHome={
                handleHome
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}