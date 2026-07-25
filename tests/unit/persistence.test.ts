import { describe, expect, it, beforeEach } from 'vitest'
import { loadIncident, saveIncident, clearIncident } from '../../src/lib/persistence'
import { sampleIncident } from '../../src/data/sample-incident'

beforeEach(() => {
  localStorage.clear()
})

describe('persistence', () => {
  it('returns sample incident when nothing is stored', () => {
    expect(loadIncident()).toEqual(sampleIncident)
  })

  it('round-trips a saved incident', () => {
    const modified = { ...sampleIncident, title: 'Modified Title' }
    saveIncident(modified)
    expect(loadIncident()).toEqual(modified)
  })

  it('returns sample incident for corrupted JSON', () => {
    localStorage.setItem('recallkit:incident', '{broken')
    expect(loadIncident()).toEqual(sampleIncident)
  })

  it('returns sample incident for wrong schema version', () => {
    localStorage.setItem(
      'recallkit:incident',
      JSON.stringify({ version: 999, data: sampleIncident }),
    )
    expect(loadIncident()).toEqual(sampleIncident)
  })

  it('returns sample incident for invalid data shape', () => {
    localStorage.setItem(
      'recallkit:incident',
      JSON.stringify({ version: 1, data: { id: 123 } }),
    )
    expect(loadIncident()).toEqual(sampleIncident)
  })

  it('clears stored incident', () => {
    saveIncident(sampleIncident)
    clearIncident()
    expect(localStorage.getItem('recallkit:incident')).toBeNull()
  })
})
