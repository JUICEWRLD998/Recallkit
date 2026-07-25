import { useMemo, useState } from 'react'
import './App.css'
import { downloadText, printHtml } from './lib/export'
import {
  createSpikeArtifacts,
  type SpikeArtifact,
  type SpikeOutput,
} from './templates/spike'

const OUTPUTS: Array<{
  id: SpikeOutput
  label: string
  detail: string
}> = [
  {
    id: 'email',
    label: 'Customer email',
    detail: 'Email-safe table output',
  },
  {
    id: 'document',
    label: 'Retail bulletin',
    detail: 'Print-optimized document',
  },
  {
    id: 'page',
    label: 'Public notice',
    detail: 'Responsive web output',
  },
]

function formatBytes(value: number) {
  return new Intl.NumberFormat('en', {
    notation: value > 9999 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value)
}

function getStatusLabel(status: string) {
  if (status === 'downloaded') return 'Export created'
  if (status === 'printing') return 'Print view opened'
  return 'Renderers ready'
}

function getInitialOutput(): SpikeOutput {
  const requestedOutput = new URLSearchParams(window.location.search).get(
    'output',
  )

  if (
    requestedOutput === 'email' ||
    requestedOutput === 'document' ||
    requestedOutput === 'page'
  ) {
    return requestedOutput
  }

  return 'email'
}

function App() {
  const artifacts = useMemo(createSpikeArtifacts, [])
  const [activeOutput, setActiveOutput] =
    useState<SpikeOutput>(getInitialOutput)
  const [actionStatus, setActionStatus] = useState('ready')
  const activeArtifact: SpikeArtifact = artifacts[activeOutput]

  const downloadHtml = () => {
    downloadText(activeArtifact.html, activeArtifact.htmlFilename, 'text/html')
    setActionStatus('downloaded')
  }

  const downloadJson = () => {
    downloadText(
      JSON.stringify(activeArtifact.json, null, 2),
      activeArtifact.jsonFilename,
      'application/json',
    )
    setActionStatus('downloaded')
  }

  const printDocument = () => {
    printHtml(artifacts.document.html)
    setActionStatus('printing')
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            RK
          </span>
          <div>
            <p className="eyebrow">Elements API spike</p>
            <h1>RecallKit</h1>
          </div>
        </div>

        <div className="verification-status" role="status">
          <span className="status-dot" aria-hidden="true" />
          <span>{getStatusLabel(actionStatus)}</span>
        </div>
      </header>

      <section className="workspace" aria-label="Elements renderer verification">
        <aside className="output-rail">
          <div className="rail-heading">
            <p className="eyebrow">Phase 0</p>
            <h2>Three render modes</h2>
            <p>
              Each preview is generated from a strict Elements root and shown
              as its final standalone HTML.
            </p>
          </div>

          <nav className="output-list" aria-label="Generated outputs">
            {OUTPUTS.map((output) => (
              <button
                aria-pressed={activeOutput === output.id}
                className="output-option"
                key={output.id}
                onClick={() => setActiveOutput(output.id)}
                type="button"
              >
                <span className="output-option-copy">
                  <strong>{output.label}</strong>
                  <span>{output.detail}</span>
                </span>
                <span className="output-state" aria-hidden="true">
                  {activeOutput === output.id ? 'Viewing' : 'Ready'}
                </span>
              </button>
            ))}
          </nav>

          <dl className="artifact-metrics">
            <div>
              <dt>HTML</dt>
              <dd>{formatBytes(activeArtifact.html.length)} bytes</dd>
            </div>
            <div>
              <dt>Rows</dt>
              <dd>{activeArtifact.json.body.rows.length}</dd>
            </div>
            <div>
              <dt>Schema</dt>
              <dd>{activeArtifact.json.schemaVersion}</dd>
            </div>
          </dl>
        </aside>

        <section className="preview-stage">
          <div className="preview-toolbar">
            <div>
              <p className="eyebrow">Live artifact</p>
              <h2>{activeArtifact.label}</h2>
            </div>

            <div className="preview-actions">
              <button
                className="secondary-action"
                onClick={downloadJson}
                type="button"
              >
                Download JSON
              </button>
              <button
                className="secondary-action"
                onClick={downloadHtml}
                type="button"
              >
                Download HTML
              </button>
              {activeOutput === 'document' && (
                <button
                  className="primary-action"
                  onClick={printDocument}
                  type="button"
                >
                  Print document
                </button>
              )}
            </div>
          </div>

          <div
            className={`preview-frame preview-frame--${activeOutput}`}
            data-testid="preview-frame"
          >
            <iframe
              key={activeOutput}
              srcDoc={activeArtifact.html}
              title={`${activeArtifact.label} generated HTML preview`}
            />
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
