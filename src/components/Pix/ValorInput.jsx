import React from "react";
import { CircleDollarSign } from "lucide-react";

import "../../pages/Pix/Pix.css";

function formatar(valor) {
  const numero = valor.replace(/\D/g, "");

  const convertido = (Number(numero) / 100).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );

  return convertido;
}

export default function ValorInput({
  value,
  onChange,
  placeholder = "R$ 0,00",
  disabled = false,
}) {
  const handleChange = (e) => {
    const apenasNumeros = e.target.value.replace(/\D/g, "");

    onChange(formatar(apenasNumeros));
  };

  return (
    <div className="pix-input-wrapper">
      <div className="pix-input-icon">
        <CircleDollarSign size={20} />

        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}