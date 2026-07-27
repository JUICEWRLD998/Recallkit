import { useEffect, useRef, useState } from 'react';
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

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

function resizeIframe(iframe: HTMLIFrameElement) {
  try {
    const doc = iframe.contentDocument;
    if (!doc?.body) return;

    iframe.style.height = '0px';
    const height = Math.ceil(doc.body.getBoundingClientRect().height);
    if (height > 0) {
      iframe.style.height = `${height}px`;
    }
  } catch {
    // Sandbox edge cases — keep default height.
  }
}

export function PreviewFrame({
  html,
  title,
  width,
  allowScripts = false,
  variant = 'email',
}: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeWidth = width === '100%' ? '100%' : `${width}px`;
  const fullBleed = width === '100%';
  const debouncedHtml = useDebouncedValue(html, 250);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => resizeIframe(iframe);
    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [debouncedHtml]);

  return (
    <div className={`${styles.container}${fullBleed ? ` ${styles.containerFull}` : ''}`}>
      <div
        className={`${styles.sheet} ${styles[variantClass[variant]]}${fullBleed ? ` ${styles.sheetFull}` : ''}`}
        style={{ width: iframeWidth, maxWidth: '100%' }}
      >
        <iframe
          ref={iframeRef}
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
