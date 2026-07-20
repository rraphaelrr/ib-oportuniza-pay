import React, { useRef } from "react";
import {
  FaCloudUploadAlt,
  FaFileImage,
  FaTrash
} from "react-icons/fa";

import "./UploadCard.css";

export default function UploadCard({
  title,
  description,
  file,
  accept = "image/*",
  onChange,
  onRemove,
}) {
  const inputRef = useRef();

  function openFile() {
    inputRef.current.click();
  }

  function handleFile(event) {
    const selected = event.target.files[0];

    if (!selected) return;

    onChange(selected);
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

      {!file ? (
        <>

          <FaCloudUploadAlt
            size={45}
            color="#003399"
          />

          <h3>{title}</h3>

          <p>{description}</p>

          <button
            type="button"
            onClick={openFile}
          >
            Selecionar arquivo
          </button>

        </>
      ) : (
        <>
          <FaFileImage
            size={45}
            color="#16a34a"
          />

          <h3>{file.name}</h3>

          <small>
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </small>

          <div className="upload-actions">

            <button
              type="button"
              onClick={openFile}
            >
              Alterar
            </button>

            <button
              type="button"
              className="remove"
              onClick={onRemove}
            >
              <FaTrash />

              Remover
            </button>

          </div>

        </>
      )}

    </div>
  );
}