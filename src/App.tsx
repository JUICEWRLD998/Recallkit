import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { renderToHtml, renderToJson } from '@unlayer/react-elements'
import type { Dispatch } from 'react'
import type { RecallAction } from './domain/recall-reducer'
import { recallReducer } from './domain/recall-reducer'
import { recallIncidentSchema } from './domain/recall-schema'
import { loadIncident, saveIncident, clearIncident } from './lib/persistence'
import { downloadText, exportFilename, fallbackErrorHtml, printHtml } from './lib/export'
import { sampleIncident } from './data/sample-incident'
import { AppShell } from './app/AppShell'
import { AppHeader } from './app/AppHeader'
import { OutputTabs } from './app/OutputTabs'
import { EditorPanel } from './components/editor'
import { PreviewStage } from './components/preview'
import { ConfirmDialog } from './components/ui'
import { CustomerRecallEmail } from './templates'
import { RetailerActionBulletin, renderRetailerBulletinHtml } from './templates'
import { PublicRecallNotice } from './templates'
import './App.css'

type ActiveOutput = 'email' | 'document' | 'page'
type SaveStatus = 'saved' | 'unsaved' | 'error'

function App() {
  const [incident, baseDispatch] = useReducer(recallReducer, undefined, loadIncident)
  const [status, setStatus] = useState<SaveStatus>('saved')
  const [activeOutput, setActiveOutput] = useState<ActiveOutput>('email')
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const exportErrorTimerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const incidentRef = useRef(incident)
  const statusRef = useRef(status)

  useEffect(() => {
    incidentRef.current = incident
  }, [incident])

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    const flushDraft = () => {
      if (statusRef.current === 'unsaved') {
        saveIncident(incidentRef.current)
      }
    }
    window.addEventListener('pagehide', flushDraft)
    return () => window.removeEventListener('pagehide', flushDraft)
  }, [])

  const dispatch: Dispatch<RecallAction> = useCallback((action: RecallAction) => {
    baseDispatch(action)
    if (action.type !== 'RESET') {
      setStatus('unsaved')
    }
  }, [])

  useEffect(() => {
    if (status !== 'unsaved') return

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = setTimeout(() => {
      if (saveIncident(incident)) {
        setStatus('saved')
      } else {
        setStatus('error')
      }
    }, 300)

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [incident, status])

  const showExportError = useCallback((message: string) => {
    if (exportErrorTimerRef.current) {
      clearTimeout(exportErrorTimerRef.current)
    }
    setExportError(message)
    exportErrorTimerRef.current = setTimeout(() => setExportError(null), 5000)
  }, [])

  useEffect(() => {
    return () => {
      if (exportErrorTimerRef.current) {
        clearTimeout(exportErrorTimerRef.current)
      }
    }
  }, [])

  const currentRender = useMemo(() => {
    try {
      switch (activeOutput) {
        case 'email':
          return { html: renderToHtml(CustomerRecallEmail({ incident }), { title: 'Customer Recall Email' }), ok: true }
        case 'document':
          return { html: renderRetailerBulletinHtml(incident), ok: true }
        case 'page':
          return { html: renderToHtml(PublicRecallNotice({ incident }), { title: 'Public Recall Notice' }), ok: true }
      }
    } catch {
      return { html: fallbackErrorHtml('Preview unavailable'), ok: false }
    }
  }, [incident, activeOutput])

  const documentRender = useMemo(() => {
    try {
      return { html: renderRetailerBulletinHtml(incident), ok: true }
    } catch {
      return { html: fallbackErrorHtml('Document unavailable'), ok: false }
    }
  }, [incident])

  const currentTitle = useMemo(() => {
    switch (activeOutput) {
      case 'email':
        return 'Customer Recall Email'
      case 'document':
        return 'Retailer Action Bulletin'
      case 'page':
        return 'Public Recall Notice'
    }
  }, [activeOutput])

  const incidentValid = useMemo(
    () => recallIncidentSchema.safeParse(incident).success,
    [incident],
  )

  const validateForExport = useCallback(() => {
    if (incidentValid) return true
    showExportError('Fix invalid incident fields before exporting.')
    return false
  }, [incidentValid, showExportError])

  const handleExportHtml = useCallback(() => {
    if (!validateForExport()) return
    if (!currentRender.ok) {
      showExportError('Preview failed to render. Fix the incident data before exporting.')
      return
    }
    try {
      downloadText(currentRender.html, exportFilename(activeOutput, incident.id, 'html'), 'text/html')
    } catch {
      showExportError('HTML export failed. Your draft is unaffected.')
    }
  }, [validateForExport, currentRender, activeOutput, incident.id, showExportError])

  const handleExportJson = useCallback(() => {
    if (!validateForExport()) return
    try {
      let json
      switch (activeOutput) {
        case 'email':
          json = renderToJson(CustomerRecallEmail({ incident }))
          break
        case 'document':
          json = renderToJson(RetailerActionBulletin({ incident }))
          break
        case 'page':
          json = renderToJson(PublicRecallNotice({ incident }))
          break
      }
      downloadText(JSON.stringify(json, null, 2), exportFilename(activeOutput, incident.id, 'json'), 'application/json')
    } catch {
      showExportError('JSON export failed. Your draft is unaffected.')
    }
  }, [validateForExport, activeOutput, incident, showExportError])

  const handleExportCase = useCallback(() => {
    if (!validateForExport()) return
    try {
      downloadText(JSON.stringify(incident, null, 2), exportFilename('case', incident.id, 'json'), 'application/json')
    } catch {
      showExportError('Case export failed. Your draft is unaffected.')
    }
  }, [validateForExport, incident, showExportError])

  const handlePrint = useCallback(() => {
    if (!validateForExport()) return
    if (!documentRender.ok) {
      showExportError('Preview failed to render. Fix the incident data before exporting.')
      return
    }
    try {
      printHtml(documentRender.html, () =>
        showExportError('Print failed. Your draft is unaffected.'),
      )
    } catch {
      showExportError('Print failed. Your draft is unaffected.')
    }
  }, [validateForExport, documentRender, showExportError])

  const handleCopyHtml = useCallback(async () => {
    if (!validateForExport()) {
      throw new Error('Incident data is invalid')
    }
    if (!currentRender.ok) {
      showExportError('Preview failed to render. Fix the incident data before exporting.')
      throw new Error('Preview failed to render')
    }
    if (!navigator.clipboard?.writeText) {
      throw new Error('Clipboard API unavailable')
    }
    await navigator.clipboard.writeText(currentRender.html)
  }, [validateForExport, currentRender, showExportError])

  const handleResetConfirm = useCallback(() => {
    dispatch({ type: 'RESET', incident: sampleIncident })
    clearIncident()
    setStatus('saved')
    setResetDialogOpen(false)
  }, [dispatch])

  return (
    <>
      <AppShell
        header={
          <AppHeader
            status={status}
            onReset={() => setResetDialogOpen(true)}
            onExportHtml={handleExportHtml}
            onExportJson={handleExportJson}
            onExportCase={handleExportCase}
            onCopyHtml={handleCopyHtml}
            onPrint={handlePrint}
            exportDisabled={!incidentValid}
            activeOutput={activeOutput}
            exportError={exportError}
            recallId={incident.id}
            severity={incident.severity}
          />
        }
        sidebar={
          <>
            <OutputTabs activeOutput={activeOutput} onChange={setActiveOutput} />
            <EditorPanel incident={incident} dispatch={dispatch} />
          </>
        }
        preview={
          <PreviewStage
            html={currentRender.html}
            title={currentTitle}
            activeOutput={activeOutput}
          />
        }
      />
      <ConfirmDialog
        open={resetDialogOpen}
        title="Reset incident data"
        message="This will discard all changes and restore the sample incident. This cannot be undone."
        confirmLabel="Reset"
        onConfirm={handleResetConfirm}
        onCancel={() => setResetDialogOpen(false)}
        destructive
      />
    </>
  )
}

export default App
