import {
  renderToHtml,
  renderToJson,
  renderToPlainText,
} from '@unlayer/react-elements'
import { describe, expect, it } from 'vitest'
import { sampleIncident } from '../../src/data/sample-incident'
import { CustomerRecallEmail } from '../../src/templates/email/CustomerRecallEmail'

function emailTree() {
  return CustomerRecallEmail({ incident: sampleIncident })
}

describe('CustomerRecallEmail', () => {
  it('renders complete, responsive, email-safe HTML', () => {
    const html = renderToHtml(emailTree(), { title: 'Customer Recall Email' })

    expect(html).toMatch(/^<!DOCTYPE HTML/i)
    expect(html).toContain('<table')
    expect(html).toContain('@media only screen and (max-width: 620px)')
    expect(html).toContain('RISK SUMMARY')
    expect(html).toContain(sampleIncident.risk.description)
    expect(html).toContain('IMMEDIATE ACTION REQUIRED')
    expect(html).toContain('RETURN INSTRUCTIONS')
    expect(html).toContain('Check my product')
    expect(html).toContain('data:image/png;base64,')
    expect(html).not.toContain('/assets/hero.png')
    expect(html).not.toContain('display:flex')
    expect(html).not.toContain('display:grid')
  })

  it('exports a populated Elements JSON tree', () => {
    const json = JSON.stringify(renderToJson(emailTree()))

    expect(json).toContain('"body"')
    expect(json).toContain(sampleIncident.product.name)
    expect(json).toContain(sampleIncident.product.affectedBatches[0])
    expect(json).toContain(sampleIncident.action.remedyDescription)
  })

  it('preserves an understandable plain-text content order', () => {
    const text = renderToPlainText(emailTree()).toLowerCase()
    const orderedContent = [
      sampleIncident.title,
      'Compare the model and batch code on the rear product label before taking the next step.',
      sampleIncident.product.affectedBatches[0],
      sampleIncident.risk.description,
      sampleIncident.action.immediateInstruction,
      sampleIncident.action.steps[0],
      sampleIncident.action.remedyDescription,
      sampleIncident.company.supportPhone,
    ].map((content) => content.toLowerCase())

    let previousIndex = -1
    for (const content of orderedContent) {
      const index = text.indexOf(content)
      expect(index).toBeGreaterThan(previousIndex)
      previousIndex = index
    }
  })

  it('escapes rich-text values and rejects unsafe verification URLs', () => {
    const hostileIncident = structuredClone(sampleIncident)
    hostileIncident.company.name = '<script>alert("company")</script>'
    hostileIncident.action.immediateInstruction =
      'Stop use <img src=x onerror="alert(1)">'
    hostileIncident.action.steps = ['Disconnect <b>everything</b>.']
    hostileIncident.company.verificationUrl = 'javascript:alert(1)'

    const html = renderToHtml(
      CustomerRecallEmail({ incident: hostileIncident }),
      { title: 'Customer Recall Email' },
    )

    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;')
    expect(html).toContain('Disconnect &lt;b&gt;everything&lt;/b&gt;.')
    expect(html).not.toContain('<script>alert("company")</script>')
    expect(html).not.toContain('<img src=x onerror="alert(1)">')
    expect(html).not.toContain('javascript:alert(1)')
  })
})
