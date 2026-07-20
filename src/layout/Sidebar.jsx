import React from "react";
import {
  FaHome,
  FaMoneyCheckAlt,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Sidebar.css";
import logo from "../assets/privateAssets/logo.png";

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();

  const location = useLocation();

  const { logout } = useAuth();

  const menu = [
    {
      title: "Dashboard",
      icon: <FaHome />,
      path: "/home",
    },
    {
      title: "PIX",
      icon: <FaMoneyCheckAlt />,
      path: "/pix",
    },
    {
      title: "Extrato",
      icon: <FaFileInvoiceDollar />,
      path: "/extrato",
    },
    {
      title: "Cartões",
      icon: <FaCreditCard />,
      path: "/cartoes",
    },
    {
      title: "Perfil",
      icon: <FaUserCircle />,
      path: "/perfil",
    },
    {
      title: "Configurações",
      icon: <FaCog />,
      path: "/configuracoes",
    },
  ];

  function handleLogout() {
    logout();
    navigate("/login", {
      replace: true,
    });
  }

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" width={200}/>
      </div>

      <nav className="sidebar-menu">
        {menu.map((item) => (
          <button
            key={item.path}
            className={`sidebar-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="icon">{item.icon}</span>

            {!collapsed && <span>{item.title}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-item logout" onClick={handleLogout}>
          <span className="icon">
            <FaSignOutAlt />
          </span>

          {!collapsed && <span>Sair</span>}
        </button>

        <button className="collapse-button" onClick={onToggle}>
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
    </aside>
  );
}
