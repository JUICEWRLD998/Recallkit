import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { EditorPanel } from '../../src/components/editor/EditorPanel'
import { sampleIncident } from '../../src/data/sample-incident'

const noopDispatch = () => {}

describe('EditorPanel validation', () => {
  it('shows no field errors for the valid sample incident', () => {
    const markup = renderToStaticMarkup(
      <EditorPanel incident={sampleIncident} dispatch={noopDispatch} />,
    )

    expect(markup).not.toContain('role="alert"')
    expect(markup).not.toContain('aria-invalid')
  })

  it('shows an inline error next to an invalid field', () => {
    const broken = { ...sampleIncident, title: '' }
    const markup = renderToStaticMarkup(
      <EditorPanel incident={broken} dispatch={noopDispatch} />,
    )

    expect(markup).toContain('>Required<')
    expect(markup).toContain('id="field-recall-title-error"')
    expect(markup).toContain('aria-describedby="field-recall-title-error"')
    expect(markup).toContain('aria-invalid="true"')
  })

  it('keys a batch item error to the affected batches group', () => {
    const broken = {
      ...sampleIncident,
      product: { ...sampleIncident.product, affectedBatches: ['A20-2604-17', ''] },
    }
    const markup = renderToStaticMarkup(
      <EditorPanel incident={broken} dispatch={noopDispatch} />,
    )

    expect(markup).toContain('id="field-affected-batches-label-error"')
    expect(markup).toContain('aria-describedby="field-affected-batches-label-error"')
  })

  it('associates composite control labels via role="group"', () => {
    const markup = renderToStaticMarkup(
      <EditorPanel incident={sampleIncident} dispatch={noopDispatch} />,
    )

    expect(markup).toContain('aria-labelledby="field-severity-label"')
    expect(markup).toContain('aria-labelledby="field-status-label"')
    expect(markup).toContain('aria-labelledby="field-affected-batches-label"')
    expect(markup).not.toContain('for="field-severity"')
    expect(markup).not.toContain('for="field-status"')
    expect(markup).not.toContain('for="field-affected-batches"')
  })
})
