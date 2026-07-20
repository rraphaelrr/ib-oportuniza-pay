import React from "react";

import Input from "../../../components/Input";
import CNPJInput from "../../../components/CNPJInput";
import DateInput from "../../../components/DateInput";

import "./CadastroSteps.css";

export default function StepEmpresa({
  data = {},
  errors = {},
  onChange,
  next,
  back,
})  {
  return (
    <div className="step">
      <div className="step-header">
        <h2 className="step-title">Dados da Empresa</h2>

        <p className="step-description">
          Informe os dados cadastrais da empresa.
        </p>
      </div>

      <div className="form-grid">
        <Input
          className="full"
          label="Razão Social"
          name="razaoSocial"
          value={data.razaoSocial || ""}
          onChange={(e) => onChange("razaoSocial", e.target.value)}
          placeholder="Razão Social"
          error={errors.razaoSocial}
          required
        />

        <Input
          className="full"
          label="Nome Fantasia"
          name="nomeFantasia"
          value={data.nomeFantasia || ""}
          onChange={(e) => onChange("nomeFantasia", e.target.value)}
          placeholder="Nome Fantasia"
        />

        <CNPJInput
          label="CNPJ"
          required
          value={data.cnpj || ""}
          onChange={(e) => onChange("cnpj", e.target.value)}
          error={errors.cnpj}
        />

        <DateInput
          label="Data de Abertura"
          required
          value={data.dataAbertura || ""}
          onChange={(e) => onChange("dataAbertura", e.target.value)}
          error={errors.dataAbertura}
        />

        <Input
          className="full"
          label="Natureza Jurídica"
          value={data.naturezaJuridica || ""}
          onChange={(e) => onChange("naturezaJuridica", e.target.value)}
          placeholder="Ex.: Sociedade Empresária Limitada"
          error={errors.naturezaJuridica}
          required
        />

        <div className="input-group">
          <label className="input-label">
            Porte da Empresa
            <span className="required">*</span>
          </label>

          <div className="input-wrapper">
            <select
              className="input"
              value={data.porteEmpresa || ""}
              onChange={(e) => onChange("porteEmpresa", e.target.value)}
            >
              <option value="">Selecione</option>

              <option value="MEI">MEI</option>

              <option value="ME">Microempresa</option>

              <option value="EPP">Empresa de Pequeno Porte</option>

              <option value="MEDIA">Média Empresa</option>

              <option value="GRANDE">Grande Empresa</option>
            </select>
          </div>

          {errors.porteEmpresa && (
            <small className="input-error">{errors.porteEmpresa}</small>
          )}
        </div>

        <Input
          label="Faturamento Mensal"
          type="number"
          value={data.faturamento || ""}
          onChange={(e) => onChange("faturamento", e.target.value)}
          placeholder="0,00"
          error={errors.faturamento}
          required
        />

        <Input
          className="full"
          label="Atividade Principal (CNAE)"
          value={data.cnae || ""}
          onChange={(e) => onChange("cnae", e.target.value)}
          placeholder="Ex.: 6201-5/01"
        />

        <div className="input-group full">
          <label className="input-label">Objeto Social</label>

          <div className="input-wrapper">
            <textarea
              className="input"
              rows="5"
              value={data.objetoSocial || ""}
              onChange={(e) => onChange("objetoSocial", e.target.value)}
              placeholder="
              Descreva a atividade exercida pela empresa.
              "
            />
          </div>
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
