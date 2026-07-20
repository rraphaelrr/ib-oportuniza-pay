import React from "react";
import "./ProgressBar.css";

export default function ProgressBar({
  current,
  total,
}) {
  const percent = (current / total) * 100;

  return (
    <div className="progress-container">

      <div className="progress-info">

        <span>
          Etapa {current} de {total}
        </span>

        <span>
          {Math.round(percent)}%
        </span>

      </div>

      <div className="progress">

        <div
          className="progress-fill"
          style={{
            width: `${percent}%`,
          }}
        />

      </div>

    </div>
  );
}