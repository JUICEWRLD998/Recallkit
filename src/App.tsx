import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { renderToHtml, renderToJson } from '@unlayer/react-elements'
import type { Dispatch } from 'react'
import type { RecallAction } from './domain/recall-reducer'
import { recallReducer } from './domain/recall-reducer'
import { loadIncident, saveIncident, clearIncident } from './lib/persistence'
import { downloadText, printHtml } from './lib/export'
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
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(null)

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
      try {
        saveIncident(incident)
        setStatus('saved')
      } catch {
        setStatus('error')
      }
    }, 300)

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [incident, status])

  const currentHtml = useMemo(() => {
    switch (activeOutput) {
      case 'email':
        return renderToHtml(CustomerRecallEmail({ incident }), { title: 'Customer Recall Email' })
      case 'document':
        return renderRetailerBulletinHtml(incident)
      case 'page':
        return renderToHtml(PublicRecallNotice({ incident }), { title: 'Public Recall Notice' })
    }
  }, [incident, activeOutput])

  const documentHtml = useMemo(() => renderRetailerBulletinHtml(incident), [incident])

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

  const handleExportHtml = useCallback(() => {
    downloadText(currentHtml, `recallkit-${activeOutput}-${incident.id}.html`, 'text/html')
  }, [currentHtml, activeOutput, incident.id])

  const handleExportJson = useCallback(() => {
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
    downloadText(JSON.stringify(json, null, 2), `recallkit-${activeOutput}-${incident.id}.json`, 'application/json')
  }, [activeOutput, incident])

  const handleExportCase = useCallback(() => {
    downloadText(JSON.stringify(incident, null, 2), `recallkit-case-${incident.id}.json`, 'application/json')
  }, [incident])

  const handlePrint = useCallback(() => {
    printHtml(documentHtml)
  }, [documentHtml])

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
            onPrint={handlePrint}
            activeOutput={activeOutput}
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
            html={currentHtml}
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
