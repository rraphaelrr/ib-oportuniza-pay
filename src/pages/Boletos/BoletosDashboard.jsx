
import React from "react";
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
} from "lucide-react";

import "./BoletosDashboard.css";
import DashboardLayout from "../../layout/DashboardLayout";

export default function BoletosDashboard() {
  const navigate = useNavigate();

  /*
   * Dados temporários.
   *
   * Depois serão substituídos pelos dados vindos do useBoletos().
   */
  const resumo = {
    total: 152,
    emAberto: 43,
    pagos: 91,
    vencidos: 18,

    valorEmAberto: 84250.0,
    valorRecebido: 52430.0,
    valorVencido: 12800.0,
  };

  const ultimosBoletos = [
    {
      id: "000123",
      cliente: "João da Silva",
      contrato: "Contrato #1023",
      valor: 850,
      vencimento: "10/08/2026",
      status: "EM_ABERTO",
    },
    {
      id: "000124",
      cliente: "Maria Souza",
      contrato: "Contrato #1024",
      valor: 420,
      vencimento: "08/08/2026",
      status: "PAGO",
    },
    {
      id: "000125",
      cliente: "Empresa ABC",
      contrato: "Contrato #1025",
      valor: 1200,
      vencimento: "05/08/2026",
      status: "VENCIDO",
    },
    {
      id: "000126",
      cliente: "Carlos Oliveira",
      contrato: "Contrato #1026",
      valor: 650,
      vencimento: "15/08/2026",
      status: "EM_ABERTO",
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
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
    };

    return (
      statuses[status] || {
        label: status,
        className: "",
      }
    );
  };

  return (
    <DashboardLayout>

    
    <div className="boletos-dashboard">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="boletos-dashboard-header">
        <div>
          <div className="boletos-breadcrumb">
            Internet Banking
            <span>/</span>
            Boletos
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
            onClick={() => navigate("/boletos/lote")}
          >
            <Layers size={18} />
            Gerar em lote
          </button>

          <button
            type="button"
            className="boletos-button primary"
            onClick={() => navigate("/boletos/emitir")}
          >
            <Plus size={18} />
            Novo boleto
          </button>
        </div>
      </div>

      {/* =====================================================
          RESUMO
      ====================================================== */}

      <section className="boletos-summary">

        <div className="boletos-summary-card">
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
        </div>

        <div className="boletos-summary-card">
          <div className="summary-icon open">
            <Clock3 size={21} />
          </div>

          <div className="summary-content">
            <span className="summary-label">
              Em aberto
            </span>

            <strong>
              {formatCurrency(resumo.valorEmAberto)}
            </strong>

            <small>
              {resumo.emAberto} boletos
            </small>
          </div>
        </div>

        <div className="boletos-summary-card">
          <div className="summary-icon paid">
            <CheckCircle2 size={21} />
          </div>

          <div className="summary-content">
            <span className="summary-label">
              Recebido
            </span>

            <strong>
              {formatCurrency(resumo.valorRecebido)}
            </strong>

            <small>
              {resumo.pagos} boletos pagos
            </small>
          </div>
        </div>

        <div className="boletos-summary-card">
          <div className="summary-icon overdue">
            <AlertTriangle size={21} />
          </div>

          <div className="summary-content">
            <span className="summary-label">
              Em atraso
            </span>

            <strong>
              {formatCurrency(resumo.valorVencido)}
            </strong>

            <small>
              {resumo.vencidos} boletos vencidos
            </small>
          </div>
        </div>

      </section>

      {/* =====================================================
          ATALHOS
      ====================================================== */}

      <section className="boletos-section">

        <div className="boletos-section-header">
          <div>
            <h2>Acesso rápido</h2>
            <p>
              Acesse as principais funções de cobrança.
            </p>
          </div>
        </div>

        <div className="boletos-shortcuts">

          <button
            type="button"
            className="boletos-shortcut"
            onClick={() => navigate("/boletos/emitir")}
          >
            <div className="shortcut-icon">
              <Plus size={20} />
            </div>

            <div>
              <strong>Emitir boleto</strong>
              <span>
                Crie uma nova cobrança.
              </span>
            </div>

            <ArrowUpRight size={18} />
          </button>

          <button
            type="button"
            className="boletos-shortcut"
            onClick={() => navigate("/boletos/lote")}
          >
            <div className="shortcut-icon">
              <Layers size={20} />
            </div>

            <div>
              <strong>Gerar em lote</strong>
              <span>
                Gere várias cobranças de uma vez.
              </span>
            </div>

            <ArrowUpRight size={18} />
          </button>

          <button
            type="button"
            className="boletos-shortcut"
            onClick={() => navigate("/boletos/inadimplencia")}
          >
            <div className="shortcut-icon">
              <AlertTriangle size={20} />
            </div>

            <div>
              <strong>Inadimplência</strong>
              <span>
                Consulte clientes em atraso.
              </span>
            </div>

            <ArrowUpRight size={18} />
          </button>

          <button
            type="button"
            className="boletos-shortcut"
            onClick={() => navigate("/boletos/clientes")}
          >
            <div className="shortcut-icon">
              <Users size={20} />
            </div>

            <div>
              <strong>Clientes</strong>
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
            <h2>Últimos boletos</h2>

            <p>
              Acompanhe as cobranças mais recentes.
            </p>
          </div>

          <button
            type="button"
            className="boletos-link-button"
            onClick={() => navigate("/boletos")}
          >
            Ver todos
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

              {ultimosBoletos.map((boleto) => {
                const status = getStatus(boleto.status);

                return (
                  <tr
                    key={boleto.id}
                    onClick={() =>
                      navigate(`/boletos/${boleto.id}`)
                    }
                  >

                    <td>
                      <div className="boleto-client">

                        <div className="boleto-client-avatar">
                          {boleto.cliente
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {boleto.cliente}
                          </strong>

                          <span>
                            Boleto #{boleto.id}
                          </span>
                        </div>

                      </div>
                    </td>

                    <td>
                      {boleto.contrato}
                    </td>

                    <td>
                      <strong>
                        {formatCurrency(boleto.valor)}
                      </strong>
                    </td>

                    <td>
                      {boleto.vencimento}
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
              })}

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
            Você possui {resumo.vencidos} boletos vencidos,
            totalizando {formatCurrency(resumo.valorVencido)}.
          </p>

        </div>

        <button
          type="button"
          className="boletos-link-button"
          onClick={() =>
            navigate("/boletos/inadimplencia")
          }
        >
          Ver inadimplência
          <ArrowRight size={16} />
        </button>

      </section>

    </div>
    </DashboardLayout>
  );
}


