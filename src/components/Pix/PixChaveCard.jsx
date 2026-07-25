import React from "react";
import {
  Copy,
  CheckCircle2,
  Phone,
  Mail,
  Hash,
  CreditCard,
} from "lucide-react";

import "../../pages/Pix/Pix.css";

const ICONS = {
  cpf: CreditCard,
  cnpj: CreditCard,
  telefone: Phone,
  email: Mail,
  aleatoria: Hash,
};

export default function PixChaveCard({
  chave,
  tipo,
  principal = false,
  onCopy,
}) {
  const Icon =
    ICONS[tipo?.toLowerCase()] || Hash;

  const copiar = () => {
    navigator.clipboard.writeText(chave);

    onCopy?.(chave);
  };

  return (
    <div className="pix-chave-card">

      <div className="pix-chave-icon">
        <Icon size={22} />
      </div>

      <div className="pix-chave-info">

        <strong>
          {tipo?.charAt(0).toUpperCase() +
            tipo?.slice(1)}
        </strong>

        <span>{chave}</span>

        {principal && (
          <small className="pix-chave-principal">
            <CheckCircle2
              size={15}
              color="#0aa84f"
            />
            Chave Principal
          </small>
        )}
      </div>

      <button
        className="pix-copy-button"
        onClick={copiar}
      >
        <Copy size={18} />
      </button>

    </div>
  );
}