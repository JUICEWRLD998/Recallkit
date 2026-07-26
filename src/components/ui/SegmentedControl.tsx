import styles from './SegmentedControl.module.css';

type Tone = 'critical' | 'warning' | 'safe' | 'neutral';

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; tone?: Tone }[];
}

const toneClass: Record<Tone, string> = {
  critical: 'toneCritical',
  warning: 'toneWarning',
  safe: 'toneSafe',
  neutral: 'toneNeutral',
};

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
          className={`${styles.button}${option.value === value ? ` ${styles.active}` : ''}${option.tone ? ` ${styles[toneClass[option.tone]]}` : ''}`}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.tone && <span className={styles.toneDot} aria-hidden="true" />}
          {option.label}
        </button>
      ))}
    </div>
  );
}
