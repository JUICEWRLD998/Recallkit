import { useMemo } from 'react';
import type { RecallIncident } from '../../domain/recall-schema';
import type { RecallAction } from '../../domain/recall-reducer';
import { validateIncident } from '../../domain/recall-validation';
import { IncidentSection } from './IncidentSection';
import { ThemeSection } from './ThemeSection';
import { ProductSection } from './ProductSection';
import { ResponseSection } from './ResponseSection';
import { SupportSection } from './SupportSection';
import styles from './EditorPanel.module.css';

interface EditorPanelProps {
  incident: RecallIncident;
  dispatch: React.Dispatch<RecallAction>;
}

export function EditorPanel({ incident, dispatch }: EditorPanelProps) {
  const errors = useMemo(() => validateIncident(incident), [incident]);

  return (
    <div className={styles.panel}>
      <p className={styles.intro}>
        Edit once — preview updates across email, bulletin, and web notice.
      </p>
      <IncidentSection incident={incident} dispatch={dispatch} errors={errors} />
      <ThemeSection incident={incident} dispatch={dispatch} />
      <ProductSection incident={incident} dispatch={dispatch} errors={errors} />
      <ResponseSection incident={incident} dispatch={dispatch} errors={errors} />
      <SupportSection incident={incident} dispatch={dispatch} errors={errors} />
    </div>
  );
}
