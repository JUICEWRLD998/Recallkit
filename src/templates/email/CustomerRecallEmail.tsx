import {
  Email,
  Row,
  Column,
  Heading,
  Paragraph,
  Button,
  Image,
  ColumnLayouts,
} from '@unlayer/react-elements'
import defaultProductImageUrl from '../../assets/hero.png?inline'
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

const EMAIL_FONT = {
  label: 'Arial',
  value: 'Arial, Helvetica, sans-serif',
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

function bannerForeground(severity: RecallIncident['severity']): string {
  return severity === 'high' ? COLORS.ink : COLORS.surface
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

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function safeHttpUrl(value: string): string {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '#'
  } catch {
    return '#'
  }
}

function resolveProductImageUrl(value: string): string {
  const trimmed = value.trim()

  if (!trimmed || trimmed === '/assets/hero.png') {
    return defaultProductImageUrl
  }

  if (trimmed.startsWith('data:image/')) {
    return trimmed
  }

  return safeHttpUrl(trimmed) === '#' ? defaultProductImageUrl : trimmed
}

function countLabel(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${count} ${count === 1 ? singular : plural} reported`
}

export function CustomerRecallEmail({ incident }: CustomerRecallEmailProps) {
  const { company, product, risk, action, severity, status } = incident
  const productImageUrl = resolveProductImageUrl(product.imageUrl)
  const verificationUrl = safeHttpUrl(company.verificationUrl)
  const phoneHref = `tel:${company.supportPhone.replace(/[^\d+]/g, '')}`
  const emailHref = `mailto:${company.supportEmail}`
  const reportSummary = [
    risk.reportedIncidents == null
      ? null
      : countLabel(risk.reportedIncidents, 'incident'),
    risk.reportedInjuries == null
      ? null
      : countLabel(risk.reportedInjuries, 'injury', 'injuries'),
  ]
    .filter((value): value is string => value != null)
    .join(' | ')

  return (
    <Email
      backgroundColor={COLORS.paper}
      contentWidth="600px"
      fontFamily={EMAIL_FONT}
      previewText={escapeHtml(
        `${incident.title}: ${risk.headline}. ${action.immediateInstruction}`,
      )}
      textColor={COLORS.ink}
    >
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="28px 40px 16px 40px"
      >
        <Column>
          <Heading
            headingType="h2"
            fontSize="19px"
            fontWeight={700}
            color={COLORS.ink}
          >
            {escapeHtml(company.name)}
          </Heading>
          <Paragraph
            fontSize="12px"
            color={COLORS.muted}
            lineHeight="145%"
            text={escapeHtml(
              `Recall ${incident.id} | Announced ${formatDateShort(incident.announcedAt)}`,
            )}
          />
        </Column>
      </Row>

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
            color={bannerForeground(severity)}
          >
            {severityBannerText(severity)}
          </Heading>
        </Column>
        <Column>
          <Heading
            headingType="h4"
            fontSize="12px"
            fontWeight={700}
            color={bannerForeground(severity)}
            textAlign="right"
          >
            {statusText(status)}
          </Heading>
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="28px 40px 12px 40px"
      >
        <Column>
          <Heading
            headingType="h1"
            fontSize="28px"
            fontWeight={700}
            color={COLORS.ink}
            lineHeight="118%"
          >
            {escapeHtml(incident.title)}
          </Heading>
          <Paragraph
            fontSize="16px"
            color={COLORS.muted}
            lineHeight="155%"
            text={escapeHtml(risk.headline)}
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.TwoEqual}
        padding="16px 40px 20px 40px"
      >
        <Column padding="0px 12px 0px 0px">
          <Image
            src={productImageUrl}
            altText={escapeHtml(`${product.name}, model ${product.model}`)}
            textAlign="center"
          />
          <Paragraph
            fontSize="12px"
            color={COLORS.muted}
            lineHeight="145%"
            text={escapeHtml(
              `Image unavailable? Identify ${product.name} by model ${product.model} and the batch code on its label.`,
            )}
          />
        </Column>
        <Column padding="0px 0px 0px 12px">
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
            fontSize="18px"
            fontWeight={700}
            color={COLORS.ink}
          >
            {escapeHtml(product.name)}
          </Heading>
          <Paragraph
            fontSize="14px"
            color={COLORS.muted}
            text={escapeHtml(`Model ${product.model}`)}
          />
          <Paragraph
            fontSize="13px"
            color={COLORS.muted}
            lineHeight="155%"
            text="Compare the model and batch code on the rear product label before taking the next step."
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="12px 40px 20px 40px"
      >
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
          {product.affectedBatches.map((batch) => (
            <Heading
              key={batch}
              headingType="h3"
              fontSize="20px"
              fontWeight={700}
              color={COLORS.surface}
              lineHeight="130%"
            >
              {escapeHtml(batch)}
            </Heading>
          ))}
          <Paragraph
            fontSize="12px"
            color="#C9D0CE"
            lineHeight="145%"
            text={escapeHtml(
              `Model ${product.model} | Recall ${incident.id}`,
            )}
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="4px 40px 20px 40px"
      >
        <Column
          backgroundColor="#FFF8E7"
          borderRadius="6px"
          padding="18px 20px"
        >
          <Heading
            headingType="h4"
            fontSize="11px"
            fontWeight={700}
            color="#8A5700"
          >
            RISK SUMMARY
          </Heading>
          <Heading
            headingType="h3"
            fontSize="16px"
            fontWeight={700}
            color={COLORS.ink}
            lineHeight="135%"
          >
            {escapeHtml(risk.headline)}
          </Heading>
          <Paragraph
            fontSize="14px"
            color={COLORS.ink}
            lineHeight="160%"
            text={escapeHtml(risk.description)}
          />
          {reportSummary && (
            <Paragraph
              fontSize="13px"
              color={
                risk.reportedInjuries != null && risk.reportedInjuries > 0
                  ? COLORS.critical
                  : COLORS.muted
              }
              lineHeight="150%"
              text={escapeHtml(reportSummary)}
            />
          )}
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="8px 40px 4px 40px"
      >
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
            html={`<b>${escapeHtml(action.immediateInstruction)}</b>`}
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="16px 40px 20px 40px"
      >
        <Column>
          <Heading
            headingType="h2"
            fontSize="17px"
            fontWeight={700}
            color={COLORS.ink}
          >
            What you need to do
          </Heading>
          {action.steps.map((step, index) => (
            <Paragraph
              key={`${index}-${step}`}
              fontSize="14px"
              color={COLORS.ink}
              lineHeight="160%"
              html={`<b>${index + 1}.</b> ${escapeHtml(step)}`}
            />
          ))}
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="12px 40px 20px 40px"
      >
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
            {`${remedyLabel(action.remedyType)} available`}
          </Heading>
          <Paragraph
            fontSize="14px"
            color={COLORS.ink}
            lineHeight="155%"
            text={escapeHtml(action.remedyDescription)}
          />
          <Heading
            headingType="h4"
            fontSize="11px"
            fontWeight={700}
            color={COLORS.safe}
          >
            RETURN INSTRUCTIONS
          </Heading>
          <Paragraph
            fontSize="13px"
            color={COLORS.ink}
            lineHeight="155%"
            text={escapeHtml(action.returnInstructions)}
          />
          {hasDeadline(action) && (
            <Paragraph
              fontSize="13px"
              color={COLORS.muted}
              text={escapeHtml(
                `Respond by ${formatDate(action.responseDeadline!)}`,
              )}
            />
          )}
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="8px 40px 28px 40px"
      >
        <Column>
          <Button
            href={verificationUrl}
            backgroundColor={bannerBackground(severity)}
            color={bannerForeground(severity)}
            borderRadius="6px"
            fontSize="15px"
            fontWeight={700}
            padding="14px 24px"
            textAlign="center"
            width="100%"
          >
            Check my product
          </Button>
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.paper}
        layout={ColumnLayouts.OneColumn}
        padding="24px 40px"
      >
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
            html={`<b>Phone:</b> <a href="${escapeHtml(phoneHref)}">${escapeHtml(company.supportPhone)}</a>`}
          />
          <Paragraph
            fontSize="13px"
            color={COLORS.ink}
            lineHeight="170%"
            html={`<b>Email:</b> <a href="${escapeHtml(emailHref)}">${escapeHtml(company.supportEmail)}</a>`}
          />
          <Paragraph
            fontSize="13px"
            color={COLORS.ink}
            lineHeight="170%"
            html={`<b>Hours:</b> ${escapeHtml(company.supportHours)}`}
          />
          <Paragraph
            fontSize="13px"
            color={COLORS.muted}
            lineHeight="160%"
            text={escapeHtml(company.returnInstructions)}
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.ink}
        layout={ColumnLayouts.OneColumn}
        padding="20px 40px"
      >
        <Column>
          <Paragraph
            fontSize="11px"
            color="#AAB2B0"
            lineHeight="160%"
            text="This is a fictional recall scenario created for demonstration purposes. No real products, companies, or safety incidents are represented."
          />
          <Paragraph
            fontSize="11px"
            color="#AAB2B0"
            lineHeight="160%"
            text={escapeHtml(
              `Last updated: ${formatDate(incident.updatedAt)} | Recall ${incident.id}`,
            )}
          />
        </Column>
      </Row>
    </Email>
  )
}
