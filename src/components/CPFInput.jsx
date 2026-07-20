import React from "react";
import InputMask from "react-input-mask";
import "./DocumentInput.css";

export default function CPFInput({
  label = "CPF",
  value,
  onChange,
  error,
  helper,
  required = false,
  ...props
}) {
  return (
    <div className="document-group">
      <label className="document-label">
        {label}

        {required && (
          <span className="required">*</span>
        )}
      </label>

      <div
        className={`document-wrapper ${
          error ? "error" : ""
        }`}
      >
        <InputMask
          mask="999.999.999-99"
          maskChar=""
          value={value}
          onChange={onChange}
          {...props}
        >
          {(inputProps) => (
            <input
              {...inputProps}
              className="document-input"
              type="text"
              placeholder="000.000.000-00"
            />
          )}
        </InputMask>
      </div>

      {helper && !error && (
        <small className="document-helper">
          {helper}
        </small>
      )}

      {error && (
        <small className="document-error">
          {error}
        </small>
      )}
    </div>
  );
}