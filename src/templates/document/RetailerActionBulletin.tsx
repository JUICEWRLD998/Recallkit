import { Document } from '@unlayer/react-elements'
import type { RecallIncident } from '../../domain/recall-schema'
import {
  COLORS,
  SeverityBanner,
  ProductIdentity,
  BatchPanel,
  ActionSteps,
  RemedyInfo,
  SupportBlock,
  DisclaimerFooter,
} from '../shared'

export interface RetailerActionBulletinProps {
  incident: RecallIncident
}

export function RetailerActionBulletin({ incident }: RetailerActionBulletinProps) {
  return (
    <Document
      backgroundColor={COLORS.paper}
      contentWidth="760px"
      fontFamily={{ label: 'Arial', value: 'Arial, Helvetica, sans-serif' }}
      textColor={COLORS.ink}
    >
      <SeverityBanner severity={incident.severity} status={incident.status} />
      <ProductIdentity product={incident.product} company={incident.company} />
      <BatchPanel batches={incident.product.affectedBatches} recallId={incident.id} model={incident.product.model} />
      <ActionSteps immediateInstruction={incident.action.immediateInstruction} steps={incident.action.steps} />
      <RemedyInfo action={incident.action} />
      <SupportBlock company={incident.company} />
      <DisclaimerFooter updatedAt={incident.updatedAt} />
    </Document>
  )
}
