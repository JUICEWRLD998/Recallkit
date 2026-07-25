import {
  Column,
  ColumnLayouts,
  Document,
  Heading,
  Paragraph,
  Row,
} from '@unlayer/react-elements'
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

function severityStripBackground(severity: RecallIncident['severity']): string {
  if (severity === 'advisory') return COLORS.ink
  return severityColor(severity)
}

export function RetailerActionBulletin({ incident }: RetailerActionBulletinProps) {
  const { company, product, risk, action } = incident

  return (
    <Document
      backgroundColor={COLORS.paper}
      contentWidth="760px"
      fontFamily={{ label: 'Arial', value: 'Arial, Helvetica, sans-serif' }}
      textColor={COLORS.ink}
    >
      <Row
        backgroundColor={COLORS.ink}
        layout={ColumnLayouts.TwoWideNarrow}
        noStackMobile
        padding="24px 32px"
      >
        <Column>
          <Heading
            color={COLORS.surface}
            fontSize="12px"
            fontWeight={700}
            headingType="h4"
          >
            RETAILER ACTION BULLETIN
          </Heading>
          <Heading
            color={COLORS.surface}
            fontSize="24px"
            fontWeight={700}
            headingType="h1"
            lineHeight="120%"
          >
            {incident.title}
          </Heading>
        </Column>
        <Column>
          <Paragraph
            color="#C9D0CE"
            fontSize="11px"
            html={`Recall ID<br><b>${incident.id}</b>`}
            lineHeight="145%"
            textAlign="right"
          />
          <Paragraph
            color="#C9D0CE"
            fontSize="11px"
            html={`Issued ${formatDateShort(incident.announcedAt)}`}
            textAlign="right"
          />
        </Column>
      </Row>

      <Row
        backgroundColor={severityStripBackground(incident.severity)}
        layout={ColumnLayouts.TwoWideNarrow}
        noStackMobile
        padding="11px 32px"
      >
        <Column>
          <Heading
            color={COLORS.surface}
            fontSize="13px"
            fontWeight={700}
            headingType="h3"
          >
            {severityMessage(incident.severity)}
          </Heading>
        </Column>
        <Column>
          <Paragraph
            color={COLORS.surface}
            fontSize="12px"
            html={`Status: ${statusLabel(incident.status)}`}
            textAlign="right"
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.TwoEqual}
        padding="24px 32px 16px"
      >
        <Column>
          <Heading
            color={COLORS.muted}
            fontSize="11px"
            fontWeight={700}
            headingType="h4"
          >
            PRODUCT IDENTIFICATION
          </Heading>
          <Paragraph
            color={COLORS.ink}
            fontSize="14px"
            html={`<b>Product:</b> ${product.name}<br><b>Model:</b> ${product.model}<br><b>Company:</b> ${company.name}`}
            lineHeight="180%"
          />
        </Column>
        <Column>
          <Paragraph
            html={`<img src="${product.imageUrl}" alt="${product.name}" style="max-width:100%;height:auto;border-radius:4px" />`}
          />
          <Paragraph
            color={COLORS.muted}
            fontSize="11px"
            html="Refer to product packaging for visual identification."
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        padding="8px 32px 16px"
        layout={ColumnLayouts.OneColumn}
      >
        <Column
          backgroundColor={COLORS.ink}
          borderRadius="6px"
          padding="16px 20px"
        >
          <Heading
            color={COLORS.surface}
            fontSize="11px"
            fontWeight={700}
            headingType="h4"
          >
            AFFECTED BATCH IDENTIFIERS
          </Heading>
          <Paragraph
            color={COLORS.surface}
            fontSize="20px"
            html={product.affectedBatches.map(b => `<b>${b}</b>`).join('<br>')}
          />
          <Paragraph
            color="#C9D0CE"
            fontSize="11px"
            html="Check the rear label or underside of the product packaging"
            lineHeight="150%"
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="16px 32px"
      >
        <Column>
          <Heading
            color={COLORS.muted}
            fontSize="11px"
            fontWeight={700}
            headingType="h4"
          >
            RISK SUMMARY
          </Heading>
          <Heading
            color={COLORS.ink}
            fontSize="16px"
            fontWeight={700}
            headingType="h3"
          >
            {risk.headline}
          </Heading>
          <Paragraph
            color={COLORS.ink}
            fontSize="14px"
            html={risk.description}
            lineHeight="165%"
          />
          {hasIncidentCounts(risk) && (
            <Paragraph
              color={COLORS.ink}
              fontSize="13px"
              html={[
                risk.reportedIncidents != null ? `<b>Reported incidents:</b> ${risk.reportedIncidents}` : '',
                risk.reportedInjuries != null ? `<b>Reported injuries:</b> ${risk.reportedInjuries}` : '',
              ].filter(Boolean).join('<br>')}
            />
          )}
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="16px 32px"
      >
        <Column>
          <Heading
            color={COLORS.muted}
            fontSize="11px"
            fontWeight={700}
            headingType="h4"
          >
            IMMEDIATE QUARANTINE CHECKLIST
          </Heading>
          <Paragraph
            color={COLORS.ink}
            fontSize="14px"
            html={`<b>${action.immediateInstruction}</b>`}
            lineHeight="160%"
          />
          <Paragraph
            color={COLORS.ink}
            fontSize="13px"
            html={[
              '☐ Stop sales and online fulfillment of affected product',
              '☐ Quarantine matching stock — segregate from saleable inventory',
              '☐ Brief customer-facing staff on the recall',
              '☐ Record the isolated unit count and report to manager',
              '☐ Post recall notice at point of sale if applicable',
            ].join('<br>')}
            lineHeight="200%"
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="16px 32px"
      >
        <Column>
          <Heading
            color={COLORS.muted}
            fontSize="11px"
            fontWeight={700}
            headingType="h4"
          >
            INSTRUCTIONS FOR HANDLING CUSTOMER QUESTIONS
          </Heading>
          <Paragraph
            color={COLORS.ink}
            fontSize="14px"
            html={`<b>If a customer reports this product:</b><br>1. Thank the customer for bringing it to your attention.<br>2. Confirm the batch identifier against the affected list above.<br>3. If affected, process the return per the disposition instructions below.<br>4. Direct the customer to ${company.verificationUrl} or ${company.supportPhone} for status updates.<br>5. Do not advise the customer on safety — refer them to the official recall notice.`}
            lineHeight="175%"
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="16px 32px"
      >
        <Column>
          <Heading
            color={COLORS.muted}
            fontSize="11px"
            fontWeight={700}
            headingType="h4"
          >
            RETURN AND INVENTORY DISPOSITION
          </Heading>
          <Paragraph
            color={COLORS.ink}
            fontSize="14px"
            html={`<b>Remedy:</b> ${remedyLabel(action.remedyType)} — ${action.remedyDescription}`}
            lineHeight="165%"
          />
          <Paragraph
            color={COLORS.ink}
            fontSize="14px"
            html={`<b>Return process:</b> ${action.returnInstructions}`}
            lineHeight="165%"
          />
          {hasDeadline(action) && (
            <Paragraph
              color={COLORS.critical}
              fontSize="13px"
              html={`<b>Response deadline: ${formatDate(action.responseDeadline!)}</b>`}
            />
          )}
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="16px 32px"
      >
        <Column>
          <Heading
            color={COLORS.muted}
            fontSize="11px"
            fontWeight={700}
            headingType="h4"
          >
            ESCALATION CONTACTS
          </Heading>
          <Paragraph
            color={COLORS.ink}
            fontSize="14px"
            html={`<b>Phone:</b> ${company.supportPhone}<br><b>Email:</b> ${company.supportEmail}<br><b>Hours:</b> ${company.supportHours}<br><b>Verification:</b> ${company.verificationUrl}`}
            lineHeight="180%"
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="16px 32px 24px"
      >
        <Column>
          <Heading
            color={COLORS.muted}
            fontSize="11px"
            fontWeight={700}
            headingType="h4"
          >
            STAFF ACKNOWLEDGEMENT
          </Heading>
          <Paragraph
            color={COLORS.muted}
            fontSize="13px"
            html="I confirm that I have read this bulletin, understand the required actions, and have completed the quarantine checklist above."
            lineHeight="180%"
          />
          <Paragraph
            color={COLORS.ink}
            fontSize="13px"
            html="Name: ___________________________<br>Position: ___________________________<br>Store/Location: ___________________________<br>Date: ___________________________<br>Signature: ___________________________"
            lineHeight="280%"
          />
        </Column>
      </Row>

      <Row
        backgroundColor={COLORS.paper}
        layout={ColumnLayouts.OneColumn}
        padding="16px 32px"
      >
        <Column>
          <Paragraph
            color={COLORS.muted}
            fontSize="11px"
            html="This is a fictional recall scenario created for demonstration purposes. No real products, companies, or safety incidents are represented."
            lineHeight="155%"
          />
          <Paragraph
            color={COLORS.muted}
            fontSize="11px"
            html={`Recall ${incident.id} · Issued ${formatDateShort(incident.announcedAt)} · Last updated ${formatDate(incident.updatedAt)}`}
            lineHeight="155%"
          />
        </Column>
      </Row>
    </Document>
  )
}
