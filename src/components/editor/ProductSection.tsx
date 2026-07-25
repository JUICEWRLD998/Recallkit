import type { RecallIncident } from '../../domain/recall-schema';
import type { RecallAction } from '../../domain/recall-reducer';
import { Accordion, FormField, Input, RepeatableList } from '../ui';
import styles from './ProductSection.module.css';

interface ProductSectionProps {
  incident: RecallIncident;
  dispatch: React.Dispatch<RecallAction>;
}

export function ProductSection({ incident, dispatch }: ProductSectionProps) {
  return (
    <Accordion title="Product" defaultOpen>
      <div className={styles.fields}>
        <FormField label="Company name" htmlFor="field-company-name" required>
          <Input
            id="field-company-name"
            value={incident.company.name}
            required
            onChange={(e) =>
              dispatch({ type: 'SET_FIELD', path: ['company', 'name'], value: e.target.value })
            }
          />
        </FormField>

        <FormField label="Product name" htmlFor="field-product-name" required>
          <Input
            id="field-product-name"
            value={incident.product.name}
            required
            onChange={(e) =>
              dispatch({ type: 'SET_FIELD', path: ['product', 'name'], value: e.target.value })
            }
          />
        </FormField>

        <FormField label="Model" htmlFor="field-product-model" required>
          <Input
            id="field-product-model"
            value={incident.product.model}
            required
            onChange={(e) =>
              dispatch({ type: 'SET_FIELD', path: ['product', 'model'], value: e.target.value })
            }
          />
        </FormField>

        <FormField label="Product image URL" htmlFor="field-product-image-url">
          <Input
            id="field-product-image-url"
            value={incident.product.imageUrl}
            onChange={(e) =>
              dispatch({ type: 'SET_FIELD', path: ['product', 'imageUrl'], value: e.target.value })
            }
          />
        </FormField>

        <FormField label="Affected batches" htmlFor="field-affected-batches">
          <RepeatableList
            items={incident.product.affectedBatches}
            onAdd={() => dispatch({ type: 'ADD_BATCH', value: '' })}
            onRemove={(index) => dispatch({ type: 'REMOVE_BATCH', index })}
            onUpdate={(index, value) => dispatch({ type: 'UPDATE_BATCH', index, value })}
            addLabel="Add batch"
            placeholder="e.g. A20-2604-17"
            minItems={1}
          />
        </FormField>
      </div>
    </Accordion>
  );
}
