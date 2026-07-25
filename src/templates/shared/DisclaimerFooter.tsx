import { Row, Column, ColumnLayouts, Paragraph } from '@unlayer/react-elements'
import { formatDate } from '../../domain/recall-selectors'
import { COLORS } from './colors'

export interface DisclaimerFooterProps {
  updatedAt: string
}

export function DisclaimerFooter({ updatedAt }: DisclaimerFooterProps) {
  return (
    <Row
      backgroundColor={COLORS.paper}
      layout={ColumnLayouts.OneColumn}
      padding="20px 40px"
    >
      <Column>
        <Paragraph
          color={COLORS.muted}
          fontSize="12px"
          lineHeight="160%"
        >
          This is a fictional recall scenario created for demonstration purposes. No real products, companies, or safety incidents are represented.
        </Paragraph>
        <Paragraph
          color={COLORS.muted}
          fontSize="12px"
          lineHeight="160%"
        >
          {`Last updated: ${formatDate(updatedAt)}`}
        </Paragraph>
      </Column>
    </Row>
  )
}
