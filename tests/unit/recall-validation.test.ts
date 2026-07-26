import { describe, expect, it } from 'vitest'
import { validateIncident, fieldError } from '../../src/domain/recall-validation'
import { sampleIncident } from '../../src/data/sample-incident'

describe('validateIncident', () => {
  it('returns an empty error map for the valid sample incident', () => {
    expect(validateIncident(sampleIncident)).toEqual({})
  })

  it('reports an empty title at the title path', () => {
    const errors = validateIncident({ ...sampleIncident, title: '' })
    expect(errors['title']).toBe('Required')
    expect(Object.keys(errors)).toEqual(['title'])
  })

  it('reports an invalid email at company.supportEmail', () => {
    const errors = validateIncident({
      ...sampleIncident,
      company: { ...sampleIncident.company, supportEmail: 'not-an-email' },
    })
    expect(errors['company.supportEmail']).toBe('Enter a valid email address')
  })

  it('reports an invalid URL at company.verificationUrl', () => {
    const errors = validateIncident({
      ...sampleIncident,
      company: { ...sampleIncident.company, verificationUrl: 'not-a-url' },
    })
    expect(errors['company.verificationUrl']).toBe('Enter a valid URL')
  })

  it('keys empty batch strings under product.affectedBatches', () => {
    const errors = validateIncident({
      ...sampleIncident,
      product: { ...sampleIncident.product, affectedBatches: ['A20-2604-17', ''] },
    })
    expect(errors['product.affectedBatches.1']).toBe('Required')
  })

  it('reports an empty batch list at product.affectedBatches', () => {
    const errors = validateIncident({
      ...sampleIncident,
      product: { ...sampleIncident.product, affectedBatches: [] },
    })
    expect(errors['product.affectedBatches']).toBe('Add at least one entry')
  })

  it('reports an invalid date at announcedAt', () => {
    const errors = validateIncident({ ...sampleIncident, announcedAt: 'nope' })
    expect(errors['announcedAt']).toBe('Enter a valid date')
  })
})

describe('fieldError', () => {
  it('returns an exact-path match', () => {
    expect(fieldError({ title: 'Required' }, 'title')).toBe('Required')
  })

  it('falls back to the first nested error under the path', () => {
    const errors = { 'product.affectedBatches.1': 'Required' }
    expect(fieldError(errors, 'product.affectedBatches')).toBe('Required')
  })

  it('returns undefined when nothing matches', () => {
    expect(fieldError({ title: 'Required' }, 'id')).toBeUndefined()
  })
})
