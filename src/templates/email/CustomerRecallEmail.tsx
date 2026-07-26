import {
  Email,
  Row,
  Column,
  Heading,
  Paragraph,
  Button,
  Image,
  Divider,
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
import { COLORS, severityColor, statusColor } from '../shared/colors'

export interface CustomerRecallEmailProps {
  incident: RecallIncident
}

const EMAIL_FONT = {
  label: 'Arial',
  value: 'Arial, Helvetica, sans-serif',
}

const MONO_FONT = {
  label: 'Courier New',
  value: "'Courier New', Courier, monospace",
}

const PLATE_MUTED = '#9AA6A4'
const PLATE_RULE = '#2A333C'
const FOOTER_TEXT = '#AAB2B0'

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

function stepNumeral(index: number): string {
  return (
    `<span style="display:inline-block;min-width:22px;background-color:${COLORS.ink};` +
    `color:${COLORS.surface};font-family:&#39;Courier New&#39;,Courier,monospace;` +
    'font-size:13px;font-weight:700;line-height:22px;text-align:center;' +
    'border-radius:3px;">' +
    `${index + 1}</span>`
  )
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
    .join('  ·  ')
  const hasInjuries = risk.reportedInjuries != null && risk.reportedInjuries > 0

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
      {/* 2. Company wordmark and recall status */}
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.TwoWideNarrow}
        padding="24px 24px 8px 24px"
      >
        <Column>
          <Heading
            headingType="h2"
            fontSize="18px"
            fontWeight={700}
            color={COLORS.ink}
            containerPadding="0px 10px 2px 10px"
          >
            {escapeHtml(company.name)}
          </Heading>
          <Paragraph
            fontSize="12px"
            color={COLORS.muted}
            lineHeight="150%"
            containerPadding="0px 10px"
            fontFamily={MONO_FONT}
            text={escapeHtml(
              `RECALL ${incident.id} · ${formatDateShort(incident.announcedAt)}`,
            )}
          />
        </Column>
        <Column>
          <Paragraph
            fontSize="11px"
            fontWeight={700}
            color={COLORS.ink}
            letterSpacing="1px"
            textAlign="right"
            lineHeight="150%"
            containerPadding="4px 10px 0px 10px"
            html={`<span style="color:${statusColor(status)};">&#9679;</span>&nbsp; ${statusText(status)}`}
          />
        </Column>
      </Row>

      {/* 3. Severity banner — the single color statement of the email */}
      <Row
        backgroundColor={severityColor(severity)}
        layout={ColumnLayouts.OneColumn}
        padding="8px 24px"
      >
        <Column>
          <Paragraph
            fontSize="12px"
            fontWeight={700}
            color={bannerForeground(severity)}
            letterSpacing="2px"
            lineHeight="150%"
            containerPadding="2px 10px"
            text={severityBannerText(severity)}
          />
        </Column>
      </Row>

      {/* 4. Plain-language headline */}
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="24px 24px 8px 24px"
      >
        <Column>
          <Heading
            headingType="h1"
            fontSize="28px"
            fontWeight={700}
            color={COLORS.ink}
            lineHeight="120%"
            containerPadding="0px 10px 6px 10px"
          >
            {escapeHtml(incident.title)}
          </Heading>
          <Paragraph
            fontSize="16px"
            color={COLORS.muted}
            lineHeight="150%"
            containerPadding="0px 10px"
            text={escapeHtml(risk.headline)}
          />
        </Column>
      </Row>

      {/* 5. Product image and model identification */}
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.TwoEqual}
        padding="16px 24px"
      >
        <Column
          backgroundColor={COLORS.paper}
          borderRadius="4px"
          padding="12px 8px"
        >
          <Image
            src={productImageUrl}
            altText={escapeHtml(
              `${product.name}, model ${product.model} — a portable power bank; check the batch code on its rear label`,
            )}
            textAlign="center"
          />
          <Paragraph
            fontSize="11px"
            color={COLORS.muted}
            lineHeight="150%"
            textAlign="center"
            containerPadding="4px 10px 0px 10px"
            text={escapeHtml(
              `Image unavailable? Identify ${product.name} by model ${product.model} and the batch code on its label.`,
            )}
          />
        </Column>
        <Column padding="0px 0px 0px 12px">
          <Paragraph
            fontSize="11px"
            fontWeight={700}
            color={COLORS.muted}
            letterSpacing="1px"
            lineHeight="150%"
            containerPadding="2px 10px"
            text="PRODUCT"
          />
          <Heading
            headingType="h3"
            fontSize="18px"
            fontWeight={700}
            color={COLORS.ink}
            lineHeight="130%"
            containerPadding="0px 10px 2px 10px"
          >
            {escapeHtml(product.name)}
          </Heading>
          <Paragraph
            fontSize="14px"
            fontWeight={700}
            color={COLORS.ink}
            fontFamily={MONO_FONT}
            lineHeight="150%"
            containerPadding="0px 10px 6px 10px"
            text={escapeHtml(`MODEL ${product.model}`)}
          />
          <Paragraph
            fontSize="14px"
            color={COLORS.muted}
            lineHeight="150%"
            containerPadding="0px 10px"
            text="Compare the model and batch code on the rear product label before taking the next step."
          />
        </Column>
      </Row>

      {/* 6. Batch plate — signature element */}
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="8px 24px 16px 24px"
      >
        <Column
          backgroundColor={COLORS.ink}
          borderRadius="4px"
          padding="20px 24px"
        >
          <Paragraph
            fontSize="11px"
            fontWeight={700}
            color={PLATE_MUTED}
            letterSpacing="2px"
            lineHeight="150%"
            containerPadding="0px 0px 4px 0px"
            text="AFFECTED BATCHES"
          />
          {product.affectedBatches.map((batch) => (
            <Heading
              key={batch}
              headingType="h3"
              fontSize="22px"
              fontWeight={700}
              color={COLORS.surface}
              fontFamily={MONO_FONT}
              lineHeight="140%"
              containerPadding="2px 0px"
            >
              {escapeHtml(batch)}
            </Heading>
          ))}
          <Divider
            borderTopWidth="1px"
            borderTopColor={PLATE_RULE}
            containerPadding="10px 0px 8px 0px"
          />
          <Paragraph
            fontSize="12px"
            color={PLATE_MUTED}
            fontFamily={MONO_FONT}
            lineHeight="150%"
            containerPadding="0px"
            text={escapeHtml(
              `MODEL ${product.model} · RECALL ${incident.id}`,
            )}
          />
        </Column>
      </Row>

      {/* 7. Risk summary — paper panel, severity-colored rule */}
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="0px 24px 8px 24px"
      >
        <Column
          backgroundColor={COLORS.paper}
          border={{
            borderLeftWidth: '3px',
            borderLeftStyle: 'solid',
            borderLeftColor: severityColor(severity),
          }}
          padding="16px 20px"
        >
          <Paragraph
            fontSize="11px"
            fontWeight={700}
            color={COLORS.muted}
            letterSpacing="1px"
            lineHeight="150%"
            containerPadding="0px 0px 6px 0px"
            text="RISK SUMMARY"
          />
          <Paragraph
            fontSize="16px"
            color={COLORS.ink}
            lineHeight="155%"
            containerPadding="0px"
            text={escapeHtml(risk.description)}
          />
          {reportSummary && (
            <Paragraph
              fontSize="13px"
              fontWeight={700}
              color={hasInjuries ? COLORS.critical : COLORS.muted}
              lineHeight="150%"
              containerPadding="8px 0px 0px 0px"
              text={escapeHtml(reportSummary)}
            />
          )}
        </Column>
      </Row>

      {/* 8a. Immediate action callout */}
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="8px 24px 0px 24px"
      >
        <Column
          border={{
            borderLeftWidth: '3px',
            borderLeftStyle: 'solid',
            borderLeftColor: COLORS.critical,
          }}
          padding="4px 20px"
        >
          <Paragraph
            fontSize="11px"
            fontWeight={700}
            color={COLORS.critical}
            letterSpacing="1px"
            lineHeight="150%"
            containerPadding="0px 0px 4px 0px"
            text="IMMEDIATE ACTION REQUIRED"
          />
          <Paragraph
            fontSize="16px"
            color={COLORS.ink}
            lineHeight="155%"
            containerPadding="0px"
            html={`<b>${escapeHtml(action.immediateInstruction)}</b>`}
          />
        </Column>
      </Row>

      {/* 8b. Numbered steps */}
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="16px 24px"
      >
        <Column>
          <Heading
            headingType="h2"
            fontSize="18px"
            fontWeight={700}
            color={COLORS.ink}
            lineHeight="130%"
            containerPadding="0px 10px 6px 10px"
          >
            What you need to do
          </Heading>
          {action.steps.map((step, index) => (
            <Paragraph
              key={`${index}-${step}`}
              fontSize="16px"
              color={COLORS.ink}
              lineHeight="155%"
              containerPadding="5px 10px"
              html={`${stepNumeral(index)}&nbsp; ${escapeHtml(step)}`}
            />
          ))}
        </Column>
      </Row>

      {/* 9. Remedy panel — paper with ink top rule */}
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="0px 24px 8px 24px"
      >
        <Column
          backgroundColor={COLORS.paper}
          border={{
            borderTopWidth: '3px',
            borderTopStyle: 'solid',
            borderTopColor: COLORS.ink,
          }}
          padding="16px 20px"
        >
          <Paragraph
            fontSize="11px"
            fontWeight={700}
            color={COLORS.safe}
            letterSpacing="1px"
            lineHeight="150%"
            containerPadding="0px 0px 4px 0px"
            text="YOUR REMEDY"
          />
          <Heading
            headingType="h3"
            fontSize="18px"
            fontWeight={700}
            color={COLORS.ink}
            lineHeight="130%"
            containerPadding="0px 0px 4px 0px"
          >
            {`${remedyLabel(action.remedyType)} available`}
          </Heading>
          <Paragraph
            fontSize="16px"
            color={COLORS.ink}
            lineHeight="155%"
            containerPadding="0px 0px 10px 0px"
            text={escapeHtml(action.remedyDescription)}
          />
          <Paragraph
            fontSize="11px"
            fontWeight={700}
            color={COLORS.muted}
            letterSpacing="1px"
            lineHeight="150%"
            containerPadding="0px 0px 4px 0px"
            text="RETURN INSTRUCTIONS"
          />
          <Paragraph
            fontSize="14px"
            color={COLORS.ink}
            lineHeight="155%"
            containerPadding="0px"
            text={escapeHtml(action.returnInstructions)}
          />
          {hasDeadline(action) && (
            <Paragraph
              fontSize="14px"
              fontWeight={700}
              color={COLORS.ink}
              lineHeight="150%"
              containerPadding="10px 0px 0px 0px"
              text={escapeHtml(
                `Respond by ${formatDate(action.responseDeadline!)}`,
              )}
            />
          )}
        </Column>
      </Row>

      {/* 10. Primary verification call to action */}
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="8px 24px 24px 24px"
      >
        <Column>
          <Button
            href={verificationUrl}
            backgroundColor={COLORS.ink}
            color={COLORS.surface}
            borderRadius="4px"
            fontSize="16px"
            fontWeight={700}
            padding="14px 24px"
            textAlign="center"
            width="100%"
          >
            Check my product
          </Button>
          <Paragraph
            fontSize="12px"
            color={COLORS.muted}
            lineHeight="150%"
            textAlign="center"
            containerPadding="8px 10px 0px 10px"
            text="Have your batch code ready — checking takes about a minute."
          />
        </Column>
      </Row>

      {/* 11. Support details */}
      <Row
        backgroundColor={COLORS.paper}
        layout={ColumnLayouts.OneColumn}
        padding="24px 24px"
      >
        <Column>
          <Heading
            headingType="h3"
            fontSize="16px"
            fontWeight={700}
            color={COLORS.ink}
            lineHeight="130%"
            containerPadding="0px 10px 6px 10px"
          >
            Need help?
          </Heading>
          <Paragraph
            fontSize="14px"
            color={COLORS.ink}
            lineHeight="165%"
            containerPadding="2px 10px"
            html={`<b>Phone:</b> <a href="${escapeHtml(phoneHref)}">${escapeHtml(company.supportPhone)}</a>`}
          />
          <Paragraph
            fontSize="14px"
            color={COLORS.ink}
            lineHeight="165%"
            containerPadding="2px 10px"
            html={`<b>Email:</b> <a href="${escapeHtml(emailHref)}">${escapeHtml(company.supportEmail)}</a>`}
          />
          <Paragraph
            fontSize="14px"
            color={COLORS.ink}
            lineHeight="165%"
            containerPadding="2px 10px"
            html={`<b>Hours:</b> ${escapeHtml(company.supportHours)}`}
          />
          <Paragraph
            fontSize="13px"
            color={COLORS.muted}
            lineHeight="160%"
            containerPadding="8px 10px 0px 10px"
            text={escapeHtml(company.returnInstructions)}
          />
        </Column>
      </Row>

      {/* 12. Legal / disclaimer footer */}
      <Row
        backgroundColor={COLORS.ink}
        layout={ColumnLayouts.OneColumn}
        padding="24px 24px"
      >
        <Column>
          <Paragraph
            fontSize="12px"
            fontWeight={700}
            color={COLORS.surface}
            lineHeight="150%"
            containerPadding="0px 10px 4px 10px"
            text={escapeHtml(company.name)}
          />
          <Paragraph
            fontSize="11px"
            color={FOOTER_TEXT}
            lineHeight="160%"
            containerPadding="0px 10px 4px 10px"
            text="This is a fictional recall scenario created for demonstration purposes. No real products, companies, or safety incidents are represented."
          />
          <Paragraph
            fontSize="11px"
            color={FOOTER_TEXT}
            fontFamily={MONO_FONT}
            lineHeight="160%"
            containerPadding="0px 10px"
            text={escapeHtml(
              `LAST UPDATED ${formatDate(incident.updatedAt)} · RECALL ${incident.id}`,
            )}
          />
        </Column>
      </Row>
    </Email>
  )
}
