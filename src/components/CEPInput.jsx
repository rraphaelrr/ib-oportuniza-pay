import React, { useState } from "react";
import InputMask from "react-input-mask";
import { FaSearchLocation } from "react-icons/fa";
import "./CEPInput.css";

export default function CEPInput({
  value,
  onChange,
  onAddressFound,
  label = "CEP",
  required = false,
  error,
}) {
  const [loading, setLoading] = useState(false);

  async function buscarCEP(cep) {
    const onlyNumbers = cep.replace(/\D/g, "");

    if (onlyNumbers.length !== 8) return;

    try {
      setLoading(true);

      const response = await fetch(
        `https://viacep.com.br/ws/${onlyNumbers}/json/`
      );

      const data = await response.json();

      if (data.erro) return;

      onAddressFound &&
        onAddressFound({
          cep: data.cep,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cep-group">
      <label className="cep-label">
        {label}

        {required && (
          <span className="required">*</span>
        )}
      </label>

      <div className={`cep-wrapper ${error ? "error" : ""}`}>
        <InputMask
          mask="99999-999"
          maskChar=""
          value={value}
          onChange={(e) => {
            onChange(e);
            buscarCEP(e.target.value);
          }}
        >
          {(inputProps) => (
            <input
              {...inputProps}
              className="cep-input"
              placeholder="00000-000"
            />
          )}
        </InputMask>

        <div className="cep-icon">
          {loading ? (
            <div className="cep-loader" />
          ) : (
            <FaSearchLocation />
          )}
        </div>
      </div>

      {error && (
        <small className="cep-error">
          {error}
        </small>
      )}
    </div>
  );
}