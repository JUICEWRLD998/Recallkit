import {
  Button,
  Column,
  ColumnLayouts,
  Document,
  Email,
  Heading,
  Page,
  Paragraph,
  Row,
  renderToHtml,
  renderToJson,
  type DesignJSON,
} from '@unlayer/react-elements'
import type { ReactElement } from 'react'

export type SpikeOutput = 'email' | 'document' | 'page'

export interface SpikeArtifact {
  html: string
  htmlFilename: string
  json: DesignJSON
  jsonFilename: string
  label: string
}

const FONT = {
  label: 'Arial',
  value: 'Arial, Helvetica, sans-serif',
}

const COLORS = {
  ink: '#111820',
  paper: '#F4F6F5',
  surface: '#FFFFFF',
  critical: '#D92D20',
  muted: '#66716F',
}

const INCIDENT = {
  company: 'Northline Devices',
  product: 'Arc 20K Power Bank',
  model: 'NL-A20',
  recallId: 'RK-2026-071',
  batch: 'A20-2604-17',
}

function emailSpike(): ReactElement {
  return (
    <Email
      backgroundColor={COLORS.paper}
      contentWidth="600px"
      fontFamily={FONT}
      previewText="Important safety recall for the Arc 20K Power Bank."
      textColor={COLORS.ink}
    >
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="28px 40px 16px 40px"
      >
        <Column>
          <Heading
            color={COLORS.ink}
            fontSize="19px"
            fontWeight={700}
            headingType="h2"
          >
            {INCIDENT.company}
          </Heading>
        </Column>
      </Row>
      <Row
        backgroundColor={COLORS.critical}
        layout={ColumnLayouts.OneColumn}
        padding="10px 40px"
      >
        <Column>
          <Heading
            color={COLORS.surface}
            fontSize="12px"
            fontWeight={700}
            headingType="h4"
          >
            HIGH SEVERITY PRODUCT RECALL
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
            color={COLORS.ink}
            fontSize="30px"
            fontWeight={700}
            headingType="h1"
            lineHeight="118%"
          >
            Stop using your power bank immediately.
          </Heading>
          <Paragraph
            color={COLORS.muted}
            fontSize="16px"
            html={`The <b>${INCIDENT.product}</b> may overheat while charging. Disconnect it and check the batch identifier below.`}
            lineHeight="155%"
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
            color={COLORS.surface}
            fontSize="11px"
            fontWeight={700}
            headingType="h4"
          >
            AFFECTED BATCH PLATE
          </Heading>
          <Heading
            color={COLORS.surface}
            fontSize="24px"
            fontWeight={700}
            headingType="h2"
            lineHeight="120%"
          >
            {INCIDENT.batch}
          </Heading>
          <Paragraph
            color="#C9D0CE"
            fontSize="12px"
            html={`Model ${INCIDENT.model} / Recall ${INCIDENT.recallId}`}
            lineHeight="145%"
          />
        </Column>
      </Row>
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="8px 40px 36px 40px"
      >
        <Column>
          <Button
            backgroundColor={COLORS.critical}
            borderRadius="6px"
            color={COLORS.surface}
            fontSize="15px"
            fontWeight={700}
            href="https://example.com/recalls/RK-2026-071"
            padding="14px 24px"
            textAlign="center"
            width="100%"
          >
            Check my product
          </Button>
        </Column>
      </Row>
    </Email>
  )
}

function documentSpike(): ReactElement {
  return (
    <Document
      backgroundColor={COLORS.paper}
      contentWidth="760px"
      fontFamily={FONT}
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
            fontSize="26px"
            fontWeight={700}
            headingType="h1"
          >
            {INCIDENT.product}
          </Heading>
        </Column>
        <Column>
          <Paragraph
            color="#C9D0CE"
            fontSize="11px"
            html={`Recall ID<br><b>${INCIDENT.recallId}</b>`}
            lineHeight="145%"
            textAlign="right"
          />
        </Column>
      </Row>
      <Row
        backgroundColor={COLORS.critical}
        layout={ColumnLayouts.OneColumn}
        padding="11px 32px"
      >
        <Column>
          <Heading
            color={COLORS.surface}
            fontSize="13px"
            fontWeight={700}
            headingType="h3"
          >
            REMOVE AFFECTED STOCK FROM SALE
          </Heading>
        </Column>
      </Row>
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.TwoEqual}
        padding="28px 32px 12px 32px"
      >
        <Column>
          <Heading
            color={COLORS.muted}
            fontSize="11px"
            fontWeight={700}
            headingType="h4"
          >
            PRODUCT
          </Heading>
          <Paragraph
            color={COLORS.ink}
            fontSize="15px"
            html={`<b>${INCIDENT.product}</b><br>Model ${INCIDENT.model}`}
            lineHeight="150%"
          />
        </Column>
        <Column>
          <Heading
            color={COLORS.muted}
            fontSize="11px"
            fontWeight={700}
            headingType="h4"
          >
            ACTION OWNER
          </Heading>
          <Paragraph
            color={COLORS.ink}
            fontSize="15px"
            html="<b>Store manager</b><br>Complete before opening"
            lineHeight="150%"
          />
        </Column>
      </Row>
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="14px 32px"
      >
        <Column
          backgroundColor={COLORS.ink}
          borderRadius="6px"
          padding="16px 18px"
        >
          <Heading
            color={COLORS.surface}
            fontSize="11px"
            fontWeight={700}
            headingType="h4"
          >
            AFFECTED BATCH PLATE
          </Heading>
          <Heading
            color={COLORS.surface}
            fontSize="24px"
            fontWeight={700}
            headingType="h2"
          >
            {INCIDENT.batch}
          </Heading>
        </Column>
      </Row>
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.OneColumn}
        padding="12px 32px 32px 32px"
      >
        <Column>
          <Heading
            color={COLORS.ink}
            fontSize="17px"
            fontWeight={700}
            headingType="h2"
          >
            Immediate checklist
          </Heading>
          <Paragraph
            color={COLORS.ink}
            fontSize="14px"
            html="1. Stop sales and online fulfillment.<br>2. Quarantine matching stock.<br>3. Brief customer-service staff.<br>4. Record the isolated unit count."
            lineHeight="175%"
          />
        </Column>
      </Row>
    </Document>
  )
}

function pageSpike(): ReactElement {
  return (
    <Page
      backgroundColor={COLORS.paper}
      contentWidth="960px"
      fontFamily={FONT}
      textColor={COLORS.ink}
    >
      <Row
        backgroundColor={COLORS.ink}
        layout={ColumnLayouts.TwoWideNarrow}
        noStackMobile
        padding="20px 32px"
      >
        <Column>
          <Heading
            color={COLORS.surface}
            fontSize="18px"
            fontWeight={700}
            headingType="h2"
          >
            {INCIDENT.company}
          </Heading>
        </Column>
        <Column>
          <Paragraph
            color="#C9D0CE"
            fontSize="12px"
            html={`Recall ${INCIDENT.recallId}`}
            textAlign="right"
          />
        </Column>
      </Row>
      <Row
        backgroundColor={COLORS.critical}
        layout={ColumnLayouts.OneColumn}
        padding="10px 32px"
      >
        <Column>
          <Heading
            color={COLORS.surface}
            fontSize="12px"
            fontWeight={700}
            headingType="h4"
          >
            ACTIVE SAFETY NOTICE
          </Heading>
        </Column>
      </Row>
      <Row
        backgroundColor={COLORS.surface}
        layout={ColumnLayouts.TwoWideNarrow}
        padding="52px 32px"
      >
        <Column>
          <Heading
            color={COLORS.critical}
            fontSize="12px"
            fontWeight={700}
            headingType="h4"
          >
            PRODUCT RECALL
          </Heading>
          <Heading
            color={COLORS.ink}
            fontSize="38px"
            fontWeight={700}
            headingType="h1"
            lineHeight="112%"
          >
            Check your Arc 20K before using it again.
          </Heading>
          <Paragraph
            color={COLORS.muted}
            fontSize="17px"
            html="A limited production run may overheat while charging. Stop use and compare the label on your device with the affected batch."
            lineHeight="160%"
          />
        </Column>
        <Column
          backgroundColor={COLORS.ink}
          borderRadius="6px"
          padding="20px"
        >
          <Heading
            color={COLORS.surface}
            fontSize="11px"
            fontWeight={700}
            headingType="h4"
          >
            AFFECTED BATCH
          </Heading>
          <Heading
            color={COLORS.surface}
            fontSize="22px"
            fontWeight={700}
            headingType="h2"
            lineHeight="125%"
          >
            {INCIDENT.batch}
          </Heading>
          <Paragraph
            color="#C9D0CE"
            fontSize="12px"
            html={`Model ${INCIDENT.model}`}
            lineHeight="145%"
          />
        </Column>
      </Row>
      <Row
        backgroundColor={COLORS.paper}
        layout={ColumnLayouts.ThreeEqual}
        padding="28px 32px 44px 32px"
      >
        <Column padding="0px 20px 0px 0px">
          <Heading
            color={COLORS.ink}
            fontSize="20px"
            fontWeight={700}
            headingType="h2"
          >
            01
          </Heading>
          <Paragraph
            color={COLORS.muted}
            fontSize="14px"
            html="<b>Disconnect</b><br>Unplug the unit and stop charging it."
            lineHeight="155%"
          />
        </Column>
        <Column padding="0px 20px">
          <Heading
            color={COLORS.ink}
            fontSize="20px"
            fontWeight={700}
            headingType="h2"
          >
            02
          </Heading>
          <Paragraph
            color={COLORS.muted}
            fontSize="14px"
            html="<b>Check</b><br>Compare the batch plate on the rear label."
            lineHeight="155%"
          />
        </Column>
        <Column padding="0px 0px 0px 20px">
          <Heading
            color={COLORS.ink}
            fontSize="20px"
            fontWeight={700}
            headingType="h2"
          >
            03
          </Heading>
          <Paragraph
            color={COLORS.muted}
            fontSize="14px"
            html="<b>Return</b><br>Request a prepaid return and replacement."
            lineHeight="155%"
          />
        </Column>
      </Row>
    </Page>
  )
}

function createArtifact(
  label: string,
  filenameBase: string,
  element: ReactElement,
): SpikeArtifact {
  return {
    html: renderToHtml(element, { title: label }),
    htmlFilename: `${filenameBase}.html`,
    json: renderToJson(element),
    jsonFilename: `${filenameBase}.elements.json`,
    label,
  }
}

export function createSpikeArtifacts(): Record<SpikeOutput, SpikeArtifact> {
  return {
    email: createArtifact(
      'Customer recall email',
      'recallkit-customer-email-spike',
      emailSpike(),
    ),
    document: createArtifact(
      'Retailer action bulletin',
      'recallkit-retailer-bulletin-spike',
      documentSpike(),
    ),
    page: createArtifact(
      'Public recall notice',
      'recallkit-public-notice-spike',
      pageSpike(),
    ),
  }
}
