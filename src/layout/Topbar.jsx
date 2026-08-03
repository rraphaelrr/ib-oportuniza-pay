import React from "react";
import { useLocation } from "react-router-dom";

import { FaMagnifyingGlass, FaBell } from "react-icons/fa6";

import "./Topbar.css";

export default function Topbar() {
  const location = useLocation();

  const { user } = JSON.parse(localStorage.getItem("user"));

  const pageTitles = {
    "/home": "Início",
    "/pix": "Pix",
    "/transferencias": "Transferências",
    "/extrato": "Extrato",
    "/cartoes": "Cartões",
    "/investimentos": "Investimentos",
    "/configuracoes": "Configurações",
    "/perfil": "Perfil",
  };

  const pageTitle = pageTitles[location.pathname] || "Painel";

  const getInitials = (value = "") => {
    const name = value
      .split("@")[0]
      .replace(/[._-]/g, " ");

    const parts = name.split(" ").filter(Boolean);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <header className="topbar">
      <div>
        <h1>{pageTitle}</h1>

        <p>Bem-vindo de volta, {user.name}</p>
      </div>

      <div className="topbar-actions">
        {/* <button>
          <FaMagnifyingGlass />
        </button>

        <button className="notification">
          <FaBell />
        </button> */}

        <div className="profile">
          <div className="avatar">{getInitials(user.name)}</div>

          <div>
            <strong>{user.name}</strong>
          </div>
        </div>
      </div>
    </header>
  );
}