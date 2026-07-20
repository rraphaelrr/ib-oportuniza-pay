import React from "react";
import "./DateInput.css";

export default function DateInput({
  label,
  value,
  onChange,
  required = false,
  error,
  min,
  max,
  helper,
  ...props
}) {
  return (
    <div className="date-input-group">
      {label && (
        <label className="date-label">
          {label}
          {required && (
            <span className="required">*</span>
          )}
        </label>
      )}

      <div
        className={`date-wrapper ${
          error ? "error" : ""
        }`}
      >
        <input
          type="date"
          className="date-input"
          value={value}
          min={min}
          max={max}
          onChange={onChange}
          {...props}
        />
      </div>

      {helper && !error && (
        <small className="date-helper">
          {helper}
        </small>
      )}

      {error && (
        <small className="date-error">
          {error}
        </small>
      )}
    </div>
  );
}