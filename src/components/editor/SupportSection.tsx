import type { RecallIncident } from '../../domain/recall-schema';
import type { RecallAction } from '../../domain/recall-reducer';
import type { ValidationErrors } from '../../domain/recall-validation';
import { Accordion, FormField, Input } from '../ui';
import styles from './SupportSection.module.css';

interface SupportSectionProps {
  incident: RecallIncident;
  dispatch: React.Dispatch<RecallAction>;
  errors?: ValidationErrors;
}

export function SupportSection({ incident, dispatch, errors = {} }: SupportSectionProps) {
  return (
    <Accordion title="Contact" defaultOpen={false}>
      <div className={styles.fields}>
        <FormField
          label="Verification page"
          htmlFor="field-verification-url"
          error={errors['company.verificationUrl']}
          required
        >
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

        <FormField
          label="Support phone"
          htmlFor="field-support-phone"
          error={errors['company.supportPhone']}
          required
        >
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

        <FormField
          label="Support email"
          htmlFor="field-support-email"
          error={errors['company.supportEmail']}
          required
        >
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
      </div>
    </Accordion>
  );
}
