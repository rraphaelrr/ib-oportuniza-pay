import React from "react";
import DatePicker from "react-datepicker";
import { ptBR } from "date-fns/locale";

import "react-datepicker/dist/react-datepicker.css";
import "./DateInput.css";

export default function DateInput({
  label,
  value,
  onChange,
  required = false,
  error,
  helper,
  min,
  max,
  ...props
}) {
  const selectedDate = value ? new Date(value) : null;

  return (
    <div className="date-group">
      {label && (
        <label className="date-label">
          {label}
          {required && <span>*</span>}
        </label>
      )}

      <DatePicker
        selected={selectedDate}
        onChange={(date) =>
          onChange({
            target: {
              value: date
                ? date.toISOString().split("T")[0]
                : "",
            },
          })
        }
        locale={ptBR}
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/mm/aaaa"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        scrollableYearDropdown
        yearDropdownItemNumber={120}
        minDate={min ? new Date(min) : undefined}
        maxDate={max ? new Date(max) : undefined}
        className={`date-input ${error ? "error" : ""}`}
        {...props}
      />

      {helper && !error && (
        <small className="date-helper">{helper}</small>
      )}

      {error && (
        <small className="date-error">{error}</small>
      )}
    </div>
  );
}