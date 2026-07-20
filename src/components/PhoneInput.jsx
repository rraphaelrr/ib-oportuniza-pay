import React from "react";
import InputMask from "react-input-mask";
import "./PhoneInput.css";

export default function PhoneInput({
  label,
  value,
  onChange,
  required = false,
  error,
  helper,
  placeholder = "(11) 99999-9999",
  ...props
}) {
  return (
    <div className="phone-group">
      {label && (
        <label className="phone-label">
          {label}

          {required && (
            <span className="required">*</span>
          )}
        </label>
      )}

      <div className={`phone-wrapper ${error ? "error" : ""}`}>
        <InputMask
          mask="(99) 99999-9999"
          maskChar=""
          value={value}
          onChange={onChange}
          {...props}
        >
          {(inputProps) => (
            <input
              {...inputProps}
              className="phone-input"
              type="tel"
              placeholder={placeholder}
            />
          )}
        </InputMask>
      </div>

      {helper && !error && (
        <small className="phone-helper">
          {helper}
        </small>
      )}

      {error && (
        <small className="phone-error">
          {error}
        </small>
      )}
    </div>
  );
}