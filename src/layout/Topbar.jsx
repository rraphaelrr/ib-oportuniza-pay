import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";

import {
  FaBell,
  FaSearch,
  FaBars,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Topbar.css";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();

  const { user } = useAuth();

  const menuRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [focused, setFocused] = useState(false);

  const routes = [
    {
      title: "Dashboard",
      keywords: ["home", "inicio", "dashboard"],
      path: "/home",
    },
    {
      title: "PIX",
      keywords: ["pix", "transferencia", "pagamento"],
      path: "/pix",
    },
    {
      title: "Extrato",
      keywords: ["extrato", "movimentações", "historico"],
      path: "/extrato",
    },
    {
      title: "Cartões",
      keywords: ["cartão", "credito", "debito"],
      path: "/cartoes",
    },
    {
      title: "Perfil",
      keywords: ["perfil", "usuario", "dados"],
      path: "/perfil",
    },
    {
      title: "Configurações",
      keywords: ["config", "configurações", "ajustes"],
      path: "/configuracoes",
    },
    {
      title: "Cadastro",
      keywords: ["abrir conta", "cadastro", "nova conta"],
      path: "/cadastro",
    },
  ];

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];

    const value = search.toLowerCase();

    return routes.filter((item) => {
      return (
        item.title.toLowerCase().includes(value) ||
        item.keywords.some((k) => k.includes(value))
      );
    });
  }, [search]);

  useEffect(() => {
    function close(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setFocused(false);
      }
    }

    document.addEventListener("click", close);

    return () =>
      document.removeEventListener("click", close);
  }, []);

  function go(item) {
    navigate(item.path);

    setSearch("");

    setFocused(false);
  }

  function handleKey(e) {
    if (e.key === "Enter" && suggestions.length) {
      go(suggestions[0]);
    }
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

        <div
          className="search-wrapper"
          ref={menuRef}
        >
          <div className="search-box">
            <FaSearch />

            <input
              value={search}
              placeholder="Pesquisar telas..."
              onFocus={() => setFocused(true)}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={handleKey}
            />
          </div>

          {focused && suggestions.length > 0 && (
            <div className="search-dropdown">
              {suggestions.map((item) => (
                <button
                  key={item.path}
                  className="search-item"
                  onClick={() => go(item)}
                >
                  <strong>{item.title}</strong>

                  <small>{item.path}</small>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-button">
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
              ? user.nome[0].toUpperCase()
              : <FaUserCircle />}
          </div>

          <div className="user-info">
            <strong>
              {user?.nome || "Usuário"}
            </strong>

            <span>Conta Digital</span>
          </div>

          <FaChevronDown
            className={menuOpen ? "rotate" : ""}
          />

          {menuOpen && (
            <div className="dropdown">
              <button
                onClick={() => navigate("/perfil")}
              >
                Meu Perfil
              </button>

              <button
                onClick={() =>
                  navigate("/configuracoes")
                }
              >
                Configurações
              </button>

              <button>Ajuda</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}