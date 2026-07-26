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
import type { RecallSeverity } from '../domain/recall-schema';
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
  exportDisabled?: boolean;
  activeOutput: string;
  exportError?: string | null;
  recallId?: string;
  severity?: RecallSeverity;
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
  onExportCase,
  onCopyHtml,
  onPrint,
  exportDisabled = false,
  activeOutput,
  exportError,
  recallId,
  severity,
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
      {recallId && (
        <>
          <div className={styles.rule} aria-hidden="true" />
          <div className={styles.casePlate}>
            <span className={styles.caseLabel}>Recall case</span>
            <span className={styles.caseId} title={recallId}>{recallId}</span>
          </div>
          {severity && (
            <span className={`${styles.severityChip} ${severityTone[severity]}`}>
              <span className={styles.severityDot} aria-hidden="true" />
              {severity}
            </span>
          )}
        </>
      )}
      <div className={styles.spacer} />
      {exportError && (
        <span className={styles.exportError} role="status">
          {exportError}
        </span>
      )}
      <StatusBadge variant={status}>{statusText[status]}</StatusBadge>
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.copyBtn} ${copyState === 'copied' ? styles.copySuccess : ''} ${copyState === 'failed' ? styles.copyFailure : ''}`}
          onClick={() => void handleCopy()}
          disabled={exportDisabled}
          aria-label={copyLabel[copyState]}
          title={exportDisabled ? 'Fix invalid fields to enable export' : 'Copy HTML'}
        >
          <CopyIcon size={15} aria-hidden="true" />
          <span className={styles.btnLabel}>{copyText[copyState]}</span>
        </button>
        <span className={styles.srOnly} aria-live="polite">
          {copyState === 'idle' ? '' : copyLabel[copyState]}
        </span>
        <button
          type="button"
          className={styles.btn}
          onClick={onExportHtml}
          disabled={exportDisabled}
          aria-label="Download HTML"
          title={exportDisabled ? 'Fix invalid fields to enable export' : 'Download HTML'}
        >
          <Download size={15} aria-hidden="true" />
          <span className={styles.btnLabel}>HTML</span>
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={onExportJson}
          disabled={exportDisabled}
          aria-label="Download JSON"
          title={exportDisabled ? 'Fix invalid fields to enable export' : 'Download JSON'}
        >
          <FileText size={15} aria-hidden="true" />
          <span className={styles.btnLabel}>JSON</span>
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={onExportCase}
          disabled={exportDisabled}
          aria-label="Export Case"
          title={exportDisabled ? 'Fix invalid fields to enable export' : 'Export Case'}
        >
          <Briefcase size={15} aria-hidden="true" />
          <span className={styles.btnLabel}>Case</span>
        </button>
        {activeOutput === 'document' && (
          <button
            type="button"
            className={styles.btn}
            onClick={onPrint}
            disabled={exportDisabled}
            aria-label="Print"
            title={exportDisabled ? 'Fix invalid fields to enable export' : 'Print'}
          >
            <Printer size={15} aria-hidden="true" />
            <span className={styles.btnLabel}>Print</span>
          </button>
        )}
        <div className={styles.actionRule} aria-hidden="true" />
        <button
          type="button"
          className={`${styles.btn} ${styles.resetBtn}`}
          onClick={onReset}
          aria-label="Reset to sample"
          title="Reset to sample"
        >
          <RotateCcw size={15} aria-hidden="true" />
          <span className={styles.btnLabel}>Reset</span>
        </button>
      </div>
    </header>
  );
}
