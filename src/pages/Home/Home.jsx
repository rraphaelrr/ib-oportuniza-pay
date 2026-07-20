import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layout/DashboardLayout";

import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const [showBalance, setShowBalance] = useState(true);

  const jobs = [
    {
      id: 1,
      titulo: "Médico Clínico Geral",
      salario: "R$ 18.500",
      resumo: "Hospital particular busca médico para plantões diurnos."
    },
    {
      id: 2,
      titulo: "Enfermeiro",
      salario: "R$ 6.800",
      resumo: "Atuação em UTI adulto com escala 12x36."
    },
    {
      id: 3,
      titulo: "Farmacêutico",
      salario: "R$ 5.900",
      resumo: "Controle de medicamentos hospitalares."
    },
    {
      id: 4,
      titulo: "Fisioterapeuta",
      salario: "R$ 7.200",
      resumo: "Atendimento em unidade intensiva."
    }
  ];

  const transactions = [
    {
      id: 1,
      descricao: "PIX Recebido",
      valor: "+ R$ 850,00",
      data: "Hoje • 10:30",
      positive: true
    },
    {
      id: 2,
      descricao: "PIX Enviado",
      valor: "- R$ 120,00",
      data: "Ontem • 18:12",
      positive: false
    },
    {
      id: 3,
      descricao: "Pagamento",
      valor: "- R$ 340,00",
      data: "18/07",
      positive: false
    }
  ];

  return (
    <DashboardLayout>
      <div className="home">

        <div className="welcome">
          <div>
            <h1>Bem-vindo</h1>
            <span>Confira suas informações financeiras.</span>
          </div>
        </div>

        <div className="cards">

          <div className="balance-card">
            <div className="balance-header">
              <span>Saldo disponível</span>

              <button
                onClick={() =>
                  setShowBalance(!showBalance)
                }
              >
                {showBalance ? (
                  <FaEye />
                ) : (
                  <FaEyeSlash />
                )}
              </button>
            </div>

            <h2>
              {showBalance
                ? "R$ 42.583,15"
                : "••••••••"}
            </h2>
          </div>

          <div className="small-card">
            <span>Entradas</span>
            <h3>R$ 18.300,00</h3>
          </div>

          <div className="small-card">
            <span>Saídas</span>
            <h3>R$ 5.200,00</h3>
          </div>

        </div>

        <div className="quick-actions">

          <button onClick={() => navigate("/pix")}>
            PIX
          </button>

          <button onClick={() => navigate("/extrato")}>
            Extrato
          </button>

          <button>
            Cartões
          </button>

          <button>
            Transferir
          </button>

        </div>

        <div className="content-grid">

          <div className="transactions">

            <h2>Últimas movimentações</h2>

            {transactions.map((item) => (
              <div
                key={item.id}
                className="transaction"
              >
                <div>
                  <strong>
                    {item.descricao}
                  </strong>

                  <span>{item.data}</span>
                </div>

                <strong
                  className={
                    item.positive
                      ? "positive"
                      : "negative"
                  }
                >
                  {item.valor}
                </strong>
              </div>
            ))}

          </div>

          <div className="chart">

            <h2>Movimentação</h2>

            <div className="fake-chart">
              Em breve um gráfico financeiro.
            </div>

          </div>

        </div>

        <div className="jobs">

          <div className="jobs-header">
            <h2>Vagas da área da saúde</h2>
          </div>

          <div className="jobs-carousel">

            {jobs.map((job) => (
              <div
                key={job.id}
                className="job-card"
              >
                <h3>{job.titulo}</h3>

                <h4>{job.salario}</h4>

                <p>{job.resumo}</p>

                <button>
                  Ver vaga
                </button>

              </div>
            ))}

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}