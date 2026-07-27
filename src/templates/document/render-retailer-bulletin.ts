import { renderToHtml } from '@unlayer/react-elements'
import type { RecallIncident } from '../../domain/recall-schema'
import { RetailerActionBulletin } from './RetailerActionBulletin'

const DOCUMENT_STYLES = `
<style id="recallkit-document-styles">
  :root { --bulletin-page-width: 210mm; --bulletin-page-height: 297mm; }
  * { box-sizing: border-box; }
  table { border-collapse: collapse; }
  th { background: #e7eae8 !important; color: #17201e !important; font-weight: 700 !important; }
  th, td { vertical-align: top; overflow-wrap: anywhere; }
  h1, h2, h3, h4, p { orphans: 3; widows: 3; }
  .rk-keep, .rk-plate, .rk-line { break-inside: avoid; page-break-inside: avoid; }
  @page { size: auto; margin: 12mm; }
  @media screen {
    html { background: transparent; padding: 0; }
    body {
      width: var(--bulletin-page-width) !important;
      min-height: auto !important;
      height: auto !important;
      margin: 0 auto !important;
      background: #ffffff !important;
      box-shadow: 0 2px 16px rgba(23, 32, 30, 0.18);
    }
  }
  @media print {
    html, body {
      width: auto !important;
      min-width: 0 !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      box-shadow: none !important;
    }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .u-row-container, .u-row, .u-col, table, tr, img { break-inside: avoid; page-break-inside: avoid; }
    h1, h2, h3, h4 { break-after: avoid; page-break-after: avoid; }
    .u-row-container { max-width: 100% !important; }
  }
</style>`

export function renderRetailerBulletinHtml(incident: RecallIncident): string {
  const html = renderToHtml(RetailerActionBulletin({ incident }), {
    title: 'Retailer Action Bulletin',
  })

  return html.replace('</head>', `${DOCUMENT_STYLES}</head>`)
}
