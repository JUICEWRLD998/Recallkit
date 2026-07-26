import {
  renderToHtml,
  renderToJson,
  renderToPlainText,
} from '@unlayer/react-elements'
import { describe, expect, it } from 'vitest'
import { matchBatch } from '../../src/domain/batch-matching'
import { sampleIncident } from '../../src/data/sample-incident'
import { PublicRecallNotice } from '../../src/templates/web/PublicRecallNotice'

function noticeTree() {
  return PublicRecallNotice({ incident: sampleIncident })
}

function renderedNotice() {
  return renderToHtml(noticeTree(), { title: 'Public Recall Notice' })
}

function mountBatchChecker() {
  const parsed = new DOMParser().parseFromString(renderedNotice(), 'text/html')
  document.body.innerHTML = parsed.body.innerHTML

  const checkerScript = [...parsed.querySelectorAll('script')].at(-1)?.textContent
  expect(checkerScript).toBeTruthy()
  window.eval(checkerScript ?? '')

  const form = document.querySelector<HTMLFormElement>('#rn-batch-form')
  const input = document.querySelector<HTMLInputElement>('#rn-batch-input')
  const result = document.querySelector<HTMLElement>('#rn-batch-result')
  expect(form).not.toBeNull()
  expect(input).not.toBeNull()
  expect(result).not.toBeNull()

  const submit = (value: string) => {
    input!.value = value
    form!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  }

  return { form: form!, input: input!, result: result!, submit }
}

describe('PublicRecallNotice', () => {
  it('renders a standalone notice populated from the current incident', () => {
    const html = renderedNotice()

    expect(html).toMatch(/^<!DOCTYPE HTML/i)
    expect(html).toContain(sampleIncident.product.name)
    expect(html).toContain(sampleIncident.product.model)
    expect(html).toContain(sampleIncident.product.affectedBatches[0])
    expect(html).toContain(sampleIncident.risk.description)
    expect(html).toContain(sampleIncident.action.immediateInstruction)
    expect(html).toContain(sampleIncident.action.remedyDescription)
    expect(html).toContain(sampleIncident.company.name)
    expect(html).toContain(`alt="${sampleIncident.product.name}, model ${sampleIncident.product.model}"`)
  })

  it('includes FAQ and direct verification, phone, and email support paths', () => {
    const html = renderedNotice()
    const text = renderToPlainText(noticeTree()).toLowerCase()

    expect(text).toMatch(/frequently asked questions|faq/)
    expect(text).toContain(sampleIncident.action.returnInstructions.toLowerCase())
    expect(html).toContain(sampleIncident.company.verificationUrl)
    expect(html).toContain(
      `mailto:${encodeURIComponent(sampleIncident.company.supportEmail)}`,
    )
    expect(html).toContain(sampleIncident.company.supportPhone)
    expect(html).toContain(sampleIncident.company.supportEmail)
  })

  it('exports a complete Elements JSON tree', () => {
    const json = JSON.stringify(renderToJson(noticeTree()))

    expect(json).toContain('"body"')
    expect(json).toContain(sampleIncident.title)
    expect(json).toContain(sampleIncident.product.affectedBatches[0])
    expect(json).toContain(sampleIncident.company.supportEmail)
  })

  it('escapes incident content and rejects unsafe link schemes', () => {
    const unsafeIncident = {
      ...sampleIncident,
      title: '<script>window.recallCompromised = true</script>',
      company: {
        ...sampleIncident.company,
        verificationUrl: 'javascript:alert(1)',
      },
      product: {
        ...sampleIncident.product,
        affectedBatches: ['</script><script>alert(1)</script>'],
      },
    }
    const html = renderToHtml(PublicRecallNotice({ incident: unsafeIncident }))

    expect(html).not.toContain('<script>window.recallCompromised')
    expect(html).not.toContain('href="javascript:')
    expect(html).not.toContain('new Set(["</script>')
    expect(html).toContain('\\u003c/SCRIPT>')
  })

  it('provides a labelled keyboard-operable checker and polite result announcement', () => {
    const { form, input, result } = mountBatchChecker()
    const label = document.querySelector(`label[for="${input.id}"]`)
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')

    expect(label?.textContent).toContain('Batch identifier')
    expect(button?.textContent).toContain('Check batch')
    expect(input.getAttribute('aria-describedby')).toContain(result.id)
    expect(result.getAttribute('role')).toBe('status')
    expect(result.getAttribute('aria-live')).toBe('polite')
    expect(result.getAttribute('aria-atomic')).toBe('true')
  })

  it('announces affected, cautious unknown, and actionable invalid states', () => {
    const { input, result, submit } = mountBatchChecker()

    submit(`  ${sampleIncident.product.affectedBatches[0].toLowerCase().replaceAll('-', ' ')}  `)
    expect(result.dataset.state).toBe('affected')
    expect(result.textContent).toContain('This batch is affected')
    expect(result.textContent).toContain('Stop using the product immediately')
    expect(input.getAttribute('aria-invalid')).toBe('false')

    submit('UNKNOWN-2026-99')
    expect(result.dataset.state).toBe('not-found')
    expect(result.textContent).toContain('does not confirm your product is safe')
    expect(result.textContent).toContain('contact support')
    expect(input.getAttribute('aria-invalid')).toBe('false')

    submit('???')
    expect(result.dataset.state).toBe('invalid')
    expect(result.textContent).toContain('Enter a valid batch identifier')
    expect(result.textContent).toContain('letters and numbers printed on the product label')
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })

  it('keeps the three checker outcomes conservative and actionable', () => {
    const batches = sampleIncident.product.affectedBatches

    expect(matchBatch(batches[0].toLowerCase(), batches)).toBe('affected')
    expect(matchBatch(`  ${batches[0].replaceAll('-', ' ')}  `, batches)).toBe(
      'affected',
    )
    expect(matchBatch('UNKNOWN-2026-99', batches)).toBe('not-found')
    expect(matchBatch('', batches)).toBe('invalid')
    expect(matchBatch('???', batches)).toBe('invalid')
  })
})
