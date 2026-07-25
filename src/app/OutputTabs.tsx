import styles from './OutputTabs.module.css';

type OutputType = 'email' | 'document' | 'page';

interface OutputTabsProps {
  activeOutput: OutputType;
  onChange: (output: OutputType) => void;
}

const tabs: { value: OutputType; label: string }[] = [
  { value: 'email', label: 'Customer Email' },
  { value: 'document', label: 'Retailer Bulletin' },
  { value: 'page', label: 'Public Notice' },
];

export function OutputTabs({ activeOutput, onChange }: OutputTabsProps) {
  return (
    <div className={styles.tablist} role="tablist" aria-label="Output format">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={activeOutput === tab.value}
          className={`${styles.tab} ${activeOutput === tab.value ? styles.tabActive : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
