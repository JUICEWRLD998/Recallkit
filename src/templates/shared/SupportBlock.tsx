import { Row, Column, ColumnLayouts, Heading, Paragraph, Button } from '@unlayer/react-elements'
import type { RecallIncident } from '../../domain/recall-schema'
import { COLORS } from './colors'

export interface SupportBlockProps {
  company: RecallIncident['company']
}

export function SupportBlock({ company }: SupportBlockProps) {
  return (
    <Row
      backgroundColor={COLORS.surface}
      layout={ColumnLayouts.OneColumn}
      padding="24px 40px"
    >
      <Column>
        <Heading
          color={COLORS.ink}
          fontSize="15px"
          fontWeight={700}
          headingType="h3"
        >
          Contact support
        </Heading>
        <Paragraph
          color={COLORS.ink}
          fontSize="14px"
        >
          {company.supportPhone}
        </Paragraph>
        <Paragraph
          color={COLORS.ink}
          fontSize="14px"
        >
          {company.supportEmail}
        </Paragraph>
        <Paragraph
          color={COLORS.ink}
          fontSize="14px"
        >
          {company.supportHours}
        </Paragraph>
        <Button
          backgroundColor={COLORS.ink}
          borderRadius="6px"
          color={COLORS.surface}
          fontSize="14px"
          fontWeight={700}
          href={company.verificationUrl}
          padding="12px 20px"
        >
          Verify your product
        </Button>
      </Column>
    </Row>
  )
}
