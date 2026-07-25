import { Row, Column, ColumnLayouts, Heading } from '@unlayer/react-elements'
import type { RecallSeverity, RecallStatus } from '../../domain/recall-schema'
import { statusLabel } from '../../domain/recall-selectors'
import { COLORS, severityColor } from './colors'

export interface SeverityBannerProps {
  severity: RecallSeverity
  status: RecallStatus
}

function bannerBackground(severity: RecallSeverity): string {
  return severity === 'advisory' ? COLORS.ink : severityColor(severity)
}

function bannerText(severity: RecallSeverity): string {
  switch (severity) {
    case 'critical':
      return 'CRITICAL PRODUCT RECALL'
    case 'high':
      return 'HIGH SEVERITY PRODUCT RECALL'
    case 'advisory':
      return 'SAFETY ADVISORY'
  }
}

export function SeverityBanner({ severity, status }: SeverityBannerProps) {
  return (
    <Row
      backgroundColor={bannerBackground(severity)}
      layout={ColumnLayouts.TwoWideNarrow}
      noStackMobile
      padding="10px 40px"
    >
      <Column>
        <Heading
          color={COLORS.surface}
          fontSize="12px"
          fontWeight={700}
          headingType="h4"
        >
          {bannerText(severity)}
        </Heading>
      </Column>
      <Column>
        <Heading
          color={COLORS.surface}
          fontSize="12px"
          fontWeight={700}
          headingType="h4"
          textAlign="right"
        >
          {statusLabel(status).toUpperCase()}
        </Heading>
      </Column>
    </Row>
  )
}
