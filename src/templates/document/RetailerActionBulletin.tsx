import {
  Column,
  ColumnLayouts,
  Document,
  Heading,
  Image,
  Paragraph,
  Row,
  Table,
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

const TABLE_BORDER = {
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: '#9AA3A0',
  borderRightWidth: '1px',
  borderRightStyle: 'solid',
  borderRightColor: '#9AA3A0',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: '#9AA3A0',
  borderLeftWidth: '1px',
  borderLeftStyle: 'solid',
  borderLeftColor: '#9AA3A0',
} as const

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

function severityStripBackground(severity: RecallIncident['severity']): string {
  return severity === 'advisory' ? COLORS.ink : severityColor(severity)
}

function sectionHeading(text: string) {
  return (
    <Heading
      color={COLORS.ink}
      fontSize="12px"
      fontWeight={700}
      headingType="h2"
      lineHeight="130%"
    >
      {text}
    </Heading>
  )
}

export function RetailerActionBulletin({ incident }: RetailerActionBulletinProps) {
  const { company, product, risk, action } = incident
  const productImageUrl = resolveProductImageUrl(product.imageUrl)
  const reportRows = [
    risk.reportedIncidents == null
      ? null
      : `<b>Reported incidents:</b> ${risk.reportedIncidents}`,
    risk.reportedInjuries == null
      ? null
      : `<b>Reported injuries:</b> ${risk.reportedInjuries}`,
  ].filter((value): value is string => value != null)

  return (
    <Document
      backgroundColor={COLORS.paper}
      contentWidth="704px"
      fontFamily={DOCUMENT_FONT}
      textColor={COLORS.ink}
    >
      <Row
        backgroundColor={COLORS.ink}
        layout={ColumnLayouts.TwoWideNarrow}
        noStackMobile
        padding="18px 26px"
      >
        <Column>
          <Heading color={COLORS.surface} fontSize="11px" fontWeight={700} headingType="h4">
            RETAILER ACTION BULLETIN
          </Heading>
          <Heading
            color={COLORS.surface}
            fontSize="22px"
            fontWeight={700}
            headingType="h1"
            lineHeight="118%"
          >
            {escapeHtml(incident.title)}
          </Heading>
        </Column>
        <Column>
          <Paragraph
            color="#D5DAD8"
            fontSize="10px"
            html={`Recall ID<br><b>${escapeHtml(incident.id)}</b><br>Issued ${formatDateShort(incident.announcedAt)}`}
            lineHeight="160%"
            textAlign="right"
          />
        </Column>
      </Row>

      <Row
        backgroundColor={severityStripBackground(incident.severity)}
        layout={ColumnLayouts.TwoWideNarrow}
        noStackMobile
        padding="9px 26px"
      >
        <Column>
          <Heading color={COLORS.surface} fontSize="12px" fontWeight={700} headingType="h3">
            {severityMessage(incident.severity)}
          </Heading>
        </Column>
        <Column>
          <Paragraph
            color={COLORS.surface}
            fontSize="11px"
            html={`<b>Status:</b> ${statusLabel(incident.status)}`}
            textAlign="right"
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.TwoWideNarrow}
        padding="18px 26px 10px"
      >
        <Column padding="0px 16px 0px 0px">
          {sectionHeading('PRODUCT IDENTIFICATION')}
          <Table
            headers={['Field', 'Identification']}
            data={[
              ['Product', escapeHtml(product.name)],
              ['Model', escapeHtml(product.model)],
              ['Company', escapeHtml(company.name)],
              ['Recall ID', escapeHtml(incident.id)],
            ]}
            border={TABLE_BORDER}
            padding="7px"
          />
        </Column>
        <Column>
          <Image
            src={productImageUrl}
            altText={escapeHtml(`${product.name}, model ${product.model}`)}
            textAlign="center"
          />
          <Paragraph
            color={COLORS.muted}
            fontSize="10px"
            lineHeight="140%"
            text={escapeHtml(`Image unavailable? Match model ${product.model} and the batch code on the product label.`)}
          />
        </Column>
      </Row>

      <Row backgroundColor={COLORS.surface} layout={ColumnLayouts.OneColumn} padding="8px 26px 14px">
        <Column>
          {sectionHeading('AFFECTED MODELS AND BATCHES')}
          <Table
            headers={['Affected model', 'Batch identifier', 'Required disposition']}
            data={product.affectedBatches.map((batch) => [
              escapeHtml(product.model),
              escapeHtml(batch),
              'QUARANTINE - DO NOT SELL',
            ])}
            border={TABLE_BORDER}
            padding="7px"
          />
          <Paragraph
            color={COLORS.muted}
            fontSize="10px"
            lineHeight="140%"
            text="Batch identifiers are printed on the rear label or underside of the product packaging."
          />
        </Column>
      </Row>

      <Row backgroundColor="#F3F4F3" layout={ColumnLayouts.OneColumn} padding="13px 26px">
        <Column>
          {sectionHeading('RISK SUMMARY')}
          <Heading color={COLORS.ink} fontSize="15px" fontWeight={700} headingType="h3">
            {escapeHtml(risk.headline)}
          </Heading>
          <Paragraph color={COLORS.ink} fontSize="12px" lineHeight="150%" text={escapeHtml(risk.description)} />
          {hasIncidentCounts(risk) && (
            <Paragraph
              color={COLORS.ink}
              fontSize="11px"
              html={reportRows.join(' &nbsp; | &nbsp; ')}
            />
          )}
        </Column>
      </Row>

      <Row backgroundColor={COLORS.surface} layout={ColumnLayouts.OneColumn} padding="14px 26px">
        <Column
          backgroundColor="#F7F7F6"
          border={TABLE_BORDER}
          borderRadius="2px"
          padding="12px 14px"
        >
          {sectionHeading('IMMEDIATE QUARANTINE CHECKLIST')}
          <Paragraph
            color={COLORS.ink}
            fontSize="12px"
            html={`<b>${escapeHtml(action.immediateInstruction)}</b>`}
            lineHeight="150%"
          />
          <Paragraph
            color={COLORS.ink}
            fontSize="12px"
            html={[
              '&#9744;&nbsp; Stop sales and online fulfillment of affected product',
              '&#9744;&nbsp; Quarantine matching stock away from saleable inventory',
              '&#9744;&nbsp; Record isolated units and affected batch identifiers',
              '&#9744;&nbsp; Brief customer-facing and fulfillment staff',
              '&#9744;&nbsp; Notify the store or warehouse manager',
            ].join('<br>')}
            lineHeight="190%"
          />
        </Column>
      </Row>

      <Row backgroundColor={COLORS.surface} layout={ColumnLayouts.OneColumn} padding="10px 26px">
        <Column>
          {sectionHeading('HANDLING CUSTOMER QUESTIONS')}
          <Paragraph
            color={COLORS.ink}
            fontSize="12px"
            html={`<b>1.</b> Thank the customer and confirm the model and batch identifier.<br><b>2.</b> If affected, stop use and process the return below.<br><b>3.</b> Direct status questions to ${escapeHtml(company.verificationUrl)} or ${escapeHtml(company.supportPhone)}.<br><b>4.</b> Do not provide independent safety advice; refer to the official recall notice.`}
            lineHeight="165%"
          />
        </Column>
      </Row>

      <Row backgroundColor={COLORS.surface} layout={ColumnLayouts.OneColumn} padding="10px 26px">
        <Column>
          {sectionHeading('RETURN AND INVENTORY DISPOSITION')}
          <Paragraph
            color={COLORS.ink}
            fontSize="12px"
            html={`<b>${remedyLabel(action.remedyType)}:</b> ${escapeHtml(action.remedyDescription)}`}
            lineHeight="155%"
          />
          <Paragraph
            color={COLORS.ink}
            fontSize="12px"
            html={`<b>Return process:</b> ${escapeHtml(action.returnInstructions)}`}
            lineHeight="155%"
          />
          {hasDeadline(action) && (
            <Paragraph
              color={COLORS.critical}
              fontSize="11px"
              html={`<b>Response deadline: ${formatDate(action.responseDeadline!)}</b>`}
            />
          )}
        </Column>
      </Row>

      <Row backgroundColor={COLORS.surface} layout={ColumnLayouts.TwoEqual} padding="10px 26px 14px">
        <Column padding="0px 14px 0px 0px">
          {sectionHeading('ESCALATION CHECKLIST')}
          <Paragraph
            color={COLORS.ink}
            fontSize="11px"
            html={[
              '&#9744;&nbsp; Stock cannot be fully isolated',
              '&#9744;&nbsp; A fire, injury, smoke, or swelling is reported',
              '&#9744;&nbsp; Affected online orders have shipped',
              '&#9744;&nbsp; Batch identification is unclear or disputed',
            ].join('<br>')}
            lineHeight="185%"
          />
        </Column>
        <Column>
          {sectionHeading('ESCALATION CONTACTS')}
          <Table
            headers={['Channel', 'Contact']}
            data={[
              ['Phone', escapeHtml(company.supportPhone)],
              ['Email', escapeHtml(company.supportEmail)],
              ['Hours', escapeHtml(company.supportHours)],
              ['Verification', escapeHtml(company.verificationUrl)],
            ]}
            border={TABLE_BORDER}
            padding="6px"
          />
        </Column>
      </Row>

      <Row backgroundColor="#F3F4F3" layout={ColumnLayouts.OneColumn} padding="14px 26px">
        <Column>
          {sectionHeading('STAFF ACKNOWLEDGEMENT')}
          <Paragraph
            color={COLORS.muted}
            fontSize="11px"
            lineHeight="150%"
            text="I confirm that I have read this bulletin and completed the required quarantine and escalation checks."
          />
          <Paragraph
            color={COLORS.ink}
            fontSize="11px"
            html="Name: __________________________ &nbsp;&nbsp; Position: __________________________<br>Store / location: __________________________ &nbsp;&nbsp; Units isolated: __________<br>Signature: __________________________ &nbsp;&nbsp; Date / time: __________________________"
            lineHeight="230%"
          />
        </Column>
      </Row>

      <Row backgroundColor={COLORS.ink} layout={ColumnLayouts.OneColumn} padding="12px 26px">
        <Column>
          <Paragraph
            color="#D5DAD8"
            fontSize="9px"
            lineHeight="145%"
            text="This is a fictional recall scenario created for demonstration purposes. No real products, companies, or safety incidents are represented."
          />
          <Paragraph
            color="#D5DAD8"
            fontSize="9px"
            lineHeight="145%"
            text={escapeHtml(`Recall ${incident.id} | Issued ${formatDateShort(incident.announcedAt)} | Last updated ${formatDate(incident.updatedAt)}`)}
          />
        </Column>
      </Row>
    </Document>
  )
}
