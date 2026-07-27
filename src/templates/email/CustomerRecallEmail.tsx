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
import defaultProductImageUrl from '../../assets/powerbank.jpg?inline'
import type { RecallIncident } from '../../domain/recall-schema'
import {
  formatDate,
  formatDateShort,
  remedyLabel,
  hasDeadline,
} from '../../domain/recall-selectors'
import {
  resolveTemplateColors,
  severityColor,
  severityTint,
  statusColor,
  type TemplatePalette,
  BODY_FONT,
  DISPLAY_FONT,
  MONO_FONT,
} from '../shared'

export interface CustomerRecallEmailProps {
  incident: RecallIncident
}

const PLATE_MUTED = '#9E9CB0'
const PLATE_RULE = '#353445'
const FOOTER_TEXT = '#A5A4B5'

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

function recallBadgesHtml(incident: RecallIncident, colors: TemplatePalette): string {
  const sev = severityColor(incident.severity)
  const tint = severityTint(incident.severity)
  return (
    `<span style="display:inline-block;background:${tint};color:${colors.ink};border:1px solid ${sev};padding:6px 12px;border-radius:999px;font-size:10px;font-weight:700;letter-spacing:1px;margin-right:8px;">${severityBannerText(incident.severity)}</span>` +
    `<span style="display:inline-block;border:1px solid ${colors.line};color:${colors.muted};padding:6px 12px;border-radius:999px;font-size:10px;font-weight:700;letter-spacing:1px;"><span style="color:${statusColor(incident.status)};">&#9679;</span> ${statusText(incident.status)}</span>`
  )
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
  if (!trimmed || trimmed === '/powerbank.jpg' || trimmed === '/assets/hero.png') {
    return defaultProductImageUrl
  }
  if (trimmed.startsWith('data:image/')) return trimmed
  return safeHttpUrl(trimmed) === '#' ? defaultProductImageUrl : trimmed
}

function stepNumeral(index: number, colors: TemplatePalette): string {
  return (
    `<span style="display:inline-block;min-width:24px;height:24px;background:${colors.ink};` +
    `color:${colors.surface};font-family:&#39;Courier New&#39;,Courier,monospace;` +
    'font-size:12px;font-weight:700;line-height:24px;text-align:center;border-radius:5px;">' +
    `${index + 1}</span>`
  )
}

export function CustomerRecallEmail({ incident }: CustomerRecallEmailProps) {
  const colors = resolveTemplateColors(incident)
  const { company, product, risk, action } = incident
  const productImageUrl = resolveProductImageUrl(product.imageUrl)
  const verificationUrl = safeHttpUrl(company.verificationUrl)
  const phoneHref = `tel:${company.supportPhone.replace(/[^\d+]/g, '')}`
  const emailHref = `mailto:${company.supportEmail}`

  return (
    <Email
      backgroundColor={colors.paper}
      contentWidth="600px"
      fontFamily={BODY_FONT}
      previewText={escapeHtml(`${incident.title}. ${action.immediateInstruction}`)}
      textColor={colors.ink}
    >
      <Row backgroundColor={colors.ink} layout={ColumnLayouts.TwoWideNarrow} padding="32px 44px 14px 44px">
        <Column>
          <Heading headingType="h2" fontSize="19px" fontWeight={700} color={colors.surface} fontFamily={DISPLAY_FONT} containerPadding="0px">
            {escapeHtml(company.name)}
          </Heading>
          <Paragraph fontSize="11px" color={PLATE_MUTED} lineHeight="150%" containerPadding="6px 0px 0px 0px" fontFamily={MONO_FONT} text={escapeHtml(`RECALL ${incident.id} · ${formatDateShort(incident.announcedAt)}`)} />
        </Column>
        <Column>
          <Paragraph fontSize="11px" fontWeight={700} color={colors.surface} letterSpacing="1px" textAlign="right" lineHeight="150%" containerPadding="4px 0px 0px 0px" html={`<span style="color:${statusColor(incident.status)};">&#9679;</span>&nbsp; ${statusText(incident.status)}`} />
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} layout={ColumnLayouts.OneColumn} padding="40px 44px 24px 44px">
        <Column>
          <Paragraph fontSize="11px" color={colors.ink} lineHeight="180%" containerPadding="0px 0px 20px 0px" html={recallBadgesHtml(incident, colors)} />
          <Heading headingType="h1" fontSize="36px" fontWeight={700} color={colors.ink} fontFamily={DISPLAY_FONT} lineHeight="112%" containerPadding="0px 0px 16px 0px">
            {escapeHtml(incident.title)}
          </Heading>
          <Paragraph fontSize="18px" color={colors.muted} lineHeight="155%" containerPadding="0px" text={escapeHtml(risk.headline)} />
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} layout={ColumnLayouts.OneColumn} padding="0px 44px 32px 44px">
        <Column backgroundColor={colors.paper} borderRadius="14px" padding="24px 20px">
          <Image src={productImageUrl} altText={escapeHtml(`${product.name}, model ${product.model} — check the batch code on its rear label`)} textAlign="center" />
          <Paragraph fontSize="11px" color={colors.muted} lineHeight="150%" textAlign="center" containerPadding="10px 0px 0px 0px" text={escapeHtml(`Image unavailable? Identify ${product.name} by model ${product.model} and the batch code on its label.`)} />
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} layout={ColumnLayouts.OneColumn} padding="0px 44px 12px 44px">
        <Column>
          <Paragraph fontSize="12px" fontWeight={700} color={colors.muted} letterSpacing="1.2px" lineHeight="150%" containerPadding="0px 0px 8px 0px" text="PRODUCT" />
          <Heading headingType="h3" fontSize="24px" fontWeight={700} color={colors.ink} fontFamily={DISPLAY_FONT} lineHeight="120%" containerPadding="0px 0px 6px 0px">
            {escapeHtml(product.name)}
          </Heading>
          <Paragraph fontSize="15px" fontWeight={700} color={colors.ink} fontFamily={MONO_FONT} lineHeight="150%" containerPadding="0px 0px 10px 0px" text={escapeHtml(`MODEL ${product.model}`)} />
          <Paragraph fontSize="14px" color={colors.muted} lineHeight="160%" containerPadding="0px" text="Compare the model and batch code on the rear product label before taking the next step." />
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} layout={ColumnLayouts.OneColumn} padding="12px 44px 36px 44px">
        <Column backgroundColor={colors.ink} borderRadius="14px" padding="28px 32px">
          <Paragraph fontSize="12px" fontWeight={700} color={PLATE_MUTED} letterSpacing="2px" lineHeight="150%" containerPadding="0px 0px 10px 0px" text="IDENTIFICATION PLATE · AFFECTED BATCHES" />
          {product.affectedBatches.map((batch) => (
            <Heading key={batch} headingType="h3" fontSize="26px" fontWeight={700} color={colors.surface} fontFamily={MONO_FONT} lineHeight="140%" containerPadding="4px 0px">
              {escapeHtml(batch)}
            </Heading>
          ))}
          <Divider borderTopWidth="1px" borderTopColor={PLATE_RULE} containerPadding="14px 0px 10px 0px" />
          <Paragraph fontSize="11px" color={PLATE_MUTED} fontFamily={MONO_FONT} lineHeight="150%" containerPadding="0px" text={escapeHtml(`MODEL ${product.model} · RECALL ${incident.id}`)} />
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} layout={ColumnLayouts.OneColumn} padding="0px 44px 36px 44px">
        <Column backgroundColor={colors.paper} border={{ borderLeftWidth: '4px', borderLeftStyle: 'solid', borderLeftColor: severityColor(incident.severity) }} borderRadius="12px" padding="24px 28px">
          <Paragraph fontSize="12px" fontWeight={700} color={colors.muted} letterSpacing="1.4px" lineHeight="150%" containerPadding="0px 0px 10px 0px" text="RISK SUMMARY" />
          <Paragraph fontSize="16px" color={colors.ink} lineHeight="165%" containerPadding="0px" text={escapeHtml(risk.description)} />
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} layout={ColumnLayouts.OneColumn} padding="0px 44px 8px 44px">
        <Column border={{ borderLeftWidth: '4px', borderLeftStyle: 'solid', borderLeftColor: colors.critical }} padding="0px 24px">
          <Paragraph fontSize="12px" fontWeight={700} color={colors.critical} letterSpacing="1.4px" lineHeight="150%" containerPadding="0px 0px 10px 0px" text="IMMEDIATE ACTION REQUIRED" />
          <Paragraph fontSize="18px" color={colors.ink} lineHeight="160%" containerPadding="0px" html={`<b>${escapeHtml(action.immediateInstruction)}</b>`} />
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} layout={ColumnLayouts.OneColumn} padding="24px 44px 36px 44px">
        <Column>
          <Heading headingType="h2" fontSize="22px" fontWeight={700} color={colors.ink} fontFamily={DISPLAY_FONT} lineHeight="130%" containerPadding="0px 0px 18px 0px">
            What you need to do
          </Heading>
          {action.steps.map((step, index) => (
            <Paragraph key={`${index}-${step}`} fontSize="16px" color={colors.ink} lineHeight="170%" containerPadding="10px 0px" html={`${stepNumeral(index, colors)}&nbsp;&nbsp;${escapeHtml(step)}`} />
          ))}
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} layout={ColumnLayouts.OneColumn} padding="0px 44px 20px 44px">
        <Column backgroundColor={colors.paper} border={{ borderTopWidth: '4px', borderTopStyle: 'solid', borderTopColor: colors.accent }} borderRadius="12px" padding="28px 28px">
          <Paragraph fontSize="12px" fontWeight={700} color={colors.safe} letterSpacing="1.4px" lineHeight="150%" containerPadding="0px 0px 8px 0px" text="YOUR REMEDY" />
          <Heading headingType="h3" fontSize="21px" fontWeight={700} color={colors.ink} fontFamily={DISPLAY_FONT} lineHeight="130%" containerPadding="0px 0px 10px 0px">
            {`${remedyLabel(action.remedyType)} available`}
          </Heading>
          <Paragraph fontSize="16px" color={colors.ink} lineHeight="165%" containerPadding="0px 0px 18px 0px" text={escapeHtml(action.remedyDescription)} />
          <Paragraph fontSize="12px" fontWeight={700} color={colors.muted} letterSpacing="1.4px" lineHeight="150%" containerPadding="0px 0px 8px 0px" text="RETURN INSTRUCTIONS" />
          <Paragraph fontSize="15px" color={colors.ink} lineHeight="165%" containerPadding="0px" text={escapeHtml(action.returnInstructions)} />
          {hasDeadline(action) && (
            <Paragraph fontSize="15px" fontWeight={700} color={colors.ink} lineHeight="150%" containerPadding="16px 0px 0px 0px" text={escapeHtml(`Respond by ${formatDate(action.responseDeadline!)}`)} />
          )}
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} layout={ColumnLayouts.OneColumn} padding="8px 44px 44px 44px">
        <Column>
          <Button href={verificationUrl} backgroundColor={colors.accent} color={colors.surface} borderRadius="10px" fontSize="16px" fontWeight={700} padding="16px 28px" textAlign="center" width="100%">
            Check my product
          </Button>
        </Column>
      </Row>

      <Row backgroundColor={colors.paper} layout={ColumnLayouts.OneColumn} padding="36px 44px">
        <Column>
          <Heading headingType="h3" fontSize="17px" fontWeight={700} color={colors.ink} fontFamily={DISPLAY_FONT} lineHeight="130%" containerPadding="0px 0px 12px 0px">
            Need help?
          </Heading>
          <Paragraph fontSize="15px" color={colors.ink} lineHeight="175%" containerPadding="4px 0px" html={`<b>Phone:</b> <a href="${escapeHtml(phoneHref)}">${escapeHtml(company.supportPhone)}</a>`} />
          <Paragraph fontSize="15px" color={colors.ink} lineHeight="175%" containerPadding="4px 0px" html={`<b>Email:</b> <a href="${escapeHtml(emailHref)}">${escapeHtml(company.supportEmail)}</a>`} />
        </Column>
      </Row>

      <Row backgroundColor={colors.ink} layout={ColumnLayouts.OneColumn} padding="28px 44px">
        <Column>
          <Paragraph fontSize="12px" color={FOOTER_TEXT} lineHeight="165%" containerPadding="0px 0px 8px 0px" text="This is a fictional recall scenario created for demonstration purposes. No real products, companies, or safety incidents are represented." />
          <Paragraph fontSize="11px" color={FOOTER_TEXT} fontFamily={MONO_FONT} lineHeight="160%" containerPadding="0px" text={escapeHtml(`LAST UPDATED ${formatDate(incident.updatedAt)} · RECALL ${incident.id}`)} />
        </Column>
      </Row>
    </Email>
  )
}
