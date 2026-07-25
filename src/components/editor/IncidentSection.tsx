import type { RecallIncident } from '../../domain/recall-schema';
import type { RecallAction } from '../../domain/recall-reducer';
import type { RecallSeverity, RecallStatus } from '../../domain/recall-schema';
import { Accordion, FormField, Input, SegmentedControl } from '../ui';
import styles from './IncidentSection.module.css';

interface IncidentSectionProps {
  incident: RecallIncident;
  dispatch: React.Dispatch<RecallAction>;
}

const severityOptions: { value: RecallSeverity; label: string }[] = [
  { value: 'critical', label: 'critical' },
  { value: 'high', label: 'high' },
  { value: 'advisory', label: 'advisory' },
];

const statusOptions: { value: RecallStatus; label: string }[] = [
  { value: 'active', label: 'active' },
  { value: 'updated', label: 'updated' },
  { value: 'resolved', label: 'resolved' },
];

export function IncidentSection({ incident, dispatch }: IncidentSectionProps) {
  return (
    <Accordion title="Incident" defaultOpen>
      <div className={styles.fields}>
        <FormField label="Recall title" htmlFor="field-recall-title" required>
          <Input
            id="field-recall-title"
            value={incident.title}
            required
            onChange={(e) =>
              dispatch({ type: 'SET_FIELD', path: ['title'], value: e.target.value })
            }
          />
        </FormField>

        <FormField label="Recall ID" htmlFor="field-recall-id" required>
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

        <FormField label="Announcement date" htmlFor="field-announced-at" required>
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

        <FormField label="Severity" htmlFor="field-severity">
          <SegmentedControl
            value={incident.severity}
            onChange={(v) => dispatch({ type: 'SET_SEVERITY', value: v })}
            options={severityOptions}
          />
        </FormField>

        <FormField label="Status" htmlFor="field-status">
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
