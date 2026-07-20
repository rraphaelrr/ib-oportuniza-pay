import React, { useState } from "react";

import {
  FaBell,
  FaMoon,
  FaSun,
  FaSearch,
  FaBars,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "./Topbar.css";

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();

  const [darkMode, setDarkMode] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  function toggleTheme() {
    document.body.classList.toggle("dark");

    setDarkMode(!darkMode);
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="menu-button"
          onClick={onMenuClick}
        >
          <FaBars />
        </button>

        <div className="search-box">
          <FaSearch />

          <input
            placeholder="Pesquisar..."
            type="text"
          />
        </div>
      </div>

      <div className="topbar-right">
        <button
          className="icon-button"
          title="Notificações"
        >
          <FaBell />

          <span className="notification-badge">
            3
          </span>
        </button>

        

        <div
          className="user-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="avatar">
            {user?.nome
              ? user.nome.charAt(0).toUpperCase()
              : <FaUserCircle />}
          </div>

          <div className="user-info">
            <strong>
              {user?.nome || "Usuário"}
            </strong>

            <span>Conta Digital</span>
          </div>

          <FaChevronDown
            className={
              menuOpen ? "rotate" : ""
            }
          />

          {menuOpen && (
            <div className="dropdown">
              <button>Meu Perfil</button>

              <button>Configurações</button>

              <button>Ajuda</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}