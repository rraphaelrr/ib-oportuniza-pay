// src/components/pix/PixTabs.jsx

import React from "react";
import { SendHorizontal, QrCode } from "lucide-react";

export default function PixTabs({ active, onChange }) {
  return (
    <div className="pix-tabs">
      <button
        type="button"
        className={`pix-tab ${active === "ENVIAR" ? "active" : ""}`}
        onClick={() => onChange("ENVIAR")}
      >
        <SendHorizontal size={18} />
        <span>Enviar Pix</span>
      </button>

      <button
        type="button"
        className={`pix-tab ${active === "RECEBER" ? "active" : ""}`}
        onClick={() => onChange("RECEBER")}
      >
        <QrCode size={18} />
        <span>Receber Pix</span>
      </button>
    </div>
  );
}