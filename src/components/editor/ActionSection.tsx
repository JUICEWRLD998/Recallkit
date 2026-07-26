import type { RecallIncident } from '../../domain/recall-schema';
import type { RecallAction } from '../../domain/recall-reducer';
import type { RemedyType } from '../../domain/recall-schema';
import { Accordion, FormField, Input, Textarea, SegmentedControl, OrderableList } from '../ui';
import styles from './ActionSection.module.css';

interface ActionSectionProps {
  incident: RecallIncident;
  dispatch: React.Dispatch<RecallAction>;
}

const remedyOptions: { value: RemedyType; label: string }[] = [
  { value: 'refund', label: 'Refund' },
  { value: 'replacement', label: 'Replacement' },
  { value: 'repair', label: 'Repair' },
];

export function ActionSection({ incident, dispatch }: ActionSectionProps) {
  return (
    <Accordion title="Customer Action" defaultOpen={false}>
      <div className={styles.fields}>
        <FormField label="Immediate instruction" htmlFor="field-immediate-instruction" required>
          <Textarea
            id="field-immediate-instruction"
            value={incident.action.immediateInstruction}
            required
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['action', 'immediateInstruction'],
                value: e.target.value,
              })
            }
          />
        </FormField>

        <FormField label="Action steps" htmlFor="field-action-steps">
          <OrderableList
            items={incident.action.steps}
            onAdd={() => dispatch({ type: 'ADD_STEP', value: '' })}
            onRemove={(index) => dispatch({ type: 'REMOVE_STEP', index })}
            onUpdate={(index, value) => dispatch({ type: 'UPDATE_STEP', index, value })}
            onReorder={(from, to) => dispatch({ type: 'REORDER_STEPS', from, to })}
            addLabel="Add step"
            placeholder="Describe this step"
          />
        </FormField>

        <FormField label="Remedy type" htmlFor="field-remedy-type">
          <SegmentedControl
            value={incident.action.remedyType}
            onChange={(v) => dispatch({ type: 'SET_REMEDY_TYPE', value: v })}
            options={remedyOptions}
          />
        </FormField>

        <FormField label="Remedy description" htmlFor="field-remedy-description" required>
          <Textarea
            id="field-remedy-description"
            value={incident.action.remedyDescription}
            required
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['action', 'remedyDescription'],
                value: e.target.value,
              })
            }
          />
        </FormField>

        <FormField label="Response deadline" htmlFor="field-response-deadline">
          <Input
            id="field-response-deadline"
            type="date"
            value={incident.action.responseDeadline ? incident.action.responseDeadline.slice(0, 10) : ''}
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['action', 'responseDeadline'],
                value: e.target.value === '' ? undefined : e.target.value + 'T00:00:00',
              })
            }
          />
        </FormField>

        <FormField label="Return instructions" htmlFor="field-action-return-instructions" required>
          <Textarea
            id="field-action-return-instructions"
            value={incident.action.returnInstructions}
            required
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['action', 'returnInstructions'],
                value: e.target.value,
              })
            }
          />
        </FormField>
      </div>
    </Accordion>
  );
}
