import { useRef } from 'react';
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
  itemLabel?: string;
  minItems?: number;
}

export function OrderableList({
  items,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
  addLabel,
  placeholder,
  itemLabel = 'Step',
  minItems = 1,
}: OrderableListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Keep keyboard focus on the moved row after a reorder re-render.
  const moveAndFollow = (from: number, to: number, action: 'up' | 'down') => {
    onReorder(from, to);
    requestAnimationFrame(() => {
      const row = listRef.current?.querySelectorAll<HTMLElement>(`.${styles.row}`)[to];
      const buttons = row?.querySelectorAll<HTMLButtonElement>('button');
      if (!buttons?.length) return;
      const preferred = action === 'up' ? buttons[0] : buttons[1];
      const fallback = action === 'up' ? buttons[1] : buttons[0];
      (preferred.disabled ? fallback : preferred).focus();
    });
  };

  return (
    <div ref={listRef} className={styles.list}>
      {items.map((item, index) => (
        <div key={index} className={styles.row}>
          <span className={styles.step}>{index + 1}</span>
          <Input
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={placeholder}
            aria-label={`${itemLabel} ${index + 1}`}
          />
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.reorderButton}
              onClick={() => moveAndFollow(index, index - 1, 'up')}
              disabled={index === 0}
              aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} up`}
              title="Move up"
            >
              <ChevronUp size={16} />
            </button>
            <button
              type="button"
              className={styles.reorderButton}
              onClick={() => moveAndFollow(index, index + 1, 'down')}
              disabled={index === items.length - 1}
              aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} down`}
              title="Move down"
            >
              <ChevronDown size={16} />
            </button>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => onRemove(index)}
              disabled={items.length <= minItems}
              aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}
              title="Remove"
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
