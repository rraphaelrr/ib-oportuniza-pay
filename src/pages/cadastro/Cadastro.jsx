import React, { useState } from "react";

import DashboardLayout from "../../layout/DashboardLayout";

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

  const [form, setForm] = useState({
    tipoConta: "",

    cpf: "",
    nome: "",
    nascimento: "",
    rg: "",
    nomeMae: "",
    sexo: "",

    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    inscricaoEstadual: "",
    inscricaoMunicipal: "",
    naturezaJuridica: "",
    capitalSocial: "",
    abertura: "",
    cnae: "",

    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",

    email: "",
    emailConfirmacao: "",
    telefone: "",
    telefoneConfirmacao: "",

    codigoEmail: "",
    codigoSMS: "",

    documentoFrente: null,
    documentoVerso: null,
    selfie: null,
    cartaoCNPJ: null,
  });

  const totalSteps =
    form.tipoConta === "pj"
      ? 7
      : 6;

  function updateField(field, value) {
    setForm((old) => ({
      ...old,
      [field]: value,
    }));
  }

  function next() {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  }

  function back() {
    if (step > 0) {
      setStep(step - 1);
    }
  }

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <StepTipoConta
            values={form}
            updateField={updateField}
            next={next}
          />
        );

      case 1:
        return (
          <StepDadosPessoais
            values={form}
            updateField={updateField}
            next={next}
            back={back}
          />
        );

      case 2:
        if (form.tipoConta === "pj") {
          return (
            <StepEmpresa
              values={form}
              updateField={updateField}
              next={next}
              back={back}
            />
          );
        }

        return (
          <StepEndereco
            values={form}
            updateField={updateField}
            next={next}
            back={back}
          />
        );

      case 3:
        if (form.tipoConta === "pj") {
          return (
            <StepEndereco
              values={form}
              updateField={updateField}
              next={next}
              back={back}
            />
          );
        }

        return (
          <StepContato
            values={form}
            updateField={updateField}
            next={next}
            back={back}
          />
        );

      case 4:
        if (form.tipoConta === "pj") {
          return (
            <StepContato
              values={form}
              updateField={updateField}
              next={next}
              back={back}
            />
          );
        }

        return (
          <StepDocumentos
            values={form}
            updateField={updateField}
            next={next}
            back={back}
          />
        );

      case 5:
        if (form.tipoConta === "pj") {
          return (
            <StepDocumentos
              values={form}
              updateField={updateField}
              next={next}
              back={back}
            />
          );
        }

        return (
          <StepConfirmacao
            values={form}
            next={next}
            back={back}
          />
        );

      case 6:
        if (form.tipoConta === "pj") {
          return (
            <StepConfirmacao
              values={form}
              next={next}
              back={back}
            />
          );
        }

        return <StepSucesso />;

      case 7:
        return <StepSucesso />;

      default:
        return null;
    }
  }

  return (
    <DashboardLayout>
      <div className="cadastro">

        <div className="cadastro-card">

          <div className="cadastro-header">
            <h1>Abertura de Conta</h1>

            <p>
              Preencha seus dados para abrir sua conta digital.
            </p>
          </div>

          <Stepper
            current={step}
            total={totalSteps + 1}
          />

          <div className="cadastro-body">
            {renderStep()}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}