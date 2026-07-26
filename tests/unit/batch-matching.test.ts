import { describe, expect, it } from 'vitest'
import { matchBatch } from '../../src/domain/batch-matching'

const AFFECTED = ['A20-2604-17', 'A20-2604-18', 'A20-2605-02']

describe('matchBatch', () => {
  it('returns affected for an exact match', () => {
    expect(matchBatch('A20-2604-17', AFFECTED)).toBe('affected')
  })

  it('matches case-insensitively', () => {
    expect(matchBatch('a20-2604-17', AFFECTED)).toBe('affected')
  })

  it('normalizes extra spaces', () => {
    expect(matchBatch('  A20 2604 17  ', AFFECTED)).toBe('affected')
  })

  it('normalizes underscores', () => {
    expect(matchBatch('A20_2604_17', AFFECTED)).toBe('affected')
  })

  it('normalizes dots', () => {
    expect(matchBatch('A20.2604.17', AFFECTED)).toBe('affected')
  })

  it('normalizes en-dashes and em-dashes', () => {
    expect(matchBatch('A20–2604—17', AFFECTED)).toBe('affected')
  })

  it('collapses mixed separators around ASCII dashes', () => {
    expect(matchBatch('A20 - 2604 - 17', AFFECTED)).toBe('affected')
  })

  it('strips a trailing separator', () => {
    expect(matchBatch('A20-2604-17.', AFFECTED)).toBe('affected')
  })

  it('strips a leading separator', () => {
    expect(matchBatch('-A20-2604-17', AFFECTED)).toBe('affected')
  })

  it('strips a trailing dash', () => {
    expect(matchBatch('A20-2604-17-', AFFECTED)).toBe('affected')
  })

  it('strips leading and trailing dots together', () => {
    expect(matchBatch('.A20-2604-17.', AFFECTED)).toBe('affected')
  })

  it('returns not-found for an unknown batch', () => {
    expect(matchBatch('A20-9999-99', AFFECTED)).toBe('not-found')
  })

  it('returns invalid for empty input', () => {
    expect(matchBatch('', AFFECTED)).toBe('invalid')
  })

  it('returns invalid for whitespace-only input', () => {
    expect(matchBatch('   ', AFFECTED)).toBe('invalid')
  })

  it('returns invalid for special characters only', () => {
    expect(matchBatch('!!!', AFFECTED)).toBe('invalid')
  })

  it('handles single-character batch ids', () => {
    expect(matchBatch('X', ['X'])).toBe('affected')
  })
})
