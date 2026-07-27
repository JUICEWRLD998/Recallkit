import {
  renderToJson,
  renderToPlainText,
} from '@unlayer/react-elements'
import { describe, expect, it } from 'vitest'
import { sampleIncident } from '../../src/data/sample-incident'
import { RetailerActionBulletin } from '../../src/templates/document/RetailerActionBulletin'
import { renderRetailerBulletinHtml } from '../../src/templates/document/render-retailer-bulletin'

function bulletinTree() {
  return RetailerActionBulletin({ incident: sampleIncident })
}

describe('RetailerActionBulletin', () => {
  it('renders a complete print document with A4 preview and print rules', () => {
    const html = renderRetailerBulletinHtml(sampleIncident)

    expect(html).toMatch(/^<!DOCTYPE HTML/i)
    expect(html).toContain('id="recallkit-document-styles"')
    expect(html).toContain('--bulletin-page-width: 210mm')
    expect(html).toContain('@page { size: auto; margin: 12mm; }')
    expect(html).toContain('@media print')
    expect(html).toContain('break-inside: avoid')
    expect(html).toContain('.rk-keep, .rk-plate, .rk-line { break-inside: avoid; page-break-inside: avoid; }')
    expect(html).toContain('class="rk-keep"')
    expect(html).toContain('print-color-adjust: exact')
    expect(html).toContain('PRODUCT IDENTIFICATION')
    expect(html).toContain('AFFECTED MODELS AND BATCHES')
    expect(html).toContain('IMMEDIATE QUARANTINE CHECKLIST')
    expect(html).toContain('ESCALATION CHECKLIST')
    expect(html).toContain('STAFF ACKNOWLEDGEMENT')
    expect(html).toContain('<table')
    expect(html).not.toContain('width:33.33%;padding:20px')
    expect(html).toContain('QUARANTINE - DO NOT SELL')
    expect(html).toContain('data:image/png;base64,')
    expect(html).not.toContain('/assets/hero.png')
  })

  it('exports the operational content in Elements JSON', () => {
    const json = JSON.stringify(renderToJson(bulletinTree()))

    expect(json).toContain('"body"')
    expect(json).toContain(sampleIncident.product.name)
    expect(json).toContain(sampleIncident.product.affectedBatches[0])
    expect(json).toContain('IMMEDIATE QUARANTINE CHECKLIST')
    expect(json).toContain('STAFF ACKNOWLEDGEMENT')
  })

  it('keeps critical identification before the operational page-two content', () => {
    const text = renderToPlainText(bulletinTree()).toLowerCase()
    const identification = text.indexOf('product identification')
    const batches = text.indexOf(sampleIncident.product.affectedBatches[0].toLowerCase())
    const quarantine = text.indexOf('immediate quarantine checklist')
    const acknowledgement = text.indexOf('staff acknowledgement')

    expect(identification).toBeGreaterThan(-1)
    expect(batches).toBeGreaterThan(identification)
    expect(quarantine).toBeGreaterThan(batches)
    expect(acknowledgement).toBeGreaterThan(quarantine)
  })

  it('handles long batch data and escapes user-controlled markup', () => {
    const longIncident = structuredClone(sampleIncident)
    longIncident.product.name = '<script>alert("product")</script>'
    longIncident.action.returnInstructions = `Return safely ${'<b>today</b> '.repeat(80)}`
    longIncident.product.affectedBatches = Array.from(
      { length: 24 },
      (_, index) => `LONG-BATCH-${String(index + 1).padStart(2, '0')}`,
    )

    const html = renderRetailerBulletinHtml(longIncident)

    expect(html).toContain('LONG-BATCH-24')
    expect(html).toContain('&lt;script&gt;alert(&quot;product&quot;)&lt;/script&gt;')
    expect(html).toContain('&lt;b&gt;today&lt;/b&gt;')
    expect(html).not.toContain('<script>alert("product")</script>')
    expect(html).not.toContain('<b>today</b>')
  })
})
