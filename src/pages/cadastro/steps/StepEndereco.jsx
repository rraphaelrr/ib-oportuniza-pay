import React from "react";

export default function StepEndereco({
  data,
  errors,
  onChange,
  onBuscarCEP,
  loadingCep,
}) {
  function handleCEP(value) {
    let cep = value.replace(/\D/g, "");

    if (cep.length > 8) cep = cep.slice(0, 8);

    if (cep.length > 5) {
      cep = cep.replace(/^(\d{5})(\d)/, "$1-$2");
    }

    onChange("cep", cep);

    if (cep.replace(/\D/g, "").length === 8) {
      onBuscarCEP(cep.replace(/\D/g, ""));
    }
  }

  return (
    <div className="cadastro-step">

      <h2>Endereço</h2>

      <div className="cadastro-grid">

        <div className="input-group">
          <label>CEP *</label>

          <div className="cep-field">

            <input
              value={data.cep}
              onChange={(e) => handleCEP(e.target.value)}
              placeholder="00000-000"
            />

            <button
              type="button"
              onClick={() =>
                onBuscarCEP(
                  data.cep.replace(/\D/g, "")
                )
              }
            >
              {loadingCep ? "..." : "Buscar"}
            </button>

          </div>

          {errors.cep && (
            <small>{errors.cep}</small>
          )}
        </div>

        <div className="input-group">
          <label>Rua *</label>

          <input
            value={data.rua}
            onChange={(e) =>
              onChange("rua", e.target.value)
            }
          />

          {errors.rua && (
            <small>{errors.rua}</small>
          )}
        </div>

        <div className="input-group">
          <label>Número *</label>

          <input
            value={data.numero}
            onChange={(e) =>
              onChange("numero", e.target.value)
            }
          />

          {errors.numero && (
            <small>{errors.numero}</small>
          )}
        </div>

        <div className="input-group">
          <label>Complemento</label>

          <input
            value={data.complemento}
            onChange={(e) =>
              onChange(
                "complemento",
                e.target.value
              )
            }
          />
        </div>

        <div className="input-group">
          <label>Bairro *</label>

          <input
            value={data.bairro}
            onChange={(e) =>
              onChange("bairro", e.target.value)
            }
          />

          {errors.bairro && (
            <small>{errors.bairro}</small>
          )}
        </div>

        <div className="input-group">
          <label>Cidade *</label>

          <input
            value={data.cidade}
            onChange={(e) =>
              onChange("cidade", e.target.value)
            }
          />

          {errors.cidade && (
            <small>{errors.cidade}</small>
          )}
        </div>

        <div className="input-group">
          <label>Estado *</label>

          <input
            value={data.estado}
            maxLength={2}
            onChange={(e) =>
              onChange(
                "estado",
                e.target.value.toUpperCase()
              )
            }
          />

          {errors.estado && (
            <small>{errors.estado}</small>
          )}
        </div>

      </div>

    </div>
  );
}