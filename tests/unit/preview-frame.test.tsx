import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { PreviewFrame } from '../../src/components/preview/PreviewFrame'

describe('PreviewFrame', () => {
  it('keeps scripts disabled for email and document previews', () => {
    const markup = renderToStaticMarkup(
      <PreviewFrame html="<p>Email</p>" title="Email" width={600} />,
    )

    expect(markup).toContain('sandbox="allow-same-origin"')
    expect(markup).not.toContain('allow-scripts')
  })

  it('runs public-page scripts without granting same-origin access', () => {
    const markup = renderToStaticMarkup(
      <PreviewFrame
        html="<button>Check</button>"
        title="Public page"
        width="100%"
        allowScripts
      />,
    )

    expect(markup).toContain('sandbox="allow-scripts allow-popups"')
    expect(markup).not.toContain('allow-same-origin')
  })
})
