import React, { useRef, useEffect, useState } from "react";
import {
  FaCloudUploadAlt,
  FaFileImage,
  FaTrash,
  FaFilePdf,
} from "react-icons/fa";

import "./UploadCard.css";

export default function UploadCard({
  title,
  description,
  value,
  accept = "image/*",
  onChange,
  onRemove,
}) {
  const inputRef = useRef();
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!value || !value.type?.startsWith("image/")) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  function openFile() {
    inputRef.current?.click();
  }

  function handleFile(e) {
    const file = e.target.files[0];

    if (!file) return;

    onChange(file);
  }

  function remove() {
    if (onRemove) {
      onRemove();
    } else {
      onChange(null);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="upload-card">
      <input
        ref={inputRef}
        hidden
        type="file"
        accept={accept}
        onChange={handleFile}
      />

      {!value ? (
        <>
          <FaCloudUploadAlt size={45} color="#003399" />

          <h3>{title}</h3>

          <p>{description}</p>

          <button type="button" onClick={openFile}>
            Selecionar arquivo
          </button>
        </>
      ) : (
        <>
          {preview ? (
            <img src={preview} alt={title} className="upload-preview" />
          ) : value.type === "application/pdf" ? (
            <FaFilePdf size={60} color="#E53935" />
          ) : (
            <FaFileImage size={60} color="#16a34a" />
          )}

          <h3>{value.name}</h3>

          <small>{(value.size / 1024 / 1024).toFixed(2)} MB</small>

          <div className="upload-actions">
            <button type="button" onClick={openFile}>
              Alterar
            </button>

            <button type="button" className="remove" onClick={remove}>
              <FaTrash />
              Remover
            </button>
          </div>
        </>
      )}
    </div>
  );
}
