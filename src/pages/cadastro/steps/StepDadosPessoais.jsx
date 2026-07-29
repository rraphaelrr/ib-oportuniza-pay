import React, { useEffect, useState } from "react";

import Input from "../../../components/Input";
import CPFInput from "../../../components/CPFInput";
import CNPJInput from "../../../components/CNPJInput";
import DateInput from "../../../components/DateInput";

import "./CadastroSteps.css";
import { getAgencies } from "../../../services/agencyService";

export default function StepDadosPessoais({
  tipoConta,
  values,
  updateField,
  errors = {},
  next,
  back,
}) {
  const [agencies, setAgencies] = useState([]);
  const [loadingAgencies, setLoadingAgencies] = useState(true);

  useEffect(() => {
    console.log("StepDadosPessoais montou");

    async function loadAgencies() {
      console.log("Chamando getAgencies...");

      try {
        const response = await getAgencies();

        console.log("Agências:", response);

        setAgencies(response);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoadingAgencies(false);
      }
    }

    loadAgencies();
  }, []);
  function handleChange(e) {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "rg") {
      newValue = value.toUpperCase();
    }

    updateField(name, newValue);
  }

  return (
    <div className="step">
      <div className="step-header">
        <h2 className="step-title">
          {tipoConta === "PJ" ? "Dados do Responsável" : "Dados Pessoais"}
        </h2>

        <p className="step-description">Preencha as informações abaixo.</p>
      </div>

      <div className="form-grid">
        {tipoConta === "PJ" && (
          <>
            <CNPJInput
              label="CNPJ"
              value={values.cnpj || ""}
              onChange={(e) => updateField("cnpj", e.target.value)}
              error={errors.cnpj}
              required
            />

            <Input
              label="Razão Social"
              name="razaoSocial"
              value={values.razaoSocial || ""}
              onChange={handleChange}
              placeholder="Razão Social"
              error={errors.razaoSocial}
            />

            <Input
              label="Nome Fantasia"
              name="nomeFantasia"
              value={values.nomeFantasia || ""}
              onChange={handleChange}
              placeholder="Nome Fantasia"
            />

            <Input
              label="Inscrição Estadual"
              name="inscricaoEstadual"
              value={values.inscricaoEstadual || ""}
              onChange={handleChange}
              placeholder="Inscrição Estadual"
            />

            <Input
              label="Inscrição Municipal"
              name="inscricaoMunicipal"
              value={values.inscricaoMunicipal || ""}
              onChange={handleChange}
              placeholder="Inscrição Municipal"
            />

            <DateInput
              label="Data de Fundação"
              value={values.fundacao || ""}
              onChange={(e) => updateField("fundacao", e.target.value)}
            />
          </>
        )}
        <div className="input-group">
          <label className="input-label">Agência</label>

          <div className="input-wrapper">
            <select
              className="input"
              value={values.agencyId || ""}
              onChange={(e) => updateField("agencyId", e.target.value)}
            >
              <option value="">
                {loadingAgencies
                  ? "Carregando agências..."
                  : "Selecione uma agência"}
              </option>

              {agencies.map((agency) => (
                <option key={agency.agency_id} value={agency.agency_id}>
                  {agency.name}
                </option>
              ))}
            </select>
          </div>

          {errors.agencyId && (
            <small className="input-error">{errors.agencyId}</small>
          )}
        </div>
        <Input
          label="Nome Completo"
          name="nome"
          value={values.nome || ""}
          onChange={handleChange}
          placeholder="Nome Completo"
          error={errors.nome}
          required
        />

        <CPFInput
          label="CPF"
          value={values.cpf || ""}
          onChange={(e) => updateField("cpf", e.target.value)}
          error={errors.cpf}
          required
        />

        <DateInput
          label="Data de Nascimento"
          value={values.dataNascimento || ""}
          onChange={(e) => updateField("dataNascimento", e.target.value)}
          error={errors.dataNascimento}
          required
        />

        <Input
          label="RG"
          name="rg"
          value={values.rg || ""}
          onChange={handleChange}
          placeholder="RG"
          error={errors.rg}
        />

        <Input
          label="Nome da Mãe"
          name="mae"
          value={values.mae || ""}
          onChange={handleChange}
          placeholder="Nome da mãe"
          error={errors.mae}
        />

        <div className="input-group">
          <label className="input-label">Sexo</label>

          <div className="input-wrapper">
            <select
              className="input"
              name="sexo"
              value={values.sexo || ""}
              onChange={handleChange}
            >
              <option value="">Selecione</option>

              <option value="M">Masculino</option>

              <option value="F">Feminino</option>

              <option value="O">Outro</option>
            </select>
          </div>

          {errors.sexo && <small className="input-error">{errors.sexo}</small>}
        </div>
      </div>

      <div className="step-buttons">
        <button className="btn btn-secondary" onClick={back}>
          Voltar
        </button>

        <button className="btn btn-primary" onClick={next}>
          Continuar
        </button>
      </div>
    </div>
  );
}
