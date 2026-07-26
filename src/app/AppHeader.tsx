import { useCallback, useEffect, useRef, useState } from 'react';
import {
  RotateCcw,
  Download,
  FileText,
  Briefcase,
  Printer,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { StatusBadge } from '../components/ui';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  status: 'saved' | 'unsaved' | 'error';
  onReset: () => void;
  onExportHtml: () => void;
  onExportJson: () => void;
  onExportCase: () => void;
  onCopyHtml: () => Promise<void>;
  onPrint: () => void;
  activeOutput: string;
  exportError?: string | null;
}

const statusText: Record<AppHeaderProps['status'], string> = {
  saved: 'Saved',
  unsaved: 'Unsaved changes',
  error: 'Save error',
};

type CopyState = 'idle' | 'copied' | 'failed';

const copyText: Record<CopyState, string> = {
  idle: 'Copy',
  copied: 'Copied',
  failed: 'Failed',
};

const copyLabel: Record<CopyState, string> = {
  idle: 'Copy HTML',
  copied: 'HTML copied to clipboard',
  failed: 'Copy to clipboard failed',
};

export function AppHeader({
  status,
  onReset,
  onExportHtml,
  onExportJson,
  onExportCase,
  onCopyHtml,
  onPrint,
  activeOutput,
  exportError,
}: AppHeaderProps) {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
    }
    try {
      await onCopyHtml();
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    copyTimerRef.current = setTimeout(() => setCopyState('idle'), 2000);
  }, [onCopyHtml]);

  const CopyIcon =
    copyState === 'copied' ? Check : copyState === 'failed' ? AlertTriangle : Copy;

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.mark} aria-hidden="true">RK</div>
        <span className={styles.brandName}>RecallKit</span>
      </div>
      <StatusBadge variant={status}>{statusText[status]}</StatusBadge>
      {exportError && (
        <span className={styles.exportError} role="status">
          {exportError}
        </span>
      )}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btn}
          onClick={onReset}
          aria-label="Reset"
          title="Reset"
        >
          <RotateCcw size={16} aria-hidden="true" />
          <span className={styles.btnLabel}>Reset</span>
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.copyBtn} ${copyState === 'copied' ? styles.copySuccess : ''} ${copyState === 'failed' ? styles.copyFailure : ''}`}
          onClick={() => void handleCopy()}
          aria-label={copyLabel[copyState]}
          title="Copy HTML"
        >
          <CopyIcon size={16} aria-hidden="true" />
          <span className={styles.btnLabel}>{copyText[copyState]}</span>
        </button>
        <span className={styles.srOnly} aria-live="polite">
          {copyState === 'idle' ? '' : copyLabel[copyState]}
        </span>
        <button
          type="button"
          className={styles.btn}
          onClick={onExportHtml}
          aria-label="Download HTML"
          title="Download HTML"
        >
          <Download size={16} aria-hidden="true" />
          <span className={styles.btnLabel}>HTML</span>
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={onExportJson}
          aria-label="Download JSON"
          title="Download JSON"
        >
          <FileText size={16} aria-hidden="true" />
          <span className={styles.btnLabel}>JSON</span>
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={onExportCase}
          aria-label="Export Case"
          title="Export Case"
        >
          <Briefcase size={16} aria-hidden="true" />
          <span className={styles.btnLabel}>Case</span>
        </button>
        {activeOutput === 'document' && (
          <button
            type="button"
            className={styles.btn}
            onClick={onPrint}
            aria-label="Print"
            title="Print"
          >
            <Printer size={16} aria-hidden="true" />
            <span className={styles.btnLabel}>Print</span>
          </button>
        )}
      </div>
    </header>
  );
}
