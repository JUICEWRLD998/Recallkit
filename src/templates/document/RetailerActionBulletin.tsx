import {
  Column,
  ColumnLayouts,
  Document,
  Heading,
  Html,
  Image,
  Paragraph,
  Row,
} from '@unlayer/react-elements'
import defaultProductImageUrl from '../../assets/powerbank.jpg?inline'
import type { RecallIncident } from '../../domain/recall-schema'
import {
  formatDate,
  formatDateShort,
  hasDeadline,
  remedyLabel,
  statusLabel,
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
  MONO_STACK,
} from '../shared'

export interface RetailerActionBulletinProps {
  incident: RecallIncident
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

function severityMessage(severity: RecallIncident['severity']): string {
  switch (severity) {
    case 'critical':
      return 'CRITICAL — REMOVE AFFECTED STOCK IMMEDIATELY'
    case 'high':
      return 'HIGH SEVERITY — REMOVE AFFECTED STOCK FROM SALE'
    case 'advisory':
      return 'ADVISORY — REVIEW STOCK AND MONITOR'
  }
}

function sectionLabel(text: string, accent: string) {
  return (
    <Heading color={accent} containerPadding="0px 0px 14px" fontSize="12px" fontWeight={700} headingType="h2" letterSpacing="1.6px" lineHeight="130%">
      {text}
    </Heading>
  )
}

function detailRow(label: string, valueHtml: string, colors: TemplatePalette, mono = false): string {
  const font = mono ? `font-family:${MONO_STACK};font-weight:700;` : ''
  return (
    `<tr>` +
    `<td style="width:36%;padding:12px 14px 12px 0;border-bottom:1px solid ${colors.line};font-size:11px;font-weight:700;letter-spacing:1px;color:${colors.inkSoft};vertical-align:top;">${label}</td>` +
    `<td style="padding:12px 0;border-bottom:1px solid ${colors.line};font-size:15px;line-height:155%;color:${colors.ink};${font}vertical-align:top;">${valueHtml}</td>` +
    `</tr>`
  )
}

function batchPlateHtml(incident: RecallIncident, colors: TemplatePalette): string {
  const { product } = incident
  const chips = product.affectedBatches
    .map(
      (batch) =>
        `<span style="display:inline-block;border:1.5px solid ${colors.ink};padding:10px 16px;margin:0 10px 10px 0;font-family:${MONO_STACK};font-weight:700;font-size:18px;color:${colors.ink};border-radius:5px;">${escapeHtml(batch)}</span>`,
    )
    .join('')
  return (
    `<div class="rk-plate" style="border:2px solid ${colors.ink};border-radius:8px;overflow:hidden;">` +
    `<div style="background:${colors.ink};color:#fff;padding:14px 20px;font-size:11px;font-weight:700;letter-spacing:1.4px;">AFFECTED BATCH IDENTIFIERS · MODEL ${escapeHtml(product.model)}</div>` +
    `<div style="padding:20px 20px 12px;">${chips}</div>` +
    `<div style="border-top:2px solid ${colors.ink};background:${colors.paper};padding:12px 20px;font-size:11px;font-weight:700;letter-spacing:1px;">REQUIRED DISPOSITION: QUARANTINE - DO NOT SELL</div>` +
    `</div>`
  )
}

function checklistHtml(items: string[], colors: TemplatePalette): string {
  return items
    .map(
      (item, index) =>
        `<div class="rk-line" style="display:flex;align-items:flex-start;padding:12px 0;border-bottom:1px solid ${colors.line};">` +
        `<span style="flex:0 0 auto;width:16px;height:16px;border:1.5px solid ${colors.ink};margin:2px 14px 0 2px;border-radius:2px;"></span>` +
        `<span style="flex:0 0 auto;font-family:${MONO_STACK};font-size:12px;font-weight:700;color:${colors.inkSoft};padding:1px 12px 0 0;">${String(index + 1).padStart(2, '0')}</span>` +
        `<span style="font-size:15px;line-height:160%;color:${colors.ink};">${item}</span></div>`,
    )
    .join('')
}

function acknowledgementFieldsHtml(colors: TemplatePalette): string {
  const fields = ['NAME', 'POSITION', 'STORE / LOCATION', 'UNITS ISOLATED', 'SIGNATURE', 'DATE / TIME']
  const cellHtml = (label: string) =>
    `<div style="width:33.33%;box-sizing:border-box;padding:18px 18px 0 0;display:inline-block;vertical-align:top;">` +
    `<div style="height:32px;border-bottom:2px solid ${colors.ink};"></div>` +
    `<div style="padding-top:10px;font-size:12px;font-weight:700;letter-spacing:1.2px;color:${colors.ink};">${label}</div></div>`
  const rowOne = fields.slice(0, 3).map(cellHtml).join('')
  const rowTwo = fields.slice(3).map(cellHtml).join('')
  return `<div style="width:100%;">${rowOne}</div><div style="width:100%;">${rowTwo}</div>`
}

const QUARANTINE_STEPS = [
  'Stop sales and quarantine matching stock',
  'Record isolated units and batch identifiers',
  'Notify the store manager',
]

const ESCALATION_TRIGGERS = [
  'Stock cannot be fully isolated',
  'Fire, injury, smoke, or swelling reported',
  'Affected online orders have shipped',
]

export function RetailerActionBulletin({ incident }: RetailerActionBulletinProps) {
  const colors = resolveTemplateColors(incident)
  const { company, product, risk, action } = incident
  const productImageUrl = resolveProductImageUrl(product.imageUrl)
  const sev = severityColor(incident.severity)
  const tint = severityTint(incident.severity)

  return (
    <Document backgroundColor={colors.paper} contentWidth="656px" fontFamily={BODY_FONT} textColor={colors.ink}>
      <Row backgroundColor={colors.ink} className="rk-keep" layout={ColumnLayouts.TwoWideNarrow} noStackMobile padding="26px 36px 22px">
        <Column padding="0px 20px 0px 0px">
          <Heading color="#B7B3D0" containerPadding="0px 0px 10px" fontSize="11px" fontWeight={700} headingType="h4" letterSpacing="2px" lineHeight="120%">
            RETAILER ACTION BULLETIN
          </Heading>
          <Heading color={colors.surface} containerPadding="0px" fontFamily={DISPLAY_FONT} fontSize="28px" fontWeight={700} headingType="h1" lineHeight="118%">
            {escapeHtml(incident.title)}
          </Heading>
          <Paragraph color="#C7C4D8" containerPadding="10px 0px 0px" fontSize="13px" lineHeight="150%" text={escapeHtml(company.name)} />
        </Column>
        <Column>
          <Html containerPadding="0px" html={`<div style="text-align:right;"><div style="font-size:10px;font-weight:700;letter-spacing:1.4px;color:#B7B3D0;padding-bottom:8px;">RECALL ID</div><div style="display:inline-block;border:1.5px solid #5E597B;padding:10px 14px;font-family:${MONO_STACK};font-weight:700;font-size:18px;color:#fff;border-radius:5px;">${escapeHtml(incident.id)}</div><div style="font-size:11px;color:#C7C4D8;padding-top:10px;">${escapeHtml(formatDateShort(incident.announcedAt))}</div></div>`} />
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} className="rk-keep" layout={ColumnLayouts.OneColumn} padding="18px 36px 0px">
        <Column>
          <Html containerPadding="0px" html={`<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:16px;"><span style="display:inline-block;background:${tint};color:${colors.ink};border:1px solid ${sev};padding:8px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:1px;">${severityMessage(incident.severity)}</span><span style="display:inline-block;border:1px solid ${colors.line};color:${colors.inkSoft};padding:8px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:1px;"><span style="color:${statusColor(incident.status)};">&#9679;</span> ${escapeHtml(statusLabel(incident.status).toUpperCase())}</span><span style="font-size:12px;color:${colors.muted};">Updated ${escapeHtml(formatDateShort(incident.updatedAt))}</span></div>`} />
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} className="rk-keep" layout={ColumnLayouts.TwoWideNarrow} noStackMobile padding="14px 36px 14px">
        <Column padding="0px 24px 0px 0px">
          {sectionLabel('PRODUCT IDENTIFICATION', colors.accent)}
          <Html containerPadding="0px" html={`<table style="width:100%;border-collapse:collapse;border-top:3px solid ${colors.ink};"><tbody>${detailRow('PRODUCT', `<b>${escapeHtml(product.name)}</b>`, colors)}${detailRow('MODEL', escapeHtml(product.model), colors, true)}${detailRow('COMPANY', escapeHtml(company.name), colors)}${detailRow('RECALL ID', escapeHtml(incident.id), colors, true)}</tbody></table>`} />
        </Column>
        <Column>
          <Image altText={escapeHtml(`${product.name}, model ${product.model}`)} containerPadding="4px 0px 8px" maxWidth="150px" src={productImageUrl} textAlign="center" />
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} className="rk-keep" layout={ColumnLayouts.OneColumn} padding="12px 36px 22px">
        <Column>
          {sectionLabel('AFFECTED MODELS AND BATCHES', colors.accent)}
          <Html containerPadding="0px" html={batchPlateHtml(incident, colors)} />
        </Column>
      </Row>

      <Row backgroundColor={colors.paper} className="rk-keep" layout={ColumnLayouts.OneColumn} padding="22px 36px">
        <Column>
          {sectionLabel('RISK SUMMARY', colors.accent)}
          <Heading color={colors.ink} containerPadding="0px 0px 10px" fontFamily={DISPLAY_FONT} fontSize="20px" fontWeight={700} headingType="h3" lineHeight="130%">
            {escapeHtml(risk.headline)}
          </Heading>
          <Paragraph color={colors.ink} containerPadding="0px" fontSize="15px" lineHeight="160%" text={escapeHtml(risk.description)} />
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} className="rk-keep" layout={ColumnLayouts.OneColumn} padding="22px 36px 12px">
        <Column>
          {sectionLabel('IMMEDIATE QUARANTINE CHECKLIST', colors.accent)}
          <Html containerPadding="0px" html={`<div style="border-top:3px solid ${colors.ink};padding:14px 0;border-bottom:1px solid ${colors.line};font-size:15px;font-weight:700;line-height:160%;color:${colors.ink};">${escapeHtml(action.immediateInstruction)}</div>${checklistHtml(QUARANTINE_STEPS, colors)}`} />
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} className="rk-keep" layout={ColumnLayouts.OneColumn} padding="12px 36px">
        <Column>
          {sectionLabel('RETURN AND INVENTORY DISPOSITION', colors.accent)}
          <Html containerPadding="0px" html={`<div style="border-top:3px solid ${colors.ink};"><div style="padding:12px 0;border-bottom:1px solid ${colors.line};font-size:15px;line-height:160%;"><b>${escapeHtml(remedyLabel(action.remedyType))}:</b> ${escapeHtml(action.remedyDescription)}</div><div style="padding:12px 0;border-bottom:1px solid ${colors.line};font-size:15px;line-height:160%;"><b>Return process:</b> ${escapeHtml(action.returnInstructions)}</div>${hasDeadline(action) ? `<div style="margin-top:14px;border-left:5px solid ${colors.critical};padding:12px 16px;font-size:15px;font-weight:700;">Respond by ${formatDate(action.responseDeadline!)}</div>` : ''}</div>`} />
        </Column>
      </Row>

      <Row backgroundColor={colors.surface} className="rk-keep" layout={ColumnLayouts.TwoEqual} noStackMobile padding="12px 36px 20px">
        <Column padding="0px 20px 0px 0px">
          {sectionLabel('ESCALATION CHECKLIST', colors.accent)}
          <Html containerPadding="0px" html={`<div style="border-top:3px solid ${colors.ink};">${checklistHtml(ESCALATION_TRIGGERS, colors)}</div>`} />
        </Column>
        <Column>
          {sectionLabel('ESCALATION CONTACTS', colors.accent)}
          <Html containerPadding="0px" html={`<table style="width:100%;border-collapse:collapse;border-top:3px solid ${colors.ink};"><tbody>${detailRow('PHONE', escapeHtml(company.supportPhone), colors, true)}${detailRow('EMAIL', escapeHtml(company.supportEmail), colors)}${detailRow('VERIFY', escapeHtml(company.verificationUrl), colors)}</tbody></table>`} />
        </Column>
      </Row>

      <Row backgroundColor={colors.paper} className="rk-keep" layout={ColumnLayouts.OneColumn} padding="20px 36px 24px">
        <Column>
          {sectionLabel('STAFF ACKNOWLEDGEMENT', colors.accent)}
          <Paragraph color={colors.ink} containerPadding="0px 0px 8px" fontSize="15px" fontWeight={600} lineHeight="165%" text="I confirm that I have read this bulletin and completed the required quarantine and escalation checks." />
          <Html containerPadding="0px" html={acknowledgementFieldsHtml(colors)} />
        </Column>
      </Row>

      <Row backgroundColor={colors.ink} className="rk-keep" layout={ColumnLayouts.OneColumn} padding="16px 36px">
        <Column>
          <Paragraph color="#C7C4D8" containerPadding="0px 0px 6px" fontFamily={MONO_FONT} fontSize="11px" letterSpacing="0.5px" lineHeight="150%" text={escapeHtml(`RECALL ${incident.id} · UPDATED ${formatDate(incident.updatedAt).toUpperCase()}`)} />
          <Paragraph color="#B7B3D0" containerPadding="0px" fontSize="11px" lineHeight="150%" text="This is a fictional recall scenario created for demonstration purposes. No real products, companies, or safety incidents are represented." />
        </Column>
      </Row>
    </Document>
  )
}
