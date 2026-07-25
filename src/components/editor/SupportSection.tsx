import type { RecallIncident } from '../../domain/recall-schema';
import type { RecallAction } from '../../domain/recall-reducer';
import { Accordion, FormField, Input, Textarea } from '../ui';
import styles from './SupportSection.module.css';

interface SupportSectionProps {
  incident: RecallIncident;
  dispatch: React.Dispatch<RecallAction>;
}

export function SupportSection({ incident, dispatch }: SupportSectionProps) {
  return (
    <Accordion title="Support" defaultOpen={false}>
      <div className={styles.fields}>
        <FormField label="Verification URL" htmlFor="field-verification-url" required>
          <Input
            id="field-verification-url"
            type="url"
            value={incident.company.verificationUrl}
            required
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['company', 'verificationUrl'],
                value: e.target.value,
              })
            }
          />
        </FormField>

        <FormField label="Support phone" htmlFor="field-support-phone" required>
          <Input
            id="field-support-phone"
            type="tel"
            value={incident.company.supportPhone}
            required
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['company', 'supportPhone'],
                value: e.target.value,
              })
            }
          />
        </FormField>

        <FormField label="Support email" htmlFor="field-support-email" required>
          <Input
            id="field-support-email"
            type="email"
            value={incident.company.supportEmail}
            required
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['company', 'supportEmail'],
                value: e.target.value,
              })
            }
          />
        </FormField>

        <FormField label="Support hours" htmlFor="field-support-hours" required>
          <Input
            id="field-support-hours"
            value={incident.company.supportHours}
            required
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['company', 'supportHours'],
                value: e.target.value,
              })
            }
          />
        </FormField>

        <FormField label="Return instructions" htmlFor="field-company-return-instructions" required>
          <Textarea
            id="field-company-return-instructions"
            value={incident.company.returnInstructions}
            required
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                path: ['company', 'returnInstructions'],
                value: e.target.value,
              })
            }
          />
        </FormField>
      </div>
    </Accordion>
  );
}
