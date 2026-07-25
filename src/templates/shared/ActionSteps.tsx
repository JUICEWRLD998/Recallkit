import { Row, Column, ColumnLayouts, Heading, Paragraph } from '@unlayer/react-elements'
import { COLORS } from './colors'

export interface ActionStepsProps {
  immediateInstruction: string
  steps: string[]
}

export function ActionSteps({ immediateInstruction, steps }: ActionStepsProps) {
  const numberedSteps = steps.map((step, i) => `${i + 1}. ${step}`).join('<br>')

  return (
    <Row
      backgroundColor={COLORS.surface}
      layout={ColumnLayouts.OneColumn}
      padding="24px 40px"
    >
      <Column>
        <Heading
          color={COLORS.ink}
          fontSize="17px"
          fontWeight={700}
          headingType="h2"
        >
          What you need to do
        </Heading>
        <Paragraph
          color={COLORS.ink}
          fontSize="15px"
          html={`<b>${immediateInstruction}</b>`}
          lineHeight="160%"
        />
        <Paragraph
          color={COLORS.ink}
          fontSize="14px"
          html={numberedSteps}
          lineHeight="175%"
        />
      </Column>
    </Row>
  )
}
