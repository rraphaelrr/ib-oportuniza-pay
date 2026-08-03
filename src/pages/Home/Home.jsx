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
import { getExtrato } from "../../services/extratoService";
export default function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [cashFlow, setCashFlow] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
 

  

 useEffect(() => {
  async function loadData() {
    try {
      const accountId = user?.user?.account_id;

      if (!accountId) return;

      // Saldo
      const response = await getBalances(accountId);

      const balance = Array.isArray(response)
        ? response[0]
        : response;

      setBalance(Number(balance?.available_balance ?? 0));

      // Extrato
      const extrato = await getExtrato(accountId);

      const items = extrato?.items ?? [];

      // Últimas movimentações
      const ultimas = [...items]
        .sort(
          (a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        )
        .slice(0, 5)
        .map((item) => ({
          id: item.ledger_entry_id,

          description: item.entry_type
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase()),

          value: Number(item.amount),

          date: new Date(item.created_at).toLocaleString("pt-BR"),

          type:
            item.direction === "CREDIT"
              ? "credit"
              : "debit",
        }));

      setTransactions(ultimas);

      // Entradas
      const totalEntradas = items
        .filter((item) => item.direction === "CREDIT")
        .reduce(
          (acc, item) => acc + Number(item.amount),
          0
        );

      // Saídas
      const totalSaidas = items
        .filter((item) => item.direction === "DEBIT")
        .reduce(
          (acc, item) => acc + Number(item.amount),
          0
        );

      setIncome(totalEntradas);
      setExpense(totalSaidas);

      // Fluxo financeiro
      const meses = {};

      items.forEach((item) => {
        const data = new Date(item.created_at);

        const mes = data.toLocaleString("pt-BR", {
          month: "short",
        });

        if (!meses[mes]) {
          meses[mes] = {
            month: mes,
            income: 0,
            expense: 0,
          };
        }

        if (item.direction === "CREDIT") {
          meses[mes].income += Number(item.amount);
        } else {
          meses[mes].expense += Number(item.amount);
        }
      });

      setCashFlow(Object.values(meses));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  loadData();
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
          <StatsCard
  title="Entradas"
  value={income.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}
  type="income"
/>

         <StatsCard
  title="Saídas"
  value={expense.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}
  type="expense"
/>

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
