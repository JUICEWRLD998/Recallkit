import { RotateCcw, Download, FileText, Briefcase, Printer } from 'lucide-react';
import { StatusBadge } from '../components/ui';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  status: 'saved' | 'unsaved' | 'error';
  onReset: () => void;
  onExportHtml: () => void;
  onExportJson: () => void;
  onExportCase: () => void;
  onPrint: () => void;
  activeOutput: string;
}

const statusText: Record<AppHeaderProps['status'], string> = {
  saved: 'Saved',
  unsaved: 'Unsaved changes',
  error: 'Save error',
};

export function AppHeader({
  status,
  onReset,
  onExportHtml,
  onExportJson,
  onExportCase,
  onPrint,
  activeOutput,
}: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.mark} aria-hidden="true">RK</div>
        <span className={styles.brandName}>RecallKit</span>
      </div>
      <StatusBadge variant={status}>{statusText[status]}</StatusBadge>
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
