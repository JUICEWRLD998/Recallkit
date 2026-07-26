import { describe, expect, it } from 'vitest'
import { exportFilename } from '../../src/lib/export'

const date = new Date(2026, 6, 26)

describe('exportFilename', () => {
  it('formats each export kind', () => {
    expect(exportFilename('email', 'RK-2026-071', 'html', date)).toBe(
      'recallkit-email-RK-2026-071-2026-07-26.html',
    )
    expect(exportFilename('document', 'RK-2026-071', 'json', date)).toBe(
      'recallkit-document-RK-2026-071-2026-07-26.json',
    )
    expect(exportFilename('page', 'RK-2026-071', 'html', date)).toBe(
      'recallkit-page-RK-2026-071-2026-07-26.html',
    )
    expect(exportFilename('case', 'RK-2026-071', 'json', date)).toBe(
      'recallkit-case-RK-2026-071-2026-07-26.json',
    )
  })

  it('keeps uppercase and replaces special characters with dashes', () => {
    expect(exportFilename('email', 'RK 2026/071', 'html', date)).toBe(
      'recallkit-email-RK-2026-071-2026-07-26.html',
    )
    expect(exportFilename('email', 'a?b*c:d', 'html', date)).toBe(
      'recallkit-email-a-b-c-d-2026-07-26.html',
    )
  })

  it('collapses repeated dashes', () => {
    expect(exportFilename('email', 'RK--2026___071', 'html', date)).toBe(
      'recallkit-email-RK-2026-071-2026-07-26.html',
    )
  })

  it('trims leading and trailing dashes', () => {
    expect(exportFilename('email', '--RK-071--', 'html', date)).toBe(
      'recallkit-email-RK-071-2026-07-26.html',
    )
    expect(exportFilename('email', '  RK-071  ', 'html', date)).toBe(
      'recallkit-email-RK-071-2026-07-26.html',
    )
  })

  it('replaces unicode characters', () => {
    expect(exportFilename('email', 'RK-Ω-071-é', 'html', date)).toBe(
      'recallkit-email-RK-071-2026-07-26.html',
    )
  })

  it('falls back to "recall" when the id is empty or fully sanitized away', () => {
    expect(exportFilename('email', '', 'html', date)).toBe(
      'recallkit-email-recall-2026-07-26.html',
    )
    expect(exportFilename('email', '???', 'html', date)).toBe(
      'recallkit-email-recall-2026-07-26.html',
    )
    expect(exportFilename('email', '---', 'html', date)).toBe(
      'recallkit-email-recall-2026-07-26.html',
    )
  })

  it('zero-pads month and day', () => {
    expect(exportFilename('case', 'RK-1', 'json', new Date(2026, 0, 5))).toBe(
      'recallkit-case-RK-1-2026-01-05.json',
    )
    expect(exportFilename('case', 'RK-1', 'json', new Date(2026, 11, 31))).toBe(
      'recallkit-case-RK-1-2026-12-31.json',
    )
  })

  it('defaults to the current date', () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    expect(exportFilename('case', 'RK-1', 'json')).toBe(
      `recallkit-case-RK-1-${year}-${month}-${day}.json`,
    )
  })
})
