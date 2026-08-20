import React from "react";
import { useLocation } from "react-router-dom";

import { FaBars } from "react-icons/fa6";

import "./Topbar.css";

export default function Topbar({ onMenuClick }) {
  const location = useLocation();

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const user = storedUser?.user || storedUser || {};

  // =========================================================
  // TÍTULOS DAS PÁGINAS
  // =========================================================

  const pageTitles = {
    "/home": "Início",
    "/pix": "Pix",
    "/transferencias": "Transferências",
    "/extrato": "Extrato",
    "/cartoes": "Cartões",
    "/investimentos": "Investimentos",
    "/configuracoes": "Configurações",
    "/perfil": "Perfil",

    // =======================================================
    // ANTECIPAÇÃO DE RECEBÍVEIS
    // =======================================================

    "/antecipacao": "Antecipação de Recebíveis",
    "/antecipacao/simulacao": "Simulação",
    "/antecipacao/solicitar": "Solicitar Antecipação",
    "/antecipacao/recebiveis": "Recebíveis",
    "/antecipacao/documentos": "Documentos",
    "/antecipacao/revisao": "Revisão",
    "/antecipacao/ofertas": "Ofertas",
  };

  // =========================================================
  // TÍTULO DA PÁGINA
  // =========================================================

  const pageTitle =
    pageTitles[location.pathname] || "Painel";

  // =========================================================
  // NOME DO USUÁRIO
  // =========================================================

  const userName =
    user?.name ||
    user?.full_name ||
    user?.nome ||
    "Usuário";

  // =========================================================
  // INICIAIS
  // =========================================================

  const getInitials = (value = "") => {
    const name = String(value)
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .trim();

    const parts = name
      .split(/\s+/)
      .filter(Boolean);

    if (!parts.length) {
      return "?";
    }

    if (parts.length === 1) {
      return parts[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      parts[0][0] +
      parts[1][0]
    ).toUpperCase();
  };

  return (
    <header className="topbar">

      {/* =====================================================
          ESQUERDA
      ===================================================== */}

      <div className="topbar-left">

        {/* BOTÃO MOBILE */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <FaBars />
        </button>

        <div className="topbar-info">

          <h1>
            {pageTitle}
          </h1>

          <p>
            Bem-vindo de volta, {userName}
          </p>

        </div>

      </div>

      {/* =====================================================
          PERFIL
      ===================================================== */}

      <div className="topbar-actions">

        <div className="profile">

          <div className="avatar">
            {getInitials(userName)}
          </div>

          <div className="profile-info">

            <strong>
              {userName}
            </strong>

          </div>

        </div>

      </div>

    </header>
  );
}