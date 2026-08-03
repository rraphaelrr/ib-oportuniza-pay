import React from "react";

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  icon: Icon,
  disabled = false,
  loading = false,
  fullWidth = true,
}) {

  return (
    <button
      type={type}
      className={`pix-primary-btn ${
        fullWidth ? "full-width" : ""
      }`}
      onClick={onClick}
      disabled={disabled || loading}
    >

      {loading ? (

        <span className="pix-button-loading">
          Processando...
        </span>

      ) : (

        <>
          {Icon && (
            <Icon size={18} />
          )}

          <span>
            {children}
          </span>
        </>

      )}

    </button>
  );
}