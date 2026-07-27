import styles from './RepeatableList.module.css';

interface RepeatableListProps {
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
  addLabel: string;
  placeholder?: string;
  minItems?: number;
}

export function RepeatableList({
  items,
  onAdd,
  onRemove,
  onUpdate,
  addLabel,
  placeholder,
  minItems = 1,
}: RepeatableListProps) {
  return (
    <div className={styles.plate}>
      {items.map((item, index) => (
        <div key={index} className={styles.row}>
          <span className={styles.rowIndex} aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <input
            className={styles.plateInput}
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={placeholder}
            aria-label={`Batch ${index + 1}`}
            spellCheck={false}
            autoComplete="off"
          />
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => onRemove(index)}
            disabled={items.length <= minItems}
            aria-label={`Remove batch ${index + 1}`}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" className={styles.addButton} onClick={onAdd}>
        {addLabel}
      </button>
    </div>
  );
}
