import type { RecallIncident } from '../../domain/recall-schema';
import type { RecallAction } from '../../domain/recall-reducer';
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
  return (
    <div className={styles.panel}>
      <IncidentSection incident={incident} dispatch={dispatch} />
      <ProductSection incident={incident} dispatch={dispatch} />
      <RiskSection incident={incident} dispatch={dispatch} />
      <ActionSection incident={incident} dispatch={dispatch} />
      <SupportSection incident={incident} dispatch={dispatch} />
    </div>
  );
}
