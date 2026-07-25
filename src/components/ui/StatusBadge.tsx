import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  variant: 'saved' | 'unsaved' | 'error';
  children: React.ReactNode;
}

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  return (
    <span className={styles.badge}>
      <span className={`${styles.dot} ${styles[variant]}`} />
      {children}
    </span>
  );
}
