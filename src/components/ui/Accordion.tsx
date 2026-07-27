import { useId, useState } from 'react';
import styles from './Accordion.module.css';

interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function Accordion({ title, defaultOpen = false, children }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className={styles.accordion}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={contentId}
      >
        <span className={styles.title}>{title}</span>
        <span className={`${styles.indicator}${open ? ` ${styles.indicatorOpen}` : ''}`} aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div id={contentId} className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
}
