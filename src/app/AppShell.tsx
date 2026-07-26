import { useState } from 'react';
import styles from './AppShell.module.css';

interface AppShellProps {
  sidebar: React.ReactNode;
  preview: React.ReactNode;
  header: React.ReactNode;
}

export function AppShell({ sidebar, preview, header }: AppShellProps) {
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');

  return (
    <div className={styles.shell}>
      {header}
      <div className={styles.viewSwitcher} role="group" aria-label="View switcher">
        <button
          type="button"
          aria-pressed={activeView === 'editor'}
          className={`${styles.viewTab} ${activeView === 'editor' ? styles.viewTabActive : ''}`}
          onClick={() => setActiveView('editor')}
        >
          Editor
        </button>
        <button
          type="button"
          aria-pressed={activeView === 'preview'}
          className={`${styles.viewTab} ${activeView === 'preview' ? styles.viewTabActive : ''}`}
          onClick={() => setActiveView('preview')}
        >
          Preview
        </button>
      </div>
      <div className={styles.body}>
        <div className={`${styles.sidebar} ${activeView === 'preview' ? styles.hidden : ''}`}>
          {sidebar}
        </div>
        <div className={`${styles.preview} ${activeView === 'editor' ? styles.hidden : ''}`}>
          {preview}
        </div>
      </div>
    </div>
  );
}
