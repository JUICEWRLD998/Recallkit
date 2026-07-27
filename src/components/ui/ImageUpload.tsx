import { useId, useRef } from 'react';
import styles from './ImageUpload.module.css';

const MAX_BYTES = 1_500_000;
const ACCEPT = 'image/jpeg,image/png,image/webp';

interface ImageUploadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  id?: string;
}

function isDisplayableImage(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.startsWith('data:image/') || /^https?:\/\//.test(trimmed);
}

export function ImageUpload({ value, onChange, id }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const preview = isDisplayableImage(value) ? value : null;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > MAX_BYTES) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.root}>
      <div className={styles.preview} aria-hidden={!preview}>
        {preview ? (
          <img src={preview} alt="" className={styles.image} />
        ) : (
          <span className={styles.placeholder}>No photo</span>
        )}
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          onClick={() => inputRef.current?.click()}
        >
          {preview ? 'Change photo' : 'Upload photo'}
        </button>
        {preview && (
          <button
            type="button"
            className={styles.secondary}
            onClick={() => onChange('')}
          >
            Remove
          </button>
        )}
      </div>
      <p className={styles.hint}>JPEG, PNG or WebP · max 1.5 MB</p>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT}
        className={styles.fileInput}
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
    </div>
  );
}
