import React, { useEffect } from "react";

import { FaMagnifyingGlass, FaBell } from "react-icons/fa6";

import "./Topbar.css";

export default function Topbar() {
  const { user } = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("user")));
  });

  const getInitials = (value = "") => {
    const name = value
      .split("@")[0] // remove domínio do email
      .replace(/[._-]/g, " "); // troca pontos, underline e hífen por espaço

    const parts = name.split(" ").filter(Boolean);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
  };
  return (
    <header className="topbar">
      <div>
        <h1>Início</h1>

        <p>Bem-vindo de volta, {user.name}</p>
      </div>

      <div className="topbar-actions">
        <button>
          <FaMagnifyingGlass />
        </button>

        <button className="notification">
          <FaBell />
        </button>

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
