import React from "react";
import {
  Mail,
  Phone,
  Hash,
  CreditCard,
  Building2,
} from "lucide-react";

import "../../pages/Pix/Pix.css";

const detectarTipo = (valor = "") => {
  const texto = valor.replace(/\s/g, "");

  if (!texto) return null;

  // Email
  if (texto.includes("@")) return "email";

  // Telefone
  const telefone = texto.replace(/\D/g, "");
  if (telefone.length >= 10 && telefone.length <= 13) {
    return "telefone";
  }

  // CPF
  const cpf = texto.replace(/\D/g, "");
  if (cpf.length === 11) {
    return "cpf";
  }

  // CNPJ
  if (cpf.length === 14) {
    return "cnpj";
  }

  return "aleatoria";
};

const ICONS = {
  cpf: CreditCard,
  cnpj: Building2,
  telefone: Phone,
  email: Mail,
  aleatoria: Hash,
};

const PLACEHOLDERS = {
  cpf: "CPF",
  cnpj: "CNPJ",
  telefone: "Telefone",
  email: "E-mail",
  aleatoria: "Chave Aleatória",
};

export default function ChaveInput({
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  const tipo = detectarTipo(value);
  const Icon = ICONS[tipo] || Hash;

  return (
    <div className="pix-input-wrapper">
      <div className="pix-input-icon">
        <Icon size={20} />

        <input
          type="text"
          value={value}
          disabled={disabled}
          autoComplete="off"
          placeholder={
            placeholder ||
            "CPF, CNPJ, E-mail, Telefone ou Chave Aleatória"
          }
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {tipo && (
        <small className="pix-input-helper">
          Tipo detectado: <strong>{PLACEHOLDERS[tipo]}</strong>
        </small>
      )}
    </div>
  );
}