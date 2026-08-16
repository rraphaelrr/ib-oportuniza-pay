import React, { useState } from "react";

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
  FaReceipt,
  FaUsers,
  FaTriangleExclamation,
  FaMoneyBillTransfer,
  FaPlus,
  FaLayerGroup,
  FaChevronDown,
} from "react-icons/fa6";

import { useLocation, useNavigate } from "react-router-dom";

import "./Sidebar.css";
import { useAuth } from "../context/AuthContext";
import Produtos from "../components/Produtos";

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onClose,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout } = useAuth();

  const [boletosOpen, setBoletosOpen] = useState(
    location.pathname.startsWith("/boletos")
  );

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
      title: "COBRANÇA",
      show: Produtos.boleto,

      items: [
        {
          label: "Boletos",
          icon: <FaReceipt />,
          path: "/boletos",
          show: true,

          submenu: [
            {
              label: "Visão geral",
              icon: <FaChartLine />,
              path: "/boletos",
            },
            {
              label: "Todos os boletos",
              icon: <FaReceipt />,
              path: "/boletos/lista",
            },
            {
              label: "Gerar boleto",
              icon: <FaPlus />,
              path: "/boletos/gerar",
            },
            {
              label: "Gerar em lote",
              icon: <FaLayerGroup />,
              path: "/boletos/gerar-lote",
            },
            {
              label: "Clientes",
              icon: <FaUsers />,
              path: "/boletos/clientes",
            },
            {
              label: "Inadimplência",
              icon: <FaTriangleExclamation />,
              path: "/boletos/inadimplencia",
            },
            {
              label: "Pagamentos",
              icon: <FaMoneyBillTransfer />,
              path: "/boletos/pagamentos",
            },
          ],
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

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isBoletosActive =
    location.pathname.startsWith("/boletos");

  function handleBoletosClick() {
    if (collapsed) {
      navigate("/boletos");
      onClose?.();
      return;
    }

    setBoletosOpen((current) => !current);
  }

  function handleNavigation(path) {
    navigate(path);
    onClose?.();
  }

  function handleSubmenuClick(path) {
    navigate(path);
    onClose?.();
  }

  function handleLogout() {
    logout();
    onClose?.();
  }

  return (
    <>
      {/* OVERLAY MOBILE */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          sidebar
          ${collapsed ? "collapsed" : ""}
          ${mobileOpen ? "mobile-open" : ""}
        `}
      >
        {/* =========================
            LOGO
        ========================= */}

        <div className="sidebar-logo">
          <strong>
            Oportuni<span>ZA</span>
          </strong>

          {!collapsed && <small>PAY</small>}
        </div>

        {/* =========================
            MENU
        ========================= */}

        <nav>
          {menus
            .filter((group) => group.show !== false)
            .map((group, index) => (
              <div
                className="menu-group"
                key={index}
              >
                {!collapsed && (
                  <h4>{group.title}</h4>
                )}

                {group.items
                  .filter(
                    (item) =>
                      item.show !== false
                  )
                  .map((item, i) => {
                    const hasSubmenu =
                      Array.isArray(
                        item.submenu
                      ) &&
                      item.submenu.length > 0;

                    const active = hasSubmenu
                      ? isBoletosActive
                      : isActive(item.path);

                    return (
                      <React.Fragment
                        key={i}
                      >
                        <button
                          type="button"
                          className={
                            active
                              ? "active"
                              : ""
                          }
                          onClick={() => {
                            if (hasSubmenu) {
                              handleBoletosClick();
                              return;
                            }

                            handleNavigation(
                              item.path
                            );
                          }}
                          title={
                            collapsed
                              ? item.label
                              : undefined
                          }
                        >
                          <span className="menu-icon">
                            {item.icon}
                          </span>

                          {!collapsed && (
                            <>
                              <span className="menu-label">
                                {item.label}
                              </span>

                              {hasSubmenu && (
                                <FaChevronDown
                                  className={`
                                    submenu-chevron
                                    ${
                                      boletosOpen
                                        ? "open"
                                        : ""
                                    }
                                  `}
                                />
                              )}
                            </>
                          )}
                        </button>

                        {/* SUBMENU */}

                        {hasSubmenu &&
                          !collapsed &&
                          boletosOpen && (
                            <div className="sidebar-submenu">
                              {item.submenu.map(
                                (subItem) => {
                                  const subActive =
                                    isActive(
                                      subItem.path
                                    );

                                  return (
                                    <button
                                      type="button"
                                      key={
                                        subItem.path
                                      }
                                      className={
                                        subActive
                                          ? "submenu-active"
                                          : ""
                                      }
                                      onClick={() =>
                                        handleSubmenuClick(
                                          subItem.path
                                        )
                                      }
                                    >
                                      <span className="submenu-icon">
                                        {
                                          subItem.icon
                                        }
                                      </span>

                                      <span>
                                        {
                                          subItem.label
                                        }
                                      </span>
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          )}
                      </React.Fragment>
                    );
                  })}
              </div>
            ))}
        </nav>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="sidebar-footer">
          <button
            type="button"
            onClick={() =>
              handleNavigation(
                "/configuracoes"
              )
            }
          >
            <FaGear />

            {!collapsed && (
              <span>
                Configurações
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleLogout}
          >
            <FaArrowRightFromBracket />

            {!collapsed && (
              <span>Sair</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}