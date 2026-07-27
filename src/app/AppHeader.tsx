import { useCallback, useEffect, useRef, useState } from 'react';
import type { RecallSeverity } from '../domain/recall-schema';
import { StatusBadge } from '../components/ui';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  status: 'saved' | 'unsaved' | 'error';
  onReset: () => void;
  onExportHtml: () => boolean;
  onExportJson: () => boolean;
  onCopyHtml: () => Promise<void>;
  onPrint: () => void;
  exportDisabled?: boolean;
  activeOutput: string;
  exportError?: string | null;
  recallId?: string;
  severity?: RecallSeverity;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const statusText: Record<AppHeaderProps['status'], string> = {
  saved: 'Saved',
  unsaved: 'Unsaved',
  error: 'Save error',
};

type CopyState = 'idle' | 'copied' | 'failed';

const severityTone: Record<RecallSeverity, string> = {
  critical: styles.toneCritical,
  high: styles.toneWarning,
  advisory: styles.toneNeutral,
};

export function AppHeader({
  status,
  onReset,
  onExportHtml,
  onExportJson,
  onCopyHtml,
  onPrint,
  exportDisabled = false,
  activeOutput,
  exportError,
  recallId,
  severity,
  theme,
  onToggleTheme,
}: AppHeaderProps) {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [downloaded, setDownloaded] = useState<'html' | 'json' | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const downloadTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    try {
      await onCopyHtml();
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    copyTimerRef.current = setTimeout(() => setCopyState('idle'), 2000);
  }, [onCopyHtml]);

  const flashDownloaded = useCallback((kind: 'html' | 'json', run: () => boolean) => {
    if (!run()) return;
    if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current);
    setDownloaded(kind);
    downloadTimerRef.current = setTimeout(() => setDownloaded(null), 2000);
  }, []);

  const copyLabel =
    copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy HTML';

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.brandName}>RecallKit</span>
        <span className={styles.tagline}>Recall communication studio</span>
      </div>

      {recallId && (
        <div className={styles.meta}>
          <span className={styles.caseId}>{recallId}</span>
          {severity && (
            <span className={`${styles.severity} ${severityTone[severity]}`}>{severity}</span>
          )}
        </div>
      )}

      <div className={styles.spacer} />

      <span
        className={exportError ? styles.exportError : styles.srOnly}
        role="status"
      >
        {exportError ?? ''}
      </span>

      <StatusBadge variant={status}>{statusText[status]}</StatusBadge>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btn}
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        <button
          type="button"
          className={`${styles.btn} ${copyState === 'copied' ? styles.success : ''} ${copyState === 'failed' ? styles.failure : ''}`}
          onClick={() => void handleCopy()}
          disabled={exportDisabled}
        >
          {copyLabel}
        </button>
        <button
          type="button"
          className={`${styles.btn} ${downloaded === 'html' ? styles.success : ''}`}
          onClick={() => flashDownloaded('html', onExportHtml)}
          disabled={exportDisabled}
        >
          {downloaded === 'html' ? 'Downloaded' : 'HTML'}
        </button>
        <button
          type="button"
          className={`${styles.btn} ${downloaded === 'json' ? styles.success : ''}`}
          onClick={() => flashDownloaded('json', onExportJson)}
          disabled={exportDisabled}
        >
          {downloaded === 'json' ? 'Downloaded' : 'JSON'}
        </button>
        {activeOutput === 'document' && (
          <button
            type="button"
            className={styles.btn}
            onClick={onPrint}
            disabled={exportDisabled}
          >
            Print
          </button>
        )}
        <button type="button" className={`${styles.btn} ${styles.resetBtn}`} onClick={onReset}>
          Reset
        </button>
      </div>
    </header>
  );
}
