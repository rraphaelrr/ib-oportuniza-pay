import React from "react";
import "../pages/Extrato/Extrato.css";

export default function LoadingMovimentos({ quantidade = 8 }) {
  return (
    <div className="loading-movimentos">
      {Array.from({ length: quantidade }).map((_, index) => (
        <div className="loading-card" key={index}>
          <div className="loading-left">
            <div className="loading-icon shimmer" />

            <div className="loading-info">
              <div className="loading-title shimmer" />
              <div className="loading-subtitle shimmer" />
            </div>
          </div>

          <div className="loading-right">
            <div className="loading-value shimmer" />
            <div className="loading-date shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}