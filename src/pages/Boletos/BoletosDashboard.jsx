import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ArrowUpRight,
  ArrowRight,
  Users,
  CreditCard,
} from "lucide-react";

import "./BoletosDashboard.css";
import DashboardLayout from "../../layout/DashboardLayout";
import boletoService from "../../services/boletoService";

export default function BoletosDashboard() {
  const navigate = useNavigate();

  // =========================================================
  // ESTADOS
  // =========================================================

  const [resumo, setResumo] = useState({
    total: 0,
    emAberto: 0,
    pagos: 0,
    vencidos: 0,
    valorEmAberto: 0,
    valorRecebido: 0,
    valorVencido: 0,
  });

  const [ultimosBoletos, setUltimosBoletos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // =========================================================
  // CARREGAR DADOS
  // =========================================================

  useEffect(() => {
    carregarDashboard();
  }, []);

  async function carregarDashboard() {
    try {
      setLoading(true);
      setError(null);

      const response = await boletoService.getDashboard();

      if (!response) {
        throw new Error("Não foi possível carregar os dados.");
      }

      setResumo(
        response.resumo || {
          total: 0,
          emAberto: 0,
          pagos: 0,
          vencidos: 0,
          valorEmAberto: 0,
          valorRecebido: 0,
          valorVencido: 0,
        }
      );

      setUltimosBoletos(
        Array.isArray(response.ultimosBoletos)
          ? response.ultimosBoletos
          : []
      );
    } catch (err) {
      console.error(
        "Erro ao carregar dashboard de boletos:",
        err
      );

      setError(
        err?.message ||
          "Não foi possível carregar os dados dos boletos."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // FORMATADORES
  // =========================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value) || 0);
  };

  const getStatus = (status) => {
    const statuses = {
      EM_ABERTO: {
        label: "Em aberto",
        className: "status-open",
      },

      PAGO: {
        label: "Pago",
        className: "status-paid",
      },

      VENCIDO: {
        label: "Vencido",
        className: "status-overdue",
      },

      CANCELADO: {
        label: "Cancelado",
        className: "status-cancelled",
      },

      BAIXADO: {
        label: "Baixado",
        className: "status-cancelled",
      },

      LIQUIDADO: {
        label: "Liquidado",
        className: "status-paid",
      },
    };

    return (
      statuses[String(status || "").toUpperCase()] || {
        label: status || "Indefinido",
        className: "",
      }
    );
  };

  // =========================================================
  // NAVEGAÇÃO
  // =========================================================

  function handleNovoBoleto() {
    navigate("/boletos/gerar");
  }

  function handleGerarLote() {
    navigate("/boletos/gerar-lote");
  }

  function handleClientes() {
    navigate("/boletos/clientes");
  }

  function handleInadimplencia() {
    navigate("/boletos/inadimplencia");
  }

  function handlePagamentos() {
    navigate("/boletos/pagamentos");
  }

  function handleLista() {
    navigate("/boletos/lista");
  }

  function handleBoleto(id) {
    if (!id) return;

    navigate(`/boletos/${encodeURIComponent(id)}`);
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="boletos-dashboard">
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            <p>Carregando informações dos boletos...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // ERRO
  // =========================================================

  if (error) {
    return (
      <DashboardLayout>
        <div className="boletos-dashboard">
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            <AlertTriangle size={32} />

            <h2>Não foi possível carregar os boletos</h2>

            <p>{error}</p>

            <button
              type="button"
              className="boletos-button primary"
              onClick={carregarDashboard}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <DashboardLayout>
      <div className="boletos-dashboard">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="boletos-dashboard-header">
          <div className="boletos-dashboard-header-content">

            <div className="boletos-breadcrumb">
              <span>Internet Banking</span>

              <span className="breadcrumb-separator">
                /
              </span>

              <span>Boletos</span>
            </div>

            <h1>Boletos</h1>

            <p>
              Gerencie suas cobranças, recebimentos e contratos.
            </p>
          </div>

          <div className="boletos-header-actions">

            <button
              type="button"
              className="boletos-button secondary"
              onClick={handleGerarLote}
            >
              <Layers size={18} />

              <span>Gerar em lote</span>
            </button>

            <button
              type="button"
              className="boletos-button primary"
              onClick={handleNovoBoleto}
            >
              <Plus size={18} />

              <span>Novo boleto</span>
            </button>

          </div>
        </header>

        {/* =====================================================
            RESUMO
        ====================================================== */}

        <section className="boletos-summary">

          {/* TOTAL */}

          <button
            type="button"
            className="boletos-summary-card"
            onClick={handleLista}
          >
            <div className="summary-icon">
              <FileText size={21} />
            </div>

            <div className="summary-content">

              <span className="summary-label">
                Total de boletos
              </span>

              <strong>
                {resumo.total}
              </strong>

              <small>
                cobranças cadastradas
              </small>

            </div>
          </button>

          {/* ABERTOS */}

          <button
            type="button"
            className="boletos-summary-card"
            onClick={handleLista}
          >
            <div className="summary-icon open">
              <Clock3 size={21} />
            </div>

            <div className="summary-content">

              <span className="summary-label">
                Em aberto
              </span>

              <strong>
                {formatCurrency(
                  resumo.valorEmAberto
                )}
              </strong>

              <small>
                {resumo.emAberto} boletos
              </small>

            </div>
          </button>

          {/* PAGOS */}

          <button
            type="button"
            className="boletos-summary-card"
            onClick={handlePagamentos}
          >
            <div className="summary-icon paid">
              <CheckCircle2 size={21} />
            </div>

            <div className="summary-content">

              <span className="summary-label">
                Recebido
              </span>

              <strong>
                {formatCurrency(
                  resumo.valorRecebido
                )}
              </strong>

              <small>
                {resumo.pagos} boletos pagos
              </small>

            </div>
          </button>

          {/* VENCIDOS */}

          <button
            type="button"
            className="boletos-summary-card"
            onClick={handleInadimplencia}
          >
            <div className="summary-icon overdue">
              <AlertTriangle size={21} />
            </div>

            <div className="summary-content">

              <span className="summary-label">
                Em atraso
              </span>

              <strong>
                {formatCurrency(
                  resumo.valorVencido
                )}
              </strong>

              <small>
                {resumo.vencidos} boletos vencidos
              </small>

            </div>
          </button>

        </section>

        {/* =====================================================
            ACESSO RÁPIDO
        ====================================================== */}

        <section className="boletos-section">

          <div className="boletos-section-header">

            <div>

              <h2>
                Acesso rápido
              </h2>

              <p>
                Acesse as principais funções de cobrança.
              </p>

            </div>

          </div>

          <div className="boletos-shortcuts">

            {/* EMITIR */}

            <button
              type="button"
              className="boletos-shortcut"
              onClick={handleNovoBoleto}
            >
              <div className="shortcut-icon">
                <Plus size={20} />
              </div>

              <div className="shortcut-content">

                <strong>
                  Emitir boleto
                </strong>

                <span>
                  Crie uma nova cobrança.
                </span>

              </div>

              <ArrowUpRight size={18} />
            </button>

            {/* LOTE */}

            <button
              type="button"
              className="boletos-shortcut"
              onClick={handleGerarLote}
            >
              <div className="shortcut-icon">
                <Layers size={20} />
              </div>

              <div className="shortcut-content">

                <strong>
                  Gerar em lote
                </strong>

                <span>
                  Gere várias cobranças de uma vez.
                </span>

              </div>

              <ArrowUpRight size={18} />
            </button>

            {/* INADIMPLÊNCIA */}

            <button
              type="button"
              className="boletos-shortcut"
              onClick={handleInadimplencia}
            >
              <div className="shortcut-icon danger">
                <AlertTriangle size={20} />
              </div>

              <div className="shortcut-content">

                <strong>
                  Inadimplência
                </strong>

                <span>
                  Consulte clientes em atraso.
                </span>

              </div>

              <ArrowUpRight size={18} />
            </button>

            {/* CLIENTES */}

            <button
              type="button"
              className="boletos-shortcut"
              onClick={handleClientes}
            >
              <div className="shortcut-icon">
                <Users size={20} />
              </div>

              <div className="shortcut-content">

                <strong>
                  Clientes
                </strong>

                <span>
                  Consulte clientes e contratos.
                </span>

              </div>

              <ArrowUpRight size={18} />
            </button>

          </div>
        </section>

        {/* =====================================================
            ÚLTIMOS BOLETOS
        ====================================================== */}

        <section className="boletos-section">

          <div className="boletos-section-header">

            <div>

              <h2>
                Últimos boletos
              </h2>

              <p>
                Acompanhe as cobranças mais recentes.
              </p>

            </div>

            <button
              type="button"
              className="boletos-link-button"
              onClick={handleLista}
            >
              <span>
                Ver todos
              </span>

              <ArrowRight size={16} />
            </button>

          </div>

          <div className="boletos-table-wrapper">

            <table className="boletos-table">

              <thead>

                <tr>
                  <th>Cliente</th>
                  <th>Contrato</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {ultimosBoletos.length > 0 ? (

                  ultimosBoletos.map((boleto) => {

                    const status = getStatus(
                      boleto.status
                    );

                    return (
                      <tr
                        key={boleto.id}
                        onClick={() =>
                          handleBoleto(boleto.id)
                        }
                        tabIndex={0}
                        onKeyDown={(event) => {

                          if (
                            event.key === "Enter" ||
                            event.key === " "
                          ) {

                            event.preventDefault();

                            handleBoleto(
                              boleto.id
                            );
                          }

                        }}
                      >

                        <td>

                          <div className="boleto-client">

                            <div className="boleto-client-avatar">

                              {String(
                                boleto.cliente ||
                                  "?"
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <div>

                              <strong>
                                {boleto.cliente ||
                                  "Cliente não informado"}
                              </strong>

                              <span>
                                Boleto #
                                {boleto.id}
                              </span>

                            </div>

                          </div>

                        </td>

                        <td>
                          {boleto.contrato ||
                            "—"}
                        </td>

                        <td>

                          <strong>
                            {formatCurrency(
                              boleto.valor
                            )}
                          </strong>

                        </td>

                        <td>
                          {boleto.vencimento ||
                            "—"}
                        </td>

                        <td>

                          <span
                            className={`boleto-status ${status.className}`}
                          >
                            {status.label}
                          </span>

                        </td>

                      </tr>
                    );
                  })

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                      }}
                    >
                      Nenhum boleto encontrado.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* =====================================================
            INADIMPLÊNCIA
        ====================================================== */}

        <section className="boletos-inadimplencia-card">

          <div className="inadimplencia-icon">
            <AlertTriangle size={22} />
          </div>

          <div className="inadimplencia-content">

            <h3>
              Atenção à inadimplência
            </h3>

            <p>

              Você possui{" "}

              <strong>
                {resumo.vencidos}
              </strong>{" "}

              boletos vencidos, totalizando{" "}

              <strong>
                {formatCurrency(
                  resumo.valorVencido
                )}
              </strong>
              .

            </p>

          </div>

          <button
            type="button"
            className="boletos-link-button"
            onClick={handleInadimplencia}
          >
            <span>
              Ver inadimplência
            </span>

            <ArrowRight size={16} />
          </button>

        </section>

        {/* =====================================================
            PAGAMENTOS
        ====================================================== */}

        <section className="boletos-section boletos-payments-section">

          <div className="boletos-section-header">

            <div>

              <h2>
                Pagamentos
              </h2>

              <p>
                Consulte os pagamentos recebidos.
              </p>

            </div>

            <button
              type="button"
              className="boletos-link-button"
              onClick={handlePagamentos}
            >
              <CreditCard size={15} />

              <span>
                Acessar pagamentos
              </span>

              <ArrowRight size={16} />
            </button>

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}