import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layout/DashboardLayout";

import BalanceCard from "../../components/Home/BalanceCard";
import CreditCard from "../../components/Home/CreditCard";
import QuickActions from "../../components/Home/QuickActions";
import StatsCard from "../../components/Home/StatsCard";
import TransactionList from "../../components/Home/TransactionList";
import CashFlowChart from "../../components/Home/CashFlowChart";
import ServiceCard from "../../components/Home/ServiceCard";
import PromotionBanner from "../../components/Home/PromotionBanner";

import {
  FaPix,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaMoneyBillTransfer,
} from "react-icons/fa6";

import { getBalances } from "../../services/balanceService";

import "./Home.css";
import Produtos from "../../components/Produtos";

export default function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [balance, setBalance] = useState(0);

  const transactions = [
    {
      id: 1,
      description: "PIX Recebido",
      value: 850,
      date: "Hoje • 10:30",
      type: "credit",
    },
    {
      id: 2,
      description: "PIX Enviado",
      value: 120,
      date: "Ontem • 18:12",
      type: "debit",
    },
    {
      id: 3,
      description: "Pagamento boleto",
      value: 340,
      date: "18/07",
      type: "purchase",
    },
  ];

  const cashFlow = [
    {
      month: "Jan",
      income: 8200,
      expense: 3200,
    },
    {
      month: "Fev",
      income: 9100,
      expense: 4100,
    },
    {
      month: "Mar",
      income: 7600,
      expense: 2800,
    },
    {
      month: "Abr",
      income: 10300,
      expense: 5200,
    },
    {
      month: "Mai",
      income: 8900,
      expense: 3700,
    },
    {
      month: "Jun",
      income: 12500,
      expense: 6100,
    },
  ];

  useEffect(() => {
    async function loadBalance() {
      try {
        const accountId = user?.user?.account_id;

        if (!accountId) return;

        const response = await getBalances(accountId);

        const amount =
          response.available_balance ??
          response.available ??
          response.balance ??
          response.balances?.[0]?.available ??
          0;

        setBalance(Number(amount));
      } catch (error) {
        console.error("Erro ao carregar saldo:", error);
      }
    }

    loadBalance();
  }, []);

  return (
    <DashboardLayout>
      <div className="home">
        <section className="welcome">
          <h1>Bem-vindo</h1>

          <span>Confira suas informações financeiras.</span>
        </section>

        <section className="dashboard-cards">
          <div className="balance-card">
            <BalanceCard balance={balance} />
          </div>

          {Produtos.cartão && (
            <div className="credit-card">
              <CreditCard limit="5000" holder={user?.user?.name} />
            </div>
          )}
        </section>

        <section className="stats-grid">
          <StatsCard title="Entradas" value="R$ 18.300,00" type="income" />

          <StatsCard title="Saídas" value="R$ 5.200,00" type="expense" />

          <StatsCard title="Antecipação" value="R$ 3.000,00" type="income" />

          <StatsCard title="Investimentos" value="R$ 12.500,00" type="income" />
        </section>
        <QuickActions
          actions={[
            {
              title: "PIX",
              icon: <FaPix />,
              onClick: () => navigate("/pix"),
            },
            {
              title: "Extrato",
              onClick: () => navigate("/extrato"),
            },
            {
              title: "Cartões",
              icon: <FaCreditCard />,
            },
            {
              title: "Transferir",
              icon: <FaMoneyBillTransfer />,
            },
          ]}
        />

        <PromotionBanner
          title="Tenha mais benefícios"
          description="Controle sua conta, cartões e pagamentos pelo Oportuniza Pay."
          buttonText="Conhecer"
          onClick={() => navigate("/beneficios")}
        />

        <section className="services-section">
          <h2>Serviços</h2>

          <div className="services-grid">
            <ServiceCard
              icon={<FaPix />}
              title="PIX"
              description="Enviar e receber"
              onClick={() => navigate("/pix")}
            />

            <ServiceCard
              icon={<FaFileInvoiceDollar />}
              title="Boletos"
              description="Pagar contas"
            />

            <ServiceCard
              icon={<FaCreditCard />}
              title="Cartões"
              description="Gerenciar cartão"
            />

            <ServiceCard
              icon={<FaMoneyBillTransfer />}
              title="Transferências"
              description="TED e PIX"
            />
          </div>
        </section>

        <section className="finance-grid">
          <TransactionList transactions={transactions} />

          <CashFlowChart data={cashFlow} />
        </section>
      </div>
    </DashboardLayout>
  );
}
