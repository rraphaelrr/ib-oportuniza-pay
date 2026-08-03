import React from "react";
import { DollarSign } from "lucide-react";

export default function ValorInput({
  value,
  onChange,
  label = "Valor",
  placeholder = "0,00",
  disabled = false,
}) {

  function formatarValor(valor) {

    const somenteNumeros = valor
      .replace(/\D/g, "");

    if (!somenteNumeros) {
      return "";
    }

    const numero = Number(somenteNumeros) / 100;

    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  }


  function handleChange(e) {

    const formatado = formatarValor(
      e.target.value
    );

    onChange(formatado);

  }


  return (
    <div className="pix-field">

      <label>
        {label}
      </label>


      <div className="pix-input">

        <DollarSign size={18}/>


        <input
          type="text"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={handleChange}
        />


      </div>

    </div>
  );
}