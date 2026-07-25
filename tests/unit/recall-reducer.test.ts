import { describe, expect, it } from 'vitest'
import { recallReducer, type RecallAction } from '../../src/domain/recall-reducer'
import { sampleIncident } from '../../src/data/sample-incident'

describe('recallReducer', () => {
  it('sets a top-level field', () => {
    const action: RecallAction = {
      type: 'SET_FIELD',
      path: ['title'],
      value: 'New Title',
    }
    const result = recallReducer(sampleIncident, action)
    expect(result.title).toBe('New Title')
  })

  it('sets a nested field', () => {
    const action: RecallAction = {
      type: 'SET_FIELD',
      path: ['company', 'name'],
      value: 'Acme Corp',
    }
    const result = recallReducer(sampleIncident, action)
    expect(result.company.name).toBe('Acme Corp')
  })

  it('updates updatedAt on field changes', () => {
    const action: RecallAction = {
      type: 'SET_FIELD',
      path: ['title'],
      value: 'Changed',
    }
    const result = recallReducer(sampleIncident, action)
    expect(result.updatedAt).not.toBe(sampleIncident.updatedAt)
  })

  it('sets severity', () => {
    const result = recallReducer(sampleIncident, {
      type: 'SET_SEVERITY',
      value: 'critical',
    })
    expect(result.severity).toBe('critical')
  })

  it('sets status', () => {
    const result = recallReducer(sampleIncident, {
      type: 'SET_STATUS',
      value: 'resolved',
    })
    expect(result.status).toBe('resolved')
  })

  it('sets remedy type', () => {
    const result = recallReducer(sampleIncident, {
      type: 'SET_REMEDY_TYPE',
      value: 'refund',
    })
    expect(result.action.remedyType).toBe('refund')
  })

  it('adds a batch', () => {
    const result = recallReducer(sampleIncident, {
      type: 'ADD_BATCH',
      value: 'NEW-BATCH',
    })
    expect(result.product.affectedBatches).toContain('NEW-BATCH')
    expect(result.product.affectedBatches.length).toBe(
      sampleIncident.product.affectedBatches.length + 1,
    )
  })

  it('removes a batch by index', () => {
    const result = recallReducer(sampleIncident, {
      type: 'REMOVE_BATCH',
      index: 0,
    })
    expect(result.product.affectedBatches.length).toBe(
      sampleIncident.product.affectedBatches.length - 1,
    )
    expect(result.product.affectedBatches[0]).toBe(
      sampleIncident.product.affectedBatches[1],
    )
  })

  it('updates a batch by index', () => {
    const result = recallReducer(sampleIncident, {
      type: 'UPDATE_BATCH',
      index: 1,
      value: 'UPDATED-BATCH',
    })
    expect(result.product.affectedBatches[1]).toBe('UPDATED-BATCH')
  })

  it('adds a step', () => {
    const result = recallReducer(sampleIncident, {
      type: 'ADD_STEP',
      value: 'New step',
    })
    expect(result.action.steps.at(-1)).toBe('New step')
  })

  it('removes a step by index', () => {
    const result = recallReducer(sampleIncident, {
      type: 'REMOVE_STEP',
      index: 0,
    })
    expect(result.action.steps.length).toBe(
      sampleIncident.action.steps.length - 1,
    )
  })

  it('updates a step by index', () => {
    const result = recallReducer(sampleIncident, {
      type: 'UPDATE_STEP',
      index: 2,
      value: 'Updated step',
    })
    expect(result.action.steps[2]).toBe('Updated step')
  })

  it('reorders steps', () => {
    const result = recallReducer(sampleIncident, {
      type: 'REORDER_STEPS',
      from: 0,
      to: 2,
    })
    expect(result.action.steps[2]).toBe(sampleIncident.action.steps[0])
    expect(result.action.steps[0]).toBe(sampleIncident.action.steps[1])
  })

  it('resets to provided incident', () => {
    const modified = { ...sampleIncident, title: 'Modified' }
    const result = recallReducer(modified, {
      type: 'RESET',
      incident: sampleIncident,
    })
    expect(result).toEqual(sampleIncident)
  })
})
