import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  variant: 'saved' | 'unsaved' | 'error';
  children: React.ReactNode;
}

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${variant === 'error' ? styles.badgeError : ''}`}>
      <span className={`${styles.dot} ${styles[variant]}`} />
      <span className={styles.text}>{children}</span>
    </span>
  );
}
