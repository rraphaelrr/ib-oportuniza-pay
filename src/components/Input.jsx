import React, { forwardRef } from "react";
import "./Input.css";

export default forwardRef(function Input(
  {
    label,
    error,
    icon,
    required = false,
    helper,
    className = "",
    ...props
  },
  ref
) {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label">
          {label}

          {required && (
            <span className="required">*</span>
          )}
        </label>
      )}

      <div className={`input-wrapper ${error ? "error" : ""}`}>
        {icon && (
          <div className="input-icon">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          className="input"
          {...props}
        />
      </div>

      {helper && !error && (
        <small className="input-helper">
          {helper}
        </small>
      )}

      {error && (
        <small className="input-error">
          {error}
        </small>
      )}
    </div>
  );
});