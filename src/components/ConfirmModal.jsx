import React from "react";
import {
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

import "./ConfirmModal.css";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-icon">
          <FaCheckCircle />
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="modal-buttons">

          <button
            className="cancel"
            onClick={onCancel}
          >
            <FaTimes />

            {cancelText}

          </button>

          <button
            className="confirm"
            onClick={onConfirm}
          >
            <FaCheckCircle />

            {confirmText}

          </button>

        </div>

      </div>

    </div>
  );
}