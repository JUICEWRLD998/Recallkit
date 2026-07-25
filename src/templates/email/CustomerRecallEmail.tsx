import {
  Email,
  Row,
  Column,
  Heading,
  Paragraph,
  Button,
  ColumnLayouts,
} from '@unlayer/react-elements'
import type { RecallIncident } from '../../domain/recall-schema'
import {
  formatDate,
  formatDateShort,
  remedyLabel,
  hasDeadline,
} from '../../domain/recall-selectors'
import { COLORS, severityColor } from '../shared/colors'

export interface CustomerRecallEmailProps {
  incident: RecallIncident
}

function severityBannerText(severity: RecallIncident['severity']): string {
  switch (severity) {
    case 'critical':
      return 'CRITICAL PRODUCT RECALL'
    case 'high':
      return 'HIGH SEVERITY PRODUCT RECALL'
    case 'advisory':
      return 'SAFETY ADVISORY'
  }
}

function bannerBackground(severity: RecallIncident['severity']): string {
  return severity === 'advisory' ? COLORS.ink : severityColor(severity)
}

function statusText(status: RecallIncident['status']): string {
  switch (status) {
    case 'active':
      return 'ACTIVE'
    case 'updated':
      return 'UPDATED'
    case 'resolved':
      return 'RESOLVED'
  }
}

export function CustomerRecallEmail({ incident }: CustomerRecallEmailProps) {
  const { company, product, risk, action, severity, status } = incident

  const stepsHtml = action.steps
    .map((step, i) => `<b>${i + 1}.</b> ${step}`)
    .join('<br>')

  const batchesHtml = product.affectedBatches
    .map((b) => `<b>${b}</b>`)
    .join('<br>')

  return (
    <Email
      backgroundColor={COLORS.paper}
      contentWidth="600px"
      fontFamily={{ label: 'Arial', value: 'Arial, Helvetica, sans-serif' }}
      previewText={`Safety recall: ${incident.title} — ${risk.headline}. Stop use immediately.`}
      textColor={COLORS.ink}
    >
      {/* 2. COMPANY HEADER */}
      <Row backgroundColor={COLORS.surface} padding="28px 40px 16px">
        <Column>
          <Heading
            headingType="h2"
            fontSize="19px"
            fontWeight={700}
            color={COLORS.ink}
          >
            {company.name}
          </Heading>
          <Paragraph
            fontSize="12px"
            color={COLORS.muted}
            lineHeight="145%"
            html={`Recall ${incident.id} &middot; Announced ${formatDateShort(incident.announcedAt)}`}
          />
        </Column>
      </Row>

      {/* 3. SEVERITY BANNER */}
      <Row
        backgroundColor={bannerBackground(severity)}
        layout={ColumnLayouts.TwoWideNarrow}
        padding="12px 40px"
        noStackMobile
      >
        <Column>
          <Heading
            headingType="h4"
            fontSize="12px"
            fontWeight={700}
            color={COLORS.surface}
          >
            {severityBannerText(severity)}
          </Heading>
        </Column>
        <Column>
          <Heading
            headingType="h4"
            fontSize="12px"
            fontWeight={700}
            color={COLORS.surface}
            textAlign="right"
          >
            {statusText(status)}
          </Heading>
        </Column>
      </Row>

      {/* 4. RECALL HEADLINE */}
      <Row backgroundColor={COLORS.surface} padding="28px 40px 12px">
        <Column>
          <Heading
            headingType="h1"
            fontSize="28px"
            fontWeight={700}
            color={COLORS.ink}
            lineHeight="118%"
          >
            {incident.title}
          </Heading>
          <Paragraph
            fontSize="16px"
            color={COLORS.muted}
            lineHeight="155%"
            html={risk.headline.replace(
              product.name,
              `<b>${product.name}</b>`
            )}
          />
        </Column>
      </Row>

      {/* 5. PRODUCT IMAGE + INFO */}
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.TwoEqual}
        padding="16px 40px 20px"
      >
        <Column>
          <Paragraph
            html={`<img src="${product.imageUrl}" alt="${product.name}" style="max-width:100%;height:auto;border-radius:6px" />`}
          />
          <Paragraph
            fontSize="12px"
            color={COLORS.muted}
            lineHeight="145%"
            text="If this image doesn't load, check your product label for the batch identifier."
          />
        </Column>
        <Column>
          <Heading
            headingType="h4"
            fontSize="11px"
            color={COLORS.muted}
            fontWeight={700}
          >
            PRODUCT
          </Heading>
          <Heading
            headingType="h3"
            fontSize="16px"
            fontWeight={700}
            color={COLORS.ink}
          >
            {product.name}
          </Heading>
          <Paragraph fontSize="14px" color={COLORS.muted} text={product.model} />
          {risk.reportedIncidents != null && (
            <Paragraph
              fontSize="13px"
              color={COLORS.muted}
              text={`${risk.reportedIncidents} incidents reported`}
            />
          )}
          {risk.reportedInjuries != null && (
            <Paragraph
              fontSize="13px"
              color={COLORS.critical}
              text={`${risk.reportedInjuries} injuries reported`}
            />
          )}
        </Column>
      </Row>

      {/* 6. AFFECTED BATCH PANEL */}
      <Row backgroundColor={COLORS.surface} padding="12px 40px 20px">
        <Column
          backgroundColor={COLORS.ink}
          borderRadius="6px"
          padding="18px 20px"
        >
          <Heading
            headingType="h4"
            fontSize="11px"
            fontWeight={700}
            color={COLORS.surface}
          >
            AFFECTED BATCH IDENTIFIERS
          </Heading>
          <Paragraph
            fontSize="22px"
            color={COLORS.surface}
            html={batchesHtml}
          />
          <Paragraph
            fontSize="12px"
            color="#C9D0CE"
            lineHeight="145%"
            html={`Model ${product.model} / Recall ${incident.id}`}
          />
        </Column>
      </Row>

      {/* 7. IMMEDIATE ACTION */}
      <Row backgroundColor={COLORS.surface} padding="8px 40px 4px">
        <Column
          backgroundColor="#FEF3F2"
          borderRadius="6px"
          padding="16px 18px"
        >
          <Heading
            headingType="h4"
            fontSize="11px"
            fontWeight={700}
            color={COLORS.critical}
          >
            IMMEDIATE ACTION REQUIRED
          </Heading>
          <Paragraph
            fontSize="14px"
            color={COLORS.ink}
            lineHeight="155%"
            html={`<b>${action.immediateInstruction}</b>`}
          />
        </Column>
      </Row>

      {/* 8. NUMBERED STEPS */}
      <Row backgroundColor={COLORS.surface} padding="16px 40px 20px">
        <Column>
          <Heading
            headingType="h2"
            fontSize="17px"
            fontWeight={700}
            color={COLORS.ink}
          >
            What you need to do
          </Heading>
          <Paragraph
            fontSize="14px"
            color={COLORS.ink}
            lineHeight="175%"
            html={stepsHtml}
          />
        </Column>
      </Row>

      {/* 9. REMEDY CALLOUT */}
      <Row backgroundColor={COLORS.surface} padding="12px 40px 20px">
        <Column
          backgroundColor="#F0FDFA"
          borderRadius="6px"
          padding="16px 18px"
        >
          <Heading
            headingType="h3"
            fontSize="15px"
            fontWeight={700}
            color={COLORS.safe}
          >
            {remedyLabel(action.remedyType)} available
          </Heading>
          <Paragraph
            fontSize="14px"
            color={COLORS.ink}
            lineHeight="155%"
            text={action.remedyDescription}
          />
          {hasDeadline(action) && (
            <Paragraph
              fontSize="13px"
              color={COLORS.muted}
              text={`Respond by ${formatDate(action.responseDeadline!)}`}
            />
          )}
        </Column>
      </Row>

      {/* 10. PRIMARY CTA */}
      <Row backgroundColor={COLORS.surface} padding="8px 40px 28px">
        <Column>
          <Button
            href={company.verificationUrl}
            backgroundColor={bannerBackground(severity)}
            color={COLORS.surface}
            borderRadius="6px"
            fontSize="15px"
            fontWeight={700}
            padding="14px 24px"
            textAlign="center"
            width="100%"
          >
            Check my product →
          </Button>
        </Column>
      </Row>

      {/* 11. SUPPORT DETAILS */}
      <Row backgroundColor={COLORS.paper} padding="24px 40px">
        <Column>
          <Heading
            headingType="h3"
            fontSize="14px"
            fontWeight={700}
            color={COLORS.ink}
          >
            Need help?
          </Heading>
          <Paragraph
            fontSize="13px"
            color={COLORS.ink}
            lineHeight="170%"
            html={`<b>Phone:</b> ${company.supportPhone}`}
          />
          <Paragraph
            fontSize="13px"
            color={COLORS.ink}
            lineHeight="170%"
            html={`<b>Email:</b> ${company.supportEmail}`}
          />
          <Paragraph
            fontSize="13px"
            color={COLORS.ink}
            lineHeight="170%"
            html={`<b>Hours:</b> ${company.supportHours}`}
          />
          <Paragraph
            fontSize="13px"
            color={COLORS.muted}
            lineHeight="160%"
            text={company.returnInstructions}
          />
        </Column>
      </Row>

      {/* 12. LEGAL FOOTER */}
      <Row backgroundColor={COLORS.ink} padding="20px 40px">
        <Column>
          <Paragraph
            fontSize="11px"
            color="#8A9290"
            lineHeight="160%"
            text="This is a fictional recall scenario created for demonstration purposes. No real products, companies, or safety incidents are represented."
          />
          <Paragraph
            fontSize="11px"
            color="#8A9290"
            lineHeight="160%"
            html={`Last updated: ${formatDate(incident.updatedAt)} &middot; Recall ${incident.id}`}
          />
        </Column>
      </Row>
    </Email>
  )
}
