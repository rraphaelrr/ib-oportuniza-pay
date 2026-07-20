import React from "react";
import "./CadastroSteps.css";

export default function StepDadosPessoais({
  tipoConta,
  form,
  setForm,
  errors = {},
  onNext,
  onBack,
}) {
  function handleChange(e) {
    const { name, value } = e.target;

    let newValue = value;

    switch (name) {
      case "cpf":
        newValue = formatCPF(value);
        break;

      case "cnpj":
        newValue = formatCNPJ(value);
        break;

      case "dataNascimento":
        newValue = formatDate(value);
        break;

      case "rg":
        newValue = value.toUpperCase();
        break;

      default:
        break;
    }

    setForm((old) => ({
      ...old,
      [name]: newValue,
    }));
  }

  return (
    <div className="step-container">

      <div className="step-header">
        <h2>
          {tipoConta === "PF"
            ? "Dados Pessoais"
            : "Dados da Empresa"}
        </h2>

        <p>
          Preencha as informações abaixo.
        </p>
      </div>

      <div className="form-grid">

        {tipoConta === "PJ" && (
          <>
            <div className="input-group">
              <label>CNPJ</label>

              <input
                name="cnpj"
                value={form.cnpj || ""}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
                maxLength={18}
              />

              <span>{errors.cnpj}</span>
            </div>

            <div className="input-group">
              <label>Razão Social</label>

              <input
                name="razaoSocial"
                value={form.razaoSocial || ""}
                onChange={handleChange}
                placeholder="Razão Social"
              />

              <span>{errors.razaoSocial}</span>
            </div>

            <div className="input-group">
              <label>Nome Fantasia</label>

              <input
                name="nomeFantasia"
                value={form.nomeFantasia || ""}
                onChange={handleChange}
                placeholder="Nome Fantasia"
              />
            </div>

            <div className="input-group">
              <label>Inscrição Estadual</label>

              <input
                name="ie"
                value={form.ie || ""}
                onChange={handleChange}
                placeholder="Inscrição Estadual"
              />
            </div>

            <div className="input-group">
              <label>Inscrição Municipal</label>

              <input
                name="im"
                value={form.im || ""}
                onChange={handleChange}
                placeholder="Inscrição Municipal"
              />
            </div>

            <div className="input-group">
              <label>Data de Fundação</label>

              <input
                name="fundacao"
                value={form.fundacao || ""}
                onChange={handleChange}
                placeholder="dd/mm/aaaa"
                maxLength={10}
              />
            </div>
          </>
        )}

        <div className="input-group">
          <label>Nome Completo</label>

          <input
            name="nome"
            value={form.nome || ""}
            onChange={handleChange}
            placeholder="Nome Completo"
          />

          <span>{errors.nome}</span>
        </div>

        <div className="input-group">
          <label>CPF</label>

          <input
            name="cpf"
            value={form.cpf || ""}
            onChange={handleChange}
            placeholder="000.000.000-00"
            maxLength={14}
          />

          <span>{errors.cpf}</span>
        </div>

        <div className="input-group">
          <label>Data de Nascimento</label>

          <input
            name="dataNascimento"
            value={form.dataNascimento || ""}
            onChange={handleChange}
            placeholder="dd/mm/aaaa"
            maxLength={10}
          />

          <span>{errors.dataNascimento}</span>
        </div>

        <div className="input-group">
          <label>RG</label>

          <input
            name="rg"
            value={form.rg || ""}
            onChange={handleChange}
            placeholder="RG"
          />

          <span>{errors.rg}</span>
        </div>

        <div className="input-group">
          <label>Nome da Mãe</label>

          <input
            name="mae"
            value={form.mae || ""}
            onChange={handleChange}
            placeholder="Nome da mãe"
          />

          <span>{errors.mae}</span>
        </div>

        <div className="input-group">
          <label>Sexo</label>

          <select
            name="sexo"
            value={form.sexo || ""}
            onChange={handleChange}
          >
            <option value="">
              Selecione
            </option>

            <option value="M">
              Masculino
            </option>

            <option value="F">
              Feminino
            </option>

            <option value="O">
              Outro
            </option>
          </select>

          <span>{errors.sexo}</span>
        </div>

      </div>

      <div className="step-buttons">

        <button
          className="btn-outline"
          onClick={onBack}
        >
          Voltar
        </button>

        <button
          className="btn-primary"
          onClick={onNext}
        >
          Continuar
        </button>

      </div>

    </div>
  );
}

/* =======================
   Máscaras
======================= */

function formatCPF(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .substring(0, 14);
}

function formatCNPJ(value) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18);
}

function formatDate(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3")
    .substring(0, 10);
}