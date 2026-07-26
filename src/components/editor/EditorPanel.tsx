import { useMemo } from 'react';
import type { RecallIncident } from '../../domain/recall-schema';
import type { RecallAction } from '../../domain/recall-reducer';
import { validateIncident } from '../../domain/recall-validation';
import { IncidentSection } from './IncidentSection';
import { ProductSection } from './ProductSection';
import { RiskSection } from './RiskSection';
import { ActionSection } from './ActionSection';
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
      <IncidentSection incident={incident} dispatch={dispatch} errors={errors} />
      <ProductSection incident={incident} dispatch={dispatch} errors={errors} />
      <RiskSection incident={incident} dispatch={dispatch} errors={errors} />
      <ActionSection incident={incident} dispatch={dispatch} errors={errors} />
      <SupportSection incident={incident} dispatch={dispatch} errors={errors} />
    </div>
  );
}
