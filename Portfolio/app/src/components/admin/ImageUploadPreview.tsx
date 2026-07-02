/**
 * ImageUploadPreview — reusable DRY component for image uploads.
 * Shows a live preview of the selected file and the current saved URL.
 */
import React, { useRef, useState } from "react";

interface Props {
  /** The currently saved image URL (from DB). */
  currentUrl?: string | null;
  /** Called with the selected File when the user picks one. Pass null to signal removal intent. */
  onChange: (file: File | null) => void;
  /** Display label shown above the uploader */
  label?: string;
  /** Optional extra className on the wrapper */
  className?: string;
}

export const ImageUploadPreview: React.FC<Props> = ({
  currentUrl,
  onChange,
  label = "Image",
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange(file);
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayedSrc = preview || currentUrl || null;

  return (
    <div className={`image-upload-preview ${className}`}>
      <label className="form-label">{label}</label>

      {/* Preview area */}
      {displayedSrc ? (
        <div className="iup-preview-wrapper">
          <img src={displayedSrc} alt="preview" className="iup-preview-img" />
          <button
            type="button"
            className="iup-clear-btn"
            onClick={handleClear}
            title="Supprimer l'image"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          className="iup-dropzone"
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        >
          <span className="iup-dropzone-icon">🖼️</span>
          <p className="iup-dropzone-text">Cliquez pour choisir une image</p>
          <p className="iup-dropzone-hint">PNG, JPG, WebP — max 5 MB</p>
        </div>
      )}

      {/* Hidden native input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="iup-hidden-input"
        onChange={handleFileChange}
        aria-label={label}
      />

      {/* Change button when already showing something */}
      {displayedSrc && (
        <button
          type="button"
          className="iup-change-btn"
          onClick={() => inputRef.current?.click()}
        >
          Changer l'image
        </button>
      )}
    </div>
  );
};

export default ImageUploadPreview;
