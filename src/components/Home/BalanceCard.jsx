// src/components/home/BalanceCard.jsx

import React from "react";

import { FaEye, FaEyeSlash, FaPix } from "react-icons/fa6";

import { MdOutlineSwapHoriz, MdOutlineRequestQuote } from "react-icons/md";

import { BsCurrencyDollar } from "react-icons/bs";

import "./BalanceCard.css";

export default function BalanceCard({
  balance,

  showBalance = true,

  onToggleBalance,

  agency = "000",

  account = "0000000",

  pixKey = "0000000",

  usdt = "00000",

  blocked = "00000",

  anticipationLimit = 180000,

  onPix,

  onTransfer,

  onReceive,

  onAnticipation,
}) {
  const money = (value) =>
    Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <section className="balance-card">
      <div className="balance-top">
        <div>
          <span className="balance-title">
            Saldo disponível
          </span>
        </div>

        <button
          className="balance-eye"
          onClick={onToggleBalance}
          aria-label="Mostrar ou ocultar saldo"
        >
          {showBalance ? <FaEye /> : <FaEyeSlash />}
        </button>
      </div>

      <h1 className="balance-value">
        {showBalance ? money(balance) : "••••••••"}
      </h1>

      <p className="balance-info">
        Saldo bloqueado:
        <strong>{showBalance ? money(blocked) : "••••"}</strong>
        <span>{" • "}</span>
        Limite antecipação:
        <strong>{showBalance ? money(anticipationLimit) : "••••"}</strong>
      </p>

      {/* <div className="balance-details">
        <div>
          <span>Agência</span>

          <strong>{agency}</strong>
        </div>

        <div>
          <span>Conta</span>

          <strong>{account}</strong>
        </div>

        <div className="pix-detail">
          <span>Chave Pix</span>

          <strong>{pixKey}</strong>
        </div>

        <div>
          <span>USDT</span>

          <strong>{usdt}</strong>
        </div>
      </div> */}

      <div className="balance-actions">
        <button onClick={onPix}>
          <FaPix />

          <span>Pix</span>
        </button>

        <button onClick={onTransfer}>
          <MdOutlineSwapHoriz />

          <span>Transferir</span>
        </button>

        <button onClick={onReceive}>
          <MdOutlineRequestQuote />

          <span>Cobrar</span>
        </button>

        <button onClick={onAnticipation}>
          <BsCurrencyDollar />

          <span>Antecipar</span>
        </button>
      </div>
    </section>
  );
}
