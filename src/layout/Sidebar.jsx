import React from "react";

import {
  FaHouse,
  FaPix,
  FaArrowRightArrowLeft,
  FaCreditCard,
  FaDollarSign,
  FaClock,
  FaChartLine,
  FaGear,
  FaWallet,
  FaArrowRightFromBracket,
} from "react-icons/fa6";

import { useNavigate } from "react-router-dom";

import "./Sidebar.css";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const menus = [
    {
      title: "PRINCIPAL",
      show: true,
      items: [
        {
          label: "Início",
          icon: <FaHouse />,
          path: "/home",
          show: true,
        },
        {
          label: "Pix",
          icon: <FaPix />,
          path: "/pix",
          show: true,
        },
        {
          label: "Extrato",
          icon: <FaWallet />,
          path: "/extrato",
          show: true,
        },
        {
          label: "Transferências",
          icon: <FaArrowRightArrowLeft />,
          path: "/transferencias",
          show: false,
        },
        {
          label: "Cartões",
          icon: <FaCreditCard />,
          path: "/cartoes",
          show: false,
        },
      ],
    },

    {
      title: "CRÉDITO & ATIVOS",
      show: false,
      items: [
        {
          label: "Antecipação",
          icon: <FaDollarSign />,
          path: "/antecipacao",
          show: false,
        },
        {
          label: "Consórcio",
          icon: <FaClock />,
          path: "/consorcio",
          show: false,
        },
        {
          label: "Investimentos",
          icon: <FaChartLine />,
          path: "/investimentos",
          show: false,
        },
      ],
    },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo">
        <strong>
          Oportuni<span>ZA</span>
        </strong>

        <small>PAY</small>
      </div>

      <nav>
        {menus
          .filter((item) => item.show !== false)
          .map((group, index) => (
            <div className="menu-group" key={index}>
              <h4>{group.title}</h4>

              {group.items
                .filter((item) => item.show !== false)
                .map((item, i) => (
                  <button
                    key={i}
                    className={
                      item.path === window.location.pathname ? "active" : ""
                    }
                    onClick={() => navigate(item.path)}
                  >
                    <span className="menu-icon">{item.icon}</span>

                    {!collapsed && <span>{item.label}</span>}
                  </button>
                ))}
            </div>
          ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => navigate("/configuracoes")}>
          <FaGear />

          {!collapsed && <span>Configurações</span>}
        </button>

        <button onClick={logout}>
          <FaArrowRightFromBracket />

          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
