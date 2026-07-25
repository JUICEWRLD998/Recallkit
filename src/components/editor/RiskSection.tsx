import type { RecallIncident } from '../../domain/recall-schema';
import type { RecallAction } from '../../domain/recall-reducer';
import { Accordion, FormField, Input, Textarea } from '../ui';
import styles from './RiskSection.module.css';

interface RiskSectionProps {
  incident: RecallIncident;
  dispatch: React.Dispatch<RecallAction>;
}

export function RiskSection({ incident, dispatch }: RiskSectionProps) {
  return (
    <Accordion title="Risk" defaultOpen>
      <div className={styles.fields}>
        <FormField label="Risk headline" htmlFor="field-risk-headline" required>
          <Input
            id="field-risk-headline"
            value={incident.risk.headline}
            required
            onChange={(e) =>
              dispatch({ type: 'SET_FIELD', path: ['risk', 'headline'], value: e.target.value })
            }
          />
        </FormField>

        <FormField label="Risk description" htmlFor="field-risk-description" required>
          <Textarea
            id="field-risk-description"
            value={incident.risk.description}
            required
            onChange={(e) =>
              dispatch({ type: 'SET_FIELD', path: ['risk', 'description'], value: e.target.value })
            }
          />
        </FormField>

        <FormField label="Reported incidents" htmlFor="field-reported-incidents">
          <Input
            id="field-reported-incidents"
            type="number"
            min={0}
            value={incident.risk.reportedIncidents ?? ''}
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['risk', 'reportedIncidents'],
                value: e.target.value === '' ? undefined : Number(e.target.value),
              })
            }
          />
        </FormField>

        <FormField label="Reported injuries" htmlFor="field-reported-injuries">
          <Input
            id="field-reported-injuries"
            type="number"
            min={0}
            value={incident.risk.reportedInjuries ?? ''}
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['risk', 'reportedInjuries'],
                value: e.target.value === '' ? undefined : Number(e.target.value),
              })
            }
          />
        </FormField>
      </div>
    </Accordion>
  );
}
