import React, { useState } from "react";

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
export default function Cadastro() {
  const [step, setStep] = useState(0);

  const [loading, setLoading] = useState(false);

  const [protocolo, setProtocolo] = useState("");

  const initialForm = {
    tipoConta: "",
    agencyId: "",
    // PF

    cpf: "",
    nome: "",
    dataNascimento: "",
    rg: "",
    nomeMae: "",
    sexo: "",

    // PJ

    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    inscricaoEstadual: "",
    inscricaoMunicipal: "",
    naturezaJuridica: "",
    capitalSocial: "",
    fundacao: "",
    cnae: "",

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

    // Senha

    numericPassword: "",
    confirmNumericPassword: "",

    // Documentos

    documentoFrente: null,
    documentoVerso: null,
    selfie: null,
    cartaoCNPJ: null,

    // Termos

    aceite: false,
  };

  const [form, setForm] = useState(initialForm);

  function updateField(field, value) {
    setForm((old) => ({
      ...old,
      [field]: value,
    }));
  }

  function updateFields(values) {
    setForm((old) => ({
      ...old,
      ...values,
    }));
  }

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

  const steps = form.tipoConta?.toUpperCase() === "PJ" ? stepsPJ : stepsPF;

  const CurrentStep = steps[step]?.component;

  function next() {
    if (step < steps.length - 1) {
      setStep((old) => old + 1);
    }
  }

  function back() {
    if (step > 0) {
      setStep((old) => old - 1);
    }
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      const response = await createAccount(form);

      console.log("Conta criada:", response);

      const accountId = response.id;

      const attachments = [];

      if (form.documentoFrente) {
        attachments.push({
          file: form.documentoFrente,
          attachmentType: "identity_document",
          description: "document_front",
        });
      }

      if (form.documentoVerso) {
        attachments.push({
          file: form.documentoVerso,
          attachmentType: "identity_document",
          description: "document_back",
        });
      }

      if (form.selfie) {
        attachments.push({
          file: form.selfie,
          attachmentType: "selfie",
          description: "selfie_with_document",
        });
      }

      if (form.cartaoCNPJ) {
        attachments.push({
          file: form.cartaoCNPJ,
          attachmentType: "company_document",
          description: "cnpj_card",
        });
      }

      if (attachments.length > 0) {
        await uploadAccountAttachment(accountId, attachments);

        console.log("Todos os anexos enviados.");
      }

      setProtocolo(response.account_number);

      setStep(steps.length - 1);
    } catch (error) {
      console.error("Erro ao criar conta:", error);

      const errorCode = error.response?.data?.error?.code;

      // Mensagens amigáveis para os erros vindos do backend
      const errorMessages = {
        weak_password:
          "A senha escolhida é muito fraca. Volte à etapa de senha e escolha uma senha mais segura.",

        invalid_password:
          "A senha informada é inválida. Verifique a senha e tente novamente.",

        cpf_already_exists: "Este CPF já possui uma conta cadastrada.",

        cnpj_already_exists: "Este CNPJ já possui uma conta cadastrada.",

        email_already_exists: "Este e-mail já possui uma conta cadastrada.",

        invalid_cpf: "O CPF informado é inválido.",

        invalid_cnpj: "O CNPJ informado é inválido.",
      };

      const message =
        errorMessages[errorCode] ||
        error.response?.data?.message ||
        "Não foi possível criar a conta. Verifique os dados e tente novamente.";

      // Se o erro for relacionado à senha,
      // volta automaticamente para a etapa de senha.
      if (errorCode === "weak_password" || errorCode === "invalid_password") {
        const passwordStepIndex = steps.findIndex(
          (item) => item.component === StepSenha,
        );

        if (passwordStepIndex !== -1) {
          setStep(passwordStepIndex);
        }
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cadastro">
      <div className="cadastro-card">
        <div className="cadastro-header">
          <h1>Abertura de Conta</h1>

          <p>Preencha seus dados para abrir sua conta digital.</p>
        </div>

        <Stepper steps={steps} currentStep={step} />

        <div className="cadastro-body">
          {CurrentStep && (
            <CurrentStep
              values={form}
              updateField={updateField}
              updateFields={updateFields}
              next={next}
              back={back}
              onSubmit={handleSubmit}
              loading={loading}
              protocolo={protocolo}
              onHome={() => {
                window.location.href = "/login";
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
