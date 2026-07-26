import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';
import { Input } from './Input';
import styles from './OrderableList.module.css';

interface OrderableListProps {
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
  onReorder: (from: number, to: number) => void;
  addLabel: string;
  placeholder?: string;
}

export function OrderableList({
  items,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
  addLabel,
  placeholder,
}: OrderableListProps) {
  return (
    <div className={styles.list}>
      {items.map((item, index) => (
        <div key={index} className={styles.row}>
          <span className={styles.step}>{index + 1}</span>
          <Input
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={placeholder}
          />
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.reorderButton}
              onClick={() => onReorder(index, index - 1)}
              disabled={index === 0}
              aria-label="Move up"
            >
              <ChevronUp size={16} />
            </button>
            <button
              type="button"
              className={styles.reorderButton}
              onClick={() => onReorder(index, index + 1)}
              disabled={index === items.length - 1}
              aria-label="Move down"
            >
              <ChevronDown size={16} />
            </button>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => onRemove(index)}
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addButton} onClick={onAdd}>
        <Plus size={16} />
        {addLabel}
      </button>
    </div>
  );
}
