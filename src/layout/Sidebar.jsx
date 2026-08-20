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
  FaCalculator,
  FaFileInvoiceDollar,
  FaFileLines,
  FaListCheck,
  FaHandHoldingDollar,
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

  // =========================================================
  // ESTADOS DOS SUBMENUS
  // =========================================================

  const [boletosOpen, setBoletosOpen] = useState(
    location.pathname.startsWith("/boletos")
  );

  const [antecipacaoOpen, setAntecipacaoOpen] =
    useState(
      location.pathname.startsWith("/antecipacao")
    );

  // =========================================================
  // MENUS
  // =========================================================

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

    // =======================================================
    // COBRANÇA
    // =======================================================

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

    // =======================================================
    // CRÉDITO & ATIVOS
    // =======================================================

    {
      title: "CRÉDITO & ATIVOS",

      // Temporariamente habilitado.
      // Depois podemos controlar por Produtos.antecipacao.
      show: true,

      items: [
        {
          label: "Antecipação",
          icon: <FaDollarSign />,
          path: "/antecipacao",
          show: true,

          submenu: [
            {
              label: "Visão geral",
              icon: <FaChartLine />,
              path: "/antecipacao",
            },
            {
              label: "Simular",
              icon: <FaCalculator />,
              path: "/antecipacao/simulacao",
            },
            {
              label: "Solicitar antecipação",
              icon: <FaHandHoldingDollar />,
              path: "/antecipacao/solicitar",
            },
            {
              label: "Recebíveis",
              icon: <FaFileInvoiceDollar />,
              path: "/antecipacao/recebiveis",
            },
            {
              label: "Documentos",
              icon: <FaFileLines />,
              path: "/antecipacao/documentos",
            },
            {
              label: "Revisão",
              icon: <FaListCheck />,
              path: "/antecipacao/revisao",
            },
            {
              label: "Ofertas",
              icon: <FaDollarSign />,
              path: "/antecipacao/ofertas",
            },
          ],
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

  // =========================================================
  // ACTIVE
  // =========================================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isBoletosActive =
    location.pathname.startsWith("/boletos");

  const isAntecipacaoActive =
    location.pathname.startsWith("/antecipacao");

  // =========================================================
  // BOLETOS
  // =========================================================

  function handleBoletosClick() {
    if (collapsed) {
      navigate("/boletos");
      onClose?.();
      return;
    }

    setBoletosOpen((current) => !current);
  }

  // =========================================================
  // ANTECIPAÇÃO
  // =========================================================

  function handleAntecipacaoClick() {
    if (collapsed) {
      navigate("/antecipacao");
      onClose?.();
      return;
    }

    setAntecipacaoOpen((current) => !current);
  }

  // =========================================================
  // NAVEGAÇÃO
  // =========================================================

  function handleNavigation(path) {
    navigate(path);
    onClose?.();
  }

  function handleSubmenuClick(path) {
    navigate(path);
    onClose?.();
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  function handleLogout() {
    logout();
    onClose?.();
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      {/* =====================================================
          OVERLAY MOBILE
      ===================================================== */}

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
        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="sidebar-logo">
          <strong>
            Oportuni<span>ZA</span>
          </strong>

          {!collapsed && <small>PAY</small>}
        </div>

        {/* ===================================================
            MENU
        =================================================== */}

        <nav>
          {menus
            .filter(
              (group) => group.show !== false
            )
            .map((group, index) => (
              <div
                className="menu-group"
                key={index}
              >
                {!collapsed && (
                  <h4>
                    {group.title}
                  </h4>
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

                    let active = false;

                    if (
                      item.path ===
                      "/boletos"
                    ) {
                      active =
                        isBoletosActive;
                    } else if (
                      item.path ===
                      "/antecipacao"
                    ) {
                      active =
                        isAntecipacaoActive;
                    } else {
                      active =
                        isActive(item.path);
                    }

                    return (
                      <React.Fragment
                        key={i}
                      >
                        {/* =================================================
                            ITEM PRINCIPAL
                        ================================================= */}

                        <button
                          type="button"
                          className={
                            active
                              ? "active"
                              : ""
                          }
                          onClick={() => {
                            if (
                              item.path ===
                              "/boletos"
                            ) {
                              handleBoletosClick();
                              return;
                            }

                            if (
                              item.path ===
                              "/antecipacao"
                            ) {
                              handleAntecipacaoClick();
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
                                      item.path ===
                                      "/boletos"
                                        ? boletosOpen
                                          ? "open"
                                          : ""
                                        : item.path ===
                                          "/antecipacao"
                                        ? antecipacaoOpen
                                          ? "open"
                                          : ""
                                        : ""
                                    }
                                  `}
                                />
                              )}
                            </>
                          )}
                        </button>

                        {/* =================================================
                            SUBMENU
                        ================================================= */}

                        {hasSubmenu &&
                          !collapsed &&
                          (
                            item.path ===
                            "/boletos"
                              ? boletosOpen
                              : item.path ===
                                "/antecipacao"
                              ? antecipacaoOpen
                              : false
                          ) && (
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

        {/* ===================================================
            FOOTER
        =================================================== */}

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
              <span>
                Sair
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}