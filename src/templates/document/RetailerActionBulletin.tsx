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
import defaultProductImageUrl from '../../assets/hero.png?inline'
import type { RecallIncident } from '../../domain/recall-schema'
import {
  formatDate,
  formatDateShort,
  hasDeadline,
  hasIncidentCounts,
  remedyLabel,
  statusLabel,
} from '../../domain/recall-selectors'
import { COLORS, severityColor } from '../shared/colors'

export interface RetailerActionBulletinProps {
  incident: RecallIncident
}

const DOCUMENT_FONT = {
  label: 'Arial',
  value: 'Arial, Helvetica, sans-serif',
}

const MONO_FONT = {
  label: 'Courier New',
  value: "'Courier New', Courier, monospace",
}

const MONO_STACK = "'Courier New', Courier, monospace"

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
  if (!trimmed || trimmed === '/assets/hero.png') return defaultProductImageUrl
  if (trimmed.startsWith('data:image/')) return trimmed
  return safeHttpUrl(trimmed) === '#' ? defaultProductImageUrl : trimmed
}

function severityMessage(severity: RecallIncident['severity']): string {
  switch (severity) {
    case 'critical':
      return 'CRITICAL - REMOVE AFFECTED STOCK IMMEDIATELY'
    case 'high':
      return 'HIGH SEVERITY - REMOVE AFFECTED STOCK FROM SALE'
    case 'advisory':
      return 'ADVISORY - REVIEW STOCK AND MONITOR'
  }
}

function sectionLabel(text: string) {
  return (
    <Heading
      color={COLORS.ink}
      containerPadding="0px 0px 5px"
      fontSize="10px"
      fontWeight={700}
      headingType="h2"
      letterSpacing="1.5px"
      lineHeight="130%"
    >
      {text}
    </Heading>
  )
}

function identificationRowHtml(label: string, valueHtml: string, mono: boolean): string {
  const valueFont = mono
    ? `font-family:${MONO_STACK};font-weight:700;letter-spacing:0.5px;`
    : ''
  return (
    `<tr>` +
    `<td style="width:32%;padding:6px 8px 6px 0;border-bottom:1px solid ${COLORS.line};` +
    `font-size:8px;font-weight:700;letter-spacing:1px;color:${COLORS.muted};vertical-align:top;">${label}</td>` +
    `<td style="padding:6px 0;border-bottom:1px solid ${COLORS.line};` +
    `font-size:11px;line-height:145%;color:${COLORS.ink};${valueFont}vertical-align:top;overflow-wrap:anywhere;">${valueHtml}</td>` +
    `</tr>`
  )
}

function identificationTableHtml(incident: RecallIncident): string {
  const { company, product } = incident
  const rows = [
    identificationRowHtml('PRODUCT', `<b>${escapeHtml(product.name)}</b>`, false),
    identificationRowHtml('MODEL', escapeHtml(product.model), true),
    identificationRowHtml('COMPANY', escapeHtml(company.name), false),
    identificationRowHtml('RECALL ID', escapeHtml(incident.id), true),
  ].join('')
  return `<table style="width:100%;border-collapse:collapse;border-top:2px solid ${COLORS.ink};"><tbody>${rows}</tbody></table>`
}

function batchPlateHtml(incident: RecallIncident): string {
  const { product } = incident
  const chips = product.affectedBatches
    .map(
      (batch) =>
        `<span style="display:inline-block;border:1px solid ${COLORS.ink};padding:6px 12px;margin:0 8px 8px 0;` +
        `font-family:${MONO_STACK};font-weight:700;font-size:15px;letter-spacing:0.5px;color:${COLORS.ink};` +
        `max-width:100%;overflow-wrap:anywhere;word-break:break-all;">` +
        `${escapeHtml(batch)}</span>`,
    )
    .join('')
  return (
    `<div class="rk-plate" style="border:2px solid ${COLORS.ink};">` +
    `<div style="background:${COLORS.ink};color:#FFFFFF;padding:7px 12px;">` +
    `<table style="width:100%;border-collapse:collapse;"><tbody><tr>` +
    `<td style="padding:0;font-size:9px;font-weight:700;letter-spacing:1.5px;color:#FFFFFF;white-space:nowrap;vertical-align:top;">AFFECTED BATCH IDENTIFIERS</td>` +
    `<td style="padding:0 0 0 12px;text-align:right;font-family:${MONO_STACK};font-size:10px;font-weight:700;letter-spacing:1px;color:#FFFFFF;vertical-align:top;overflow-wrap:anywhere;word-break:break-all;">MODEL ${escapeHtml(product.model)}</td>` +
    `</tr></tbody></table>` +
    `</div>` +
    `<div style="padding:12px 12px 4px;">${chips}</div>` +
    `<div style="border-top:2px solid ${COLORS.ink};background:#EFF1F0;padding:7px 12px;` +
    `font-size:9.5px;font-weight:700;letter-spacing:1px;color:${COLORS.ink};">` +
    `REQUIRED DISPOSITION: QUARANTINE - DO NOT SELL` +
    `</div>` +
    `</div>`
  )
}

function checkRowsHtml(items: string[], numbered: boolean): string {
  return items
    .map((item, index) => {
      const number = numbered
        ? `<span style="flex:0 0 auto;font-family:${MONO_STACK};font-size:10px;font-weight:700;color:${COLORS.muted};padding:2px 8px 0 0;">${String(index + 1).padStart(2, '0')}</span>`
        : ''
      return (
        `<div class="rk-line" style="display:flex;align-items:flex-start;padding:7px 0;border-bottom:1px solid ${COLORS.line};">` +
        `<span style="flex:0 0 auto;width:12px;height:12px;border:1.5px solid ${COLORS.ink};margin:2px 10px 0 1px;"></span>` +
        number +
        `<span style="font-size:11px;line-height:150%;color:${COLORS.ink};">${item}</span>` +
        `</div>`
      )
    })
    .join('')
}

function numberedRowsHtml(items: string[]): string {
  return items
    .map(
      (item, index) =>
        `<div style="display:flex;align-items:flex-start;padding:7px 0;border-bottom:1px solid ${COLORS.line};">` +
        `<span style="flex:0 0 auto;width:22px;font-family:${MONO_STACK};font-size:10.5px;font-weight:700;color:${COLORS.ink};padding-top:1px;">${index + 1}.</span>` +
        `<span style="font-size:11px;line-height:150%;color:${COLORS.ink};">${item}</span>` +
        `</div>`,
    )
    .join('')
}

function ruledListHtml(rowsHtml: string): string {
  return `<div style="border-top:2px solid ${COLORS.ink};">${rowsHtml}</div>`
}

function acknowledgementFieldHtml(label: string): string {
  return (
    `<td style="width:33.33%;padding:18px 22px 0 0;">` +
    `<div style="height:26px;border-bottom:1px solid ${COLORS.ink};"></div>` +
    `<div style="padding-top:4px;font-size:8px;font-weight:700;letter-spacing:1px;color:${COLORS.muted};">${label}</div>` +
    `</td>`
  )
}

function acknowledgementFieldsHtml(): string {
  const rowOne = ['NAME', 'POSITION', 'STORE / LOCATION']
    .map(acknowledgementFieldHtml)
    .join('')
  const rowTwo = ['UNITS ISOLATED', 'SIGNATURE', 'DATE / TIME']
    .map(acknowledgementFieldHtml)
    .join('')
  return `<table style="width:100%;border-collapse:collapse;"><tbody><tr>${rowOne}</tr><tr>${rowTwo}</tr></tbody></table>`
}

function returnsHtml(incident: RecallIncident): string {
  const { action } = incident
  const deadline = hasDeadline(action)
    ? `<div style="margin-top:10px;border:1.5px solid ${COLORS.ink};border-left:5px solid ${COLORS.critical};padding:8px 12px;">` +
      `<span style="font-size:8px;font-weight:700;letter-spacing:1px;color:${COLORS.muted};">RESPONSE DEADLINE</span><br>` +
      `<span style="font-size:12px;font-weight:700;color:${COLORS.ink};">${formatDate(action.responseDeadline!)}</span>` +
      `</div>`
    : ''
  return (
    `<div style="border-top:2px solid ${COLORS.ink};">` +
    `<div style="padding:7px 0;border-bottom:1px solid ${COLORS.line};font-size:11px;line-height:150%;color:${COLORS.ink};">` +
    `<b>${escapeHtml(remedyLabel(action.remedyType))}:</b> ${escapeHtml(action.remedyDescription)}</div>` +
    `<div style="padding:7px 0;border-bottom:1px solid ${COLORS.line};font-size:11px;line-height:150%;color:${COLORS.ink};">` +
    `<b>Return process:</b> ${escapeHtml(action.returnInstructions)}</div>` +
    deadline +
    `</div>`
  )
}

const QUARANTINE_STEPS = [
  'Stop sales and online fulfillment of affected product',
  'Quarantine matching stock away from saleable inventory',
  'Record isolated units and affected batch identifiers',
  'Brief customer-facing and fulfillment staff',
  'Notify the store or warehouse manager',
]

const ESCALATION_TRIGGERS = [
  'Stock cannot be fully isolated',
  'A fire, injury, smoke, or swelling is reported',
  'Affected online orders have shipped',
  'Batch identification is unclear or disputed',
]

export function RetailerActionBulletin({ incident }: RetailerActionBulletinProps) {
  const { company, product, risk, action } = incident
  const productImageUrl = resolveProductImageUrl(product.imageUrl)
  const severityBar = severityColor(incident.severity)
  const riskStats = [
    risk.reportedIncidents == null
      ? null
      : `REPORTED INCIDENTS: <b>${risk.reportedIncidents}</b>`,
    risk.reportedInjuries == null
      ? null
      : `REPORTED INJURIES: <b>${risk.reportedInjuries}</b>`,
  ].filter((value): value is string => value != null)
  const customerQuestionSteps = [
    'Thank the customer and confirm the model and batch identifier.',
    'If affected, stop use and process the return below.',
    `Direct status questions to ${escapeHtml(company.verificationUrl)} or ${escapeHtml(company.supportPhone)}.`,
    'Do not provide independent safety advice; refer to the official recall notice.',
  ]

  return (
    <Document
      backgroundColor={COLORS.paper}
      contentWidth="656px"
      fontFamily={DOCUMENT_FONT}
      textColor={COLORS.ink}
    >
      <Row
        backgroundColor={COLORS.ink}
        className="rk-keep"
        layout={ColumnLayouts.TwoWideNarrow}
        noStackMobile
        padding="16px 26px 14px"
      >
        <Column padding="0px 16px 0px 0px">
          <Heading
            color="#8D9996"
            containerPadding="0px 0px 6px"
            fontSize="9px"
            fontWeight={700}
            headingType="h4"
            letterSpacing="2px"
            lineHeight="120%"
          >
            RETAILER ACTION BULLETIN
          </Heading>
          <Heading
            color={COLORS.surface}
            containerPadding="0px"
            fontSize="21px"
            fontWeight={700}
            headingType="h1"
            lineHeight="120%"
          >
            {escapeHtml(incident.title)}
          </Heading>
          <Paragraph
            color="#A9B4B1"
            containerPadding="6px 0px 0px"
            fontSize="10px"
            lineHeight="140%"
            text={escapeHtml(`Issued by ${company.name}`)}
          />
        </Column>
        <Column>
          <Html
            containerPadding="0px"
            html={
              `<div style="text-align:right;font-family:${DOCUMENT_FONT.value};">` +
              `<div style="font-size:8px;font-weight:700;letter-spacing:1.5px;color:#8D9996;padding-bottom:5px;">RECALL ID</div>` +
              `<div style="display:inline-block;max-width:100%;border:1px solid #4A555C;padding:6px 10px;font-family:${MONO_STACK};font-weight:700;font-size:15px;letter-spacing:1px;color:#FFFFFF;overflow-wrap:anywhere;word-break:break-all;">${escapeHtml(incident.id)}</div>` +
              `<div style="font-size:9px;color:#A9B4B1;padding-top:6px;">Issued ${escapeHtml(formatDateShort(incident.announcedAt))}</div>` +
              `</div>`
            }
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        className="rk-keep"
        layout={ColumnLayouts.TwoWideNarrow}
        noStackMobile
        padding="0px 26px"
      >
        <Column
          border={{
            borderTopWidth: '4px',
            borderTopStyle: 'solid',
            borderTopColor: severityBar,
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: COLORS.ink,
          }}
          padding="9px 0px"
        >
          <Heading
            color={COLORS.ink}
            containerPadding="0px"
            fontSize="11px"
            fontWeight={700}
            headingType="h3"
            letterSpacing="0.5px"
            lineHeight="140%"
          >
            {severityMessage(incident.severity)}
          </Heading>
        </Column>
        <Column
          border={{
            borderTopWidth: '4px',
            borderTopStyle: 'solid',
            borderTopColor: severityBar,
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: COLORS.ink,
          }}
          padding="9px 0px"
        >
          <Paragraph
            color={COLORS.ink}
            containerPadding="0px"
            fontSize="10px"
            html={`<b>STATUS: ${escapeHtml(statusLabel(incident.status).toUpperCase())}</b> &nbsp;&middot;&nbsp; UPDATED ${escapeHtml(formatDateShort(incident.updatedAt).toUpperCase())}`}
            lineHeight="155%"
            textAlign="right"
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        className="rk-keep"
        layout={ColumnLayouts.TwoWideNarrow}
        noStackMobile
        padding="16px 26px 6px"
      >
        <Column padding="0px 20px 0px 0px">
          {sectionLabel('PRODUCT IDENTIFICATION')}
          <Html containerPadding="0px" html={identificationTableHtml(incident)} />
        </Column>
        <Column>
          <Image
            altText={escapeHtml(`${product.name}, model ${product.model}`)}
            containerPadding="2px 0px 4px"
            maxWidth="150px"
            src={productImageUrl}
            textAlign="center"
          />
          <Paragraph
            color={COLORS.muted}
            containerPadding="0px"
            fontSize="9px"
            lineHeight="140%"
            text={escapeHtml(`Image unavailable? Match model ${product.model} and the batch code on the product label.`)}
            textAlign="center"
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        className="rk-keep"
        layout={ColumnLayouts.OneColumn}
        padding="8px 26px 12px"
      >
        <Column>
          {sectionLabel('AFFECTED MODELS AND BATCHES')}
          <Html containerPadding="0px" html={batchPlateHtml(incident)} />
          <Paragraph
            color={COLORS.muted}
            containerPadding="5px 0px 0px"
            fontSize="9px"
            lineHeight="140%"
            text="Batch identifiers are printed on the rear label or underside of the product packaging."
          />
        </Column>
      </Row>

      <Row
        backgroundColor="#F3F4F3"
        className="rk-keep"
        layout={ColumnLayouts.OneColumn}
        padding="12px 26px"
      >
        <Column>
          {sectionLabel('RISK SUMMARY')}
          <Heading
            color={COLORS.ink}
            containerPadding="0px 0px 3px"
            fontSize="14px"
            fontWeight={700}
            headingType="h3"
            lineHeight="130%"
          >
            {escapeHtml(risk.headline)}
          </Heading>
          <Paragraph
            color={COLORS.ink}
            containerPadding="0px"
            fontSize="11px"
            lineHeight="150%"
            text={escapeHtml(risk.description)}
          />
          {hasIncidentCounts(risk) && (
            <Paragraph
              color={COLORS.ink}
              containerPadding="6px 0px 0px"
              fontFamily={MONO_FONT}
              fontSize="9.5px"
              html={riskStats.join(' &nbsp;&middot;&nbsp; ')}
              letterSpacing="0.5px"
              lineHeight="140%"
            />
          )}
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        className="rk-keep"
        layout={ColumnLayouts.OneColumn}
        padding="14px 26px 8px"
      >
        <Column>
          {sectionLabel('IMMEDIATE QUARANTINE CHECKLIST')}
          <Html
            containerPadding="0px"
            html={
              `<div style="border-top:2px solid ${COLORS.ink};padding:7px 0;border-bottom:1px solid ${COLORS.line};` +
              `font-size:11px;font-weight:700;line-height:150%;color:${COLORS.ink};">${escapeHtml(action.immediateInstruction)}</div>` +
              checkRowsHtml(QUARANTINE_STEPS, true)
            }
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        className="rk-keep"
        layout={ColumnLayouts.OneColumn}
        padding="8px 26px"
      >
        <Column>
          {sectionLabel('HANDLING CUSTOMER QUESTIONS')}
          <Html
            containerPadding="0px"
            html={ruledListHtml(numberedRowsHtml(customerQuestionSteps))}
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        className="rk-keep"
        layout={ColumnLayouts.OneColumn}
        padding="8px 26px"
      >
        <Column>
          {sectionLabel('RETURN AND INVENTORY DISPOSITION')}
          <Html containerPadding="0px" html={returnsHtml(incident)} />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        className="rk-keep"
        layout={ColumnLayouts.TwoEqual}
        noStackMobile
        padding="8px 26px 14px"
      >
        <Column padding="0px 18px 0px 0px">
          {sectionLabel('ESCALATION CHECKLIST')}
          <Html
            containerPadding="0px"
            html={ruledListHtml(checkRowsHtml(ESCALATION_TRIGGERS, false))}
          />
        </Column>
        <Column>
          {sectionLabel('ESCALATION CONTACTS')}
          <Html
            containerPadding="0px"
            html={
              `<table style="width:100%;border-collapse:collapse;border-top:2px solid ${COLORS.ink};"><tbody>` +
              identificationRowHtml('PHONE', escapeHtml(company.supportPhone), true) +
              identificationRowHtml('EMAIL', escapeHtml(company.supportEmail), false) +
              identificationRowHtml('HOURS', escapeHtml(company.supportHours), false) +
              identificationRowHtml('VERIFY', escapeHtml(company.verificationUrl), false) +
              `</tbody></table>`
            }
          />
        </Column>
      </Row>

      <Row
        backgroundColor="#F3F4F3"
        className="rk-keep"
        layout={ColumnLayouts.OneColumn}
        padding="12px 26px 16px"
      >
        <Column>
          {sectionLabel('STAFF ACKNOWLEDGEMENT')}
          <Paragraph
            color={COLORS.ink}
            containerPadding="0px"
            fontSize="10px"
            lineHeight="150%"
            text="I confirm that I have read this bulletin and completed the required quarantine and escalation checks."
          />
          <Html containerPadding="0px" html={acknowledgementFieldsHtml()} />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.ink}
        className="rk-keep"
        layout={ColumnLayouts.OneColumn}
        padding="10px 26px"
      >
        <Column>
          <Paragraph
            color="#A9B4B1"
            containerPadding="0px 0px 3px"
            fontFamily={MONO_FONT}
            fontSize="8.5px"
            letterSpacing="0.5px"
            lineHeight="145%"
            text={escapeHtml(`RECALL ${incident.id} | ISSUED ${formatDateShort(incident.announcedAt).toUpperCase()} | LAST UPDATED ${formatDate(incident.updatedAt).toUpperCase()}`)}
          />
          <Paragraph
            color="#8D9996"
            containerPadding="0px"
            fontSize="8.5px"
            lineHeight="145%"
            text="This is a fictional recall scenario created for demonstration purposes. No real products, companies, or safety incidents are represented."
          />
        </Column>
      </Row>
    </Document>
  )
}
