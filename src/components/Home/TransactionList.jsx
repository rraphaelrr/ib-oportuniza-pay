// src/components/TransactionList.jsx

import React from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaShoppingBag,
  FaMoneyBillWave,
} from "react-icons/fa";

import "./TransactionList.css";

function TransactionList({ transactions = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case "credit":
        return <FaArrowDown />;

      case "debit":
        return <FaArrowUp />;

      case "purchase":
        return <FaShoppingBag />;

      default:
        return <FaMoneyBillWave />;
    }
  };

  const formatCurrency = (value) => {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="transaction-card">
      <div className="transaction-header">
        <h3>Últimas movimentações</h3>

        <button>
          Ver todas
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-transactions">
          Nenhuma movimentação encontrada
        </div>
      ) : (
        <div className="transaction-list">
          {transactions.map((transaction) => (
            <div
              className="transaction-item"
              key={transaction.id}
            >
              <div
                className={`transaction-icon ${transaction.type}`}
              >
                {getIcon(transaction.type)}
              </div>

              <div className="transaction-info">
                <strong>
                  {transaction.description}
                </strong>

                <span>
                  {transaction.date}
                </span>
              </div>

              <div
                className={`transaction-value ${
                  transaction.type === "credit"
                    ? "positive"
                    : "negative"
                }`}
              >
                {transaction.type === "credit"
                  ? "+"
                  : "-"}
                {formatCurrency(transaction.value)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionList;