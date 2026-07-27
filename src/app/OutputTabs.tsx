import styles from './OutputTabs.module.css';

type OutputType = 'email' | 'document' | 'page';

interface OutputTabsProps {
  activeOutput: OutputType;
  onChange: (output: OutputType) => void;
}

const tabs: { value: OutputType; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'document', label: 'Bulletin' },
  { value: 'page', label: 'Web' },
];

export function OutputTabs({ activeOutput, onChange }: OutputTabsProps) {
  return (
    <div className={styles.tablist} role="group" aria-label="Output format">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          aria-pressed={activeOutput === tab.value}
          className={`${styles.tab} ${activeOutput === tab.value ? styles.tabActive : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
