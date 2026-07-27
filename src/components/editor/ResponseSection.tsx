import type { RecallIncident } from '../../domain/recall-schema';
import type { RecallAction } from '../../domain/recall-reducer';
import type { RemedyType } from '../../domain/recall-schema';
import type { ValidationErrors } from '../../domain/recall-validation';
import { fieldError } from '../../domain/recall-validation';
import { Accordion, FormField, Input, Textarea, SegmentedControl, OrderableList } from '../ui';
import styles from './ResponseSection.module.css';

interface ResponseSectionProps {
  incident: RecallIncident;
  dispatch: React.Dispatch<RecallAction>;
  errors?: ValidationErrors;
}

const remedyOptions: { value: RemedyType; label: string }[] = [
  { value: 'refund', label: 'Refund' },
  { value: 'replacement', label: 'Replacement' },
  { value: 'repair', label: 'Repair' },
];

export function ResponseSection({ incident, dispatch, errors = {} }: ResponseSectionProps) {
  return (
    <Accordion title="Response" defaultOpen>
      <div className={styles.fields}>
        <FormField
          label="Risk headline"
          htmlFor="field-risk-headline"
          error={errors['risk.headline']}
          required
        >
          <Input
            id="field-risk-headline"
            value={incident.risk.headline}
            required
            onChange={(e) =>
              dispatch({ type: 'SET_FIELD', path: ['risk', 'headline'], value: e.target.value })
            }
          />
        </FormField>

        <FormField
          label="Risk summary"
          htmlFor="field-risk-description"
          error={errors['risk.description']}
          required
        >
          <Textarea
            id="field-risk-description"
            value={incident.risk.description}
            required
            rows={3}
            onChange={(e) =>
              dispatch({ type: 'SET_FIELD', path: ['risk', 'description'], value: e.target.value })
            }
          />
        </FormField>

        <FormField
          label="Immediate instruction"
          htmlFor="field-immediate-instruction"
          error={errors['action.immediateInstruction']}
          required
        >
          <Textarea
            id="field-immediate-instruction"
            value={incident.action.immediateInstruction}
            required
            rows={2}
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['action', 'immediateInstruction'],
                value: e.target.value,
              })
            }
          />
        </FormField>

        <FormField
          label="Customer steps"
          groupId="field-action-steps-label"
          error={fieldError(errors, 'action.steps')}
        >
          <OrderableList
            items={incident.action.steps}
            onAdd={() => dispatch({ type: 'ADD_STEP', value: '' })}
            onRemove={(index) => dispatch({ type: 'REMOVE_STEP', index })}
            onUpdate={(index, value) => dispatch({ type: 'UPDATE_STEP', index, value })}
            onReorder={(from, to) => dispatch({ type: 'REORDER_STEPS', from, to })}
            addLabel="Add step"
            placeholder="What should the customer do?"
          />
        </FormField>

        <FormField
          label="Remedy"
          groupId="field-remedy-type-label"
          error={errors['action.remedyType']}
        >
          <SegmentedControl
            value={incident.action.remedyType}
            onChange={(v) => dispatch({ type: 'SET_REMEDY_TYPE', value: v })}
            options={remedyOptions}
          />
        </FormField>

        <FormField
          label="Remedy details"
          htmlFor="field-remedy-description"
          error={errors['action.remedyDescription']}
          required
        >
          <Textarea
            id="field-remedy-description"
            value={incident.action.remedyDescription}
            required
            rows={2}
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['action', 'remedyDescription'],
                value: e.target.value,
              })
            }
          />
        </FormField>

        <FormField
          label="Return instructions"
          htmlFor="field-action-return-instructions"
          error={errors['action.returnInstructions']}
          required
        >
          <Textarea
            id="field-action-return-instructions"
            value={incident.action.returnInstructions}
            required
            rows={2}
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['action', 'returnInstructions'],
                value: e.target.value,
              })
            }
          />
        </FormField>

        <FormField
          label="Response deadline"
          htmlFor="field-response-deadline"
          error={errors['action.responseDeadline']}
        >
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
      </div>
    </Accordion>
  );
}
