import React from "react";
import "./LoadingButton.css";

export default function LoadingButton({
  children,
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={`loading-button ${className}`}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          Processando...
        </>
      ) : (
        children
      )}
    </button>
  );
}