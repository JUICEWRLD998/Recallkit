import styles from './SegmentedControl.module.css';

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: SegmentedControlProps<T>) {
  return (
    <div className={styles.container} role="group">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.button}${option.value === value ? ` ${styles.active}` : ''}`}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
