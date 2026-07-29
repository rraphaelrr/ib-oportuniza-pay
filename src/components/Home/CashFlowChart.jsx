import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import "./CashFlowChart.css";

function CashFlowChart({ data = [] }) {
  const formatCurrency = (value) => {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="cashflow-card">
      <div className="cashflow-header">
        <div>
          <h3>Fluxo financeiro</h3>
          <span>
            Entradas e saídas recentes
          </span>
        </div>
      </div>

      <div className="cashflow-chart">
        {data.length === 0 ? (
          <div className="cashflow-empty">
            Sem dados financeiros
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <AreaChart data={data}>

              <defs>
                <linearGradient
                  id="balanceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopOpacity={0.3}
                  />

                  <stop
                    offset="100%"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                hide
              />

              <Tooltip
                formatter={(value) =>
                  formatCurrency(value)
                }
              />

              <Area
                type="monotone"
                dataKey="income"
                stroke="#16a34a"
                fill="url(#balanceGradient)"
                name="Entradas"
              />

              <Area
                type="monotone"
                dataKey="expense"
                stroke="#dc2626"
                fill="transparent"
                name="Saídas"
              />

            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="cashflow-summary">

        <div>
          <span>Entradas</span>
          <strong className="income">
            {formatCurrency(
              data.reduce(
                (total, item) =>
                  total + item.income,
                0
              )
            )}
          </strong>
        </div>


        <div>
          <span>Saídas</span>
          <strong className="expense">
            {formatCurrency(
              data.reduce(
                (total, item) =>
                  total + item.expense,
                0
              )
            )}
          </strong>
        </div>

      </div>

    </div>
  );
}

export default CashFlowChart;