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

import "./Cadastro.css";

export default function Cadastro() {
  const [step, setStep] = useState(0);

  const [loading, setLoading] = useState(false);

  const [protocolo, setProtocolo] = useState("");

  const initialForm = {
    tipoConta: "",

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
    codigoEmail: "",
    codigoSMS: "",

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
      title: "Documentos",
      component: StepDocumentos,
    },

    {
      id: 6,
      title: "Confirmação",
      component: StepConfirmacao,
    },

    {
      id: 7,
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

      console.log("Cadastro enviado:", form);

      /*
        Aqui entra sua API:

        await api.post("/cadastro",form)

      */

      const novoProtocolo = "OP" + Date.now();

      setProtocolo(novoProtocolo);

      // vai para tela sucesso

      setStep(steps.length - 1);
    } catch (error) {
      console.error(error);

      alert("Erro ao enviar cadastro");
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
