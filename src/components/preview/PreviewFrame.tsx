import { useEffect, useState } from 'react';
import styles from './PreviewFrame.module.css';

type PreviewVariant = 'email' | 'document' | 'page';

interface PreviewFrameProps {
  html: string;
  title: string;
  width: number | '100%';
  allowScripts?: boolean;
  variant?: PreviewVariant;
}

const variantClass: Record<PreviewVariant, string> = {
  email: 'sheetEmail',
  document: 'sheetDocument',
  page: 'sheetPage',
};

/**
 * Debounce srcDoc updates so the iframe reloads calmly instead of on every
 * keystroke. The first value renders immediately; later values settle after
 * a short pause in typing.
 */
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export function PreviewFrame({
  html,
  title,
  width,
  allowScripts = false,
  variant = 'email',
}: PreviewFrameProps) {
  const iframeWidth = width === '100%' ? '100%' : `${width}px`;
  const fullBleed = width === '100%';
  const debouncedHtml = useDebouncedValue(html, 250);

  return (
    <div className={`${styles.container}${fullBleed ? ` ${styles.containerFull}` : ''}`}>
      <div
        className={`${styles.sheet} ${styles[variantClass[variant]]}${fullBleed ? ` ${styles.sheetFull}` : ''}`}
        style={{ width: iframeWidth, maxWidth: '100%' }}
      >
        <iframe
          className={styles.frame}
          srcDoc={debouncedHtml}
          title={`Preview of ${title}`}
          sandbox={allowScripts ? 'allow-scripts allow-popups' : 'allow-same-origin'}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
