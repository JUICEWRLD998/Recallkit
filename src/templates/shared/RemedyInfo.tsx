import { Row, Column, ColumnLayouts, Heading, Paragraph } from '@unlayer/react-elements'
import type { RecallIncident } from '../../domain/recall-schema'
import { remedyLabel, formatDate, hasDeadline } from '../../domain/recall-selectors'
import { COLORS } from './colors'

export interface RemedyInfoProps {
  action: RecallIncident['action']
}

export function RemedyInfo({ action }: RemedyInfoProps) {
  return (
    <Row
      backgroundColor={COLORS.surface}
      layout={ColumnLayouts.OneColumn}
      padding="20px 40px"
    >
      <Column>
        <Heading
          color={COLORS.ink}
          fontSize="15px"
          fontWeight={700}
          headingType="h3"
        >
          {`${remedyLabel(action.remedyType)} available`}
        </Heading>
        <Paragraph
          color={COLORS.ink}
          fontSize="14px"
          lineHeight="160%"
        >
          {action.remedyDescription}
        </Paragraph>
        {hasDeadline(action) && (
          <Paragraph
            color={COLORS.muted}
            fontSize="13px"
          >
            {`Respond by ${formatDate(action.responseDeadline!)}`}
          </Paragraph>
        )}
      </Column>
    </Row>
  )
}
