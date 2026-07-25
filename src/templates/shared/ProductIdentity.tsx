import { Row, Column, ColumnLayouts, Heading, Paragraph } from '@unlayer/react-elements'
import type { RecallIncident } from '../../domain/recall-schema'
import { COLORS } from './colors'

export interface ProductIdentityProps {
  product: RecallIncident['product']
  company: RecallIncident['company']
}

export function ProductIdentity({ product, company }: ProductIdentityProps) {
  return (
    <Row
      backgroundColor={COLORS.surface}
      layout={ColumnLayouts.TwoWideNarrow}
      padding="24px 40px"
    >
      <Column>
        <Heading
          color={COLORS.muted}
          fontSize="11px"
          fontWeight={700}
          headingType="h4"
        >
          {company.name.toUpperCase()}
        </Heading>
        <Heading
          color={COLORS.ink}
          fontSize="22px"
          fontWeight={700}
          headingType="h2"
        >
          {product.name}
        </Heading>
        <Paragraph
          color={COLORS.muted}
          fontSize="14px"
        >
          {`Model ${product.model}`}
        </Paragraph>
      </Column>
      <Column>
        <Paragraph
          html={`<img src="${product.imageUrl}" alt="${product.name}" style="max-width:100%;height:auto;border-radius:6px" />`}
        />
      </Column>
    </Row>
  )
}
