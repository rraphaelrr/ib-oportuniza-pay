// src/components/home/StatsCard.jsx

import React from "react";
import "./StatsCard.css";

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = "#3B82F6",
  trend = "up", // up | down | neutral
}) {
  const formatMoney = (amount) =>
    Number(amount).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div
          className={`stats-card-icon ${trend}`}
          style={{ background: `${color}15`, color }}
        >
          {icon}
        </div>

        <span className="stats-card-title">
          {title}
        </span>
      </div>

      <h2 className="stats-card-value">
        {typeof value === "number"
          ? formatMoney(value)
          : value}
      </h2>

      {subtitle && (
        <p className="stats-card-subtitle">
          {subtitle}
        </p>
      )}
    </div>
  );
}