import { Trash2, Plus } from 'lucide-react';
import { Input } from './Input';
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
    <div className={styles.list}>
      {items.map((item, index) => (
        <div key={index} className={styles.row}>
          <Input
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={placeholder}
          />
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => onRemove(index)}
            disabled={items.length <= minItems}
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button type="button" className={styles.addButton} onClick={onAdd}>
        <Plus size={16} />
        {addLabel}
      </button>
    </div>
  );
}
