import type { RecallIncident } from '../../domain/recall-schema';
import type { RecallAction } from '../../domain/recall-reducer';
import type { RecallSeverity, RecallStatus } from '../../domain/recall-schema';
import type { ValidationErrors } from '../../domain/recall-validation';
import { Accordion, FormField, Input, SegmentedControl } from '../ui';
import styles from './IncidentSection.module.css';

interface IncidentSectionProps {
  incident: RecallIncident;
  dispatch: React.Dispatch<RecallAction>;
  errors?: ValidationErrors;
}

const severityOptions: { value: RecallSeverity; label: string; tone: 'critical' | 'warning' | 'neutral' }[] = [
  { value: 'critical', label: 'Critical', tone: 'critical' },
  { value: 'high', label: 'High', tone: 'warning' },
  { value: 'advisory', label: 'Advisory', tone: 'neutral' },
];

const statusOptions: { value: RecallStatus; label: string; tone: 'critical' | 'warning' | 'safe' }[] = [
  { value: 'active', label: 'Active', tone: 'critical' },
  { value: 'updated', label: 'Updated', tone: 'warning' },
  { value: 'resolved', label: 'Resolved', tone: 'safe' },
];

export function IncidentSection({ incident, dispatch, errors = {} }: IncidentSectionProps) {
  return (
    <Accordion title="Incident" defaultOpen>
      <div className={styles.fields}>
        <FormField label="Recall title" htmlFor="field-recall-title" error={errors['title']} required>
          <Input
            id="field-recall-title"
            value={incident.title}
            required
            onChange={(e) =>
              dispatch({ type: 'SET_FIELD', path: ['title'], value: e.target.value })
            }
          />
        </FormField>

        <FormField label="Recall ID" htmlFor="field-recall-id" error={errors['id']} required>
          <Input
            id="field-recall-id"
            className={styles.monoInput}
            value={incident.id}
            required
            onChange={(e) =>
              dispatch({ type: 'SET_FIELD', path: ['id'], value: e.target.value })
            }
          />
        </FormField>

        <FormField
          label="Announcement date"
          htmlFor="field-announced-at"
          error={errors['announcedAt']}
          required
        >
          <Input
            id="field-announced-at"
            type="date"
            value={incident.announcedAt.slice(0, 10)}
            required
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['announcedAt'],
                value: e.target.value + 'T00:00:00',
              })
            }
          />
        </FormField>

        <FormField label="Severity" groupId="field-severity-label" error={errors['severity']}>
          <SegmentedControl
            value={incident.severity}
            onChange={(v) => dispatch({ type: 'SET_SEVERITY', value: v })}
            options={severityOptions}
          />
        </FormField>

        <FormField label="Status" groupId="field-status-label" error={errors['status']}>
          <SegmentedControl
            value={incident.status}
            onChange={(v) => dispatch({ type: 'SET_STATUS', value: v })}
            options={statusOptions}
          />
        </FormField>
      </div>
    </Accordion>
  );
}
