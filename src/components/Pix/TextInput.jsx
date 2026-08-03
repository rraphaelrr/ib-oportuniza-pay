import React from "react";

export default function TextInput({
  value,
  onChange,
  label,
  placeholder = "",
  icon: Icon,
  type = "text",
  multiline = false,
  rows = 4,
  disabled = false,
  maxLength,
}) {

  return (
    <div className="pix-field">

      {label && (
        <label>
          {label}
        </label>
      )}


      <div className="pix-input">

        {Icon && (
          <Icon size={18} />
        )}


        {multiline ? (

          <textarea
            rows={rows}
            value={value}
            disabled={disabled}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(e)=>onChange(e.target.value)}
          />

        ) : (

          <input
            type={type}
            value={value}
            disabled={disabled}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(e)=>onChange(e.target.value)}
          />

        )}

      </div>

    </div>
  );
}