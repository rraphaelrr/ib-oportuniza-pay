import React from "react";

export default function StepEmpresa({
  data,
  errors,
  onChange,
}) {
  function formatCNPJ(value) {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  }

  return (
    <div className="cadastro-step">

      <h2>Dados da Empresa</h2>

      <p className="step-description">
        Informe os dados cadastrais da empresa.
      </p>

      <div className="cadastro-grid">

        <div className="input-group full">
          <label>Razão Social *</label>

          <input
            type="text"
            value={data.razaoSocial}
            onChange={(e) =>
              onChange("razaoSocial", e.target.value)
            }
            placeholder="Razão Social"
          />

          {errors.razaoSocial && (
            <small>{errors.razaoSocial}</small>
          )}
        </div>

        <div className="input-group full">
          <label>Nome Fantasia</label>

          <input
            type="text"
            value={data.nomeFantasia}
            onChange={(e) =>
              onChange("nomeFantasia", e.target.value)
            }
            placeholder="Nome Fantasia"
          />
        </div>

        <div className="input-group">
          <label>CNPJ *</label>

          <input
            value={data.cnpj}
            onChange={(e) =>
              onChange(
                "cnpj",
                formatCNPJ(e.target.value)
              )
            }
            placeholder="00.000.000/0000-00"
          />

          {errors.cnpj && (
            <small>{errors.cnpj}</small>
          )}
        </div>

        <div className="input-group">
          <label>Data de Abertura *</label>

          <input
            type="date"
            value={data.dataAbertura}
            onChange={(e) =>
              onChange(
                "dataAbertura",
                e.target.value
              )
            }
          />

          {errors.dataAbertura && (
            <small>{errors.dataAbertura}</small>
          )}
        </div>

        <div className="input-group full">
          <label>Natureza Jurídica *</label>

          <input
            type="text"
            value={data.naturezaJuridica}
            onChange={(e) =>
              onChange(
                "naturezaJuridica",
                e.target.value
              )
            }
            placeholder="Ex.: Sociedade Empresária Limitada"
          />

          {errors.naturezaJuridica && (
            <small>{errors.naturezaJuridica}</small>
          )}
        </div>

        <div className="input-group">
          <label>Porte da Empresa *</label>

          <select
            value={data.porteEmpresa}
            onChange={(e) =>
              onChange(
                "porteEmpresa",
                e.target.value
              )
            }
          >
            <option value="">
              Selecione
            </option>

            <option value="MEI">
              MEI
            </option>

            <option value="ME">
              Microempresa
            </option>

            <option value="EPP">
              Empresa de Pequeno Porte
            </option>

            <option value="MEDIA">
              Média Empresa
            </option>

            <option value="GRANDE">
              Grande Empresa
            </option>
          </select>

          {errors.porteEmpresa && (
            <small>{errors.porteEmpresa}</small>
          )}
        </div>

        <div className="input-group">
          <label>Faturamento Mensal *</label>

          <input
            type="number"
            value={data.faturamento}
            onChange={(e) =>
              onChange(
                "faturamento",
                e.target.value
              )
            }
            placeholder="0,00"
          />

          {errors.faturamento && (
            <small>{errors.faturamento}</small>
          )}
        </div>

        <div className="input-group full">
          <label>Atividade Principal (CNAE)</label>

          <input
            type="text"
            value={data.cnae}
            onChange={(e) =>
              onChange("cnae", e.target.value)
            }
            placeholder="Ex.: 6201-5/01"
          />
        </div>

        <div className="input-group full">
          <label>Objeto Social</label>

          <textarea
            rows={4}
            value={data.objetoSocial}
            onChange={(e) =>
              onChange(
                "objetoSocial",
                e.target.value
              )
            }
            placeholder="Descreva a atividade exercida pela empresa."
          />
        </div>

      </div>

    </div>
  );
}