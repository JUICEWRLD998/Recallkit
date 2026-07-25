import { Row, Column, ColumnLayouts, Heading, Paragraph } from '@unlayer/react-elements'
import { COLORS } from './colors'

export interface BatchPanelProps {
  batches: string[]
  recallId: string
  model: string
}

export function BatchPanel({ batches, recallId, model }: BatchPanelProps) {
  return (
    <Row
      backgroundColor={COLORS.surface}
      layout={ColumnLayouts.OneColumn}
      padding="12px 40px"
    >
      <Column
        backgroundColor={COLORS.ink}
        borderRadius="6px"
        padding="18px 20px"
      >
        <Heading
          color={COLORS.surface}
          fontSize="11px"
          fontWeight={700}
          headingType="h4"
        >
          AFFECTED BATCH IDENTIFIERS
        </Heading>
        <Heading
          color={COLORS.surface}
          fontSize="22px"
          fontWeight={700}
          headingType="h2"
          html={batches.join('<br>')}
        />
        <Paragraph
          color="#C9D0CE"
          fontSize="12px"
          html={`Model ${model} / Recall ${recallId}`}
          lineHeight="145%"
        />
      </Column>
    </Row>
  )
}
