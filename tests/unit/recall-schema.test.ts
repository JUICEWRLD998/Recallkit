import { describe, expect, it } from 'vitest'
import { recallIncidentSchema } from '../../src/domain/recall-schema'
import { sampleIncident } from '../../src/data/sample-incident'

describe('recallIncidentSchema', () => {
  it('validates the sample incident', () => {
    const result = recallIncidentSchema.safeParse(sampleIncident)
    expect(result.success).toBe(true)
  })

  it('rejects an empty object', () => {
    const result = recallIncidentSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects invalid severity', () => {
    const result = recallIncidentSchema.safeParse({
      ...sampleIncident,
      severity: 'extreme',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid status', () => {
    const result = recallIncidentSchema.safeParse({
      ...sampleIncident,
      status: 'pending',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty batch list', () => {
    const result = recallIncidentSchema.safeParse({
      ...sampleIncident,
      product: { ...sampleIncident.product, affectedBatches: [] },
    })
    expect(result.success).toBe(false)
  })

  it('accepts missing optional fields', () => {
    const withoutOptionals = {
      ...sampleIncident,
      risk: {
        headline: sampleIncident.risk.headline,
        description: sampleIncident.risk.description,
      },
      action: {
        ...sampleIncident.action,
        responseDeadline: undefined,
      },
    }
    const result = recallIncidentSchema.safeParse(withoutOptionals)
    expect(result.success).toBe(true)
  })

  it('rejects malformed email', () => {
    const result = recallIncidentSchema.safeParse({
      ...sampleIncident,
      company: { ...sampleIncident.company, supportEmail: 'not-an-email' },
    })
    expect(result.success).toBe(false)
  })

  it('rejects malformed URL', () => {
    const result = recallIncidentSchema.safeParse({
      ...sampleIncident,
      company: { ...sampleIncident.company, verificationUrl: 'not-a-url' },
    })
    expect(result.success).toBe(false)
  })
})
