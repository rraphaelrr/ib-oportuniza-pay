// src/components/home/CreditCard.jsx

import React from "react";
import {
  FaLock,
  FaRegCreditCard,
} from "react-icons/fa6";

import "./CreditCard.css";

export default function CreditCard({
  holder,
  lastDigits = "4210",
  expiration = "12/29",
  brand = "oportuniZA",
  onManage,
  onBlock,
  onVirtualCard,
}) {
  return (
    <div className="credit-card-widget">
      <div className="credit-header">
        <h3>Meu cartão</h3>

        <button
          className="credit-manage"
          onClick={onManage}
        >
          Gerenciar
        </button>
      </div>

      <div className="credit-card">
        <div className="credit-chip" />

        <div className="credit-brand">
          {brand}
        </div>

        <div className="credit-number">
          •••• •••• •••• {lastDigits}
        </div>

        <div className="credit-footer">
          <div>
            <span>TITULAR</span>
            <strong>{holder}</strong>
          </div>

          <div className="credit-validity">
            <span>VALIDADE</span>
            <strong>{expiration}</strong>
          </div>
        </div>
      </div>

      <div className="credit-actions">
        <button
          className="secondary"
          onClick={onBlock}
        >
          <FaLock />
          Bloquear
        </button>

        {/* <button
          className="primary"
          onClick={onVirtualCard}
        >
          <FaRegCreditCard />
          Cartão virtual
        </button> */}
      </div>
    </div>
  );
}