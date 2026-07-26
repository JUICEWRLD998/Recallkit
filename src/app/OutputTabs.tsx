import { Mail, FileText, Globe } from 'lucide-react';
import styles from './OutputTabs.module.css';

type OutputType = 'email' | 'document' | 'page';

interface OutputTabsProps {
  activeOutput: OutputType;
  onChange: (output: OutputType) => void;
}

const tabs: { value: OutputType; label: string; icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }> }[] = [
  { value: 'email', label: 'Customer Email', icon: Mail },
  { value: 'document', label: 'Retailer Bulletin', icon: FileText },
  { value: 'page', label: 'Public Notice', icon: Globe },
];

export function OutputTabs({ activeOutput, onChange }: OutputTabsProps) {
  return (
    <div className={styles.tablist} role="tablist" aria-label="Output format">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={activeOutput === tab.value}
            className={`${styles.tab} ${activeOutput === tab.value ? styles.tabActive : ''}`}
            onClick={() => onChange(tab.value)}
          >
            <Icon size={15} aria-hidden />
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
