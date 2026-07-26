export type BatchMatchResult = 'affected' | 'not-found' | 'invalid'

export const BATCH_SEPARATOR_RE = /[\s\-‐‑‒–—―._]+/g
export const BATCH_EDGE_DASH_RE = /^-+|-+$/g
export const BATCH_VALID_RE = /^[A-Z0-9](?:[-A-Z0-9]*[A-Z0-9])?$/

function normalize(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(BATCH_SEPARATOR_RE, '-')
    .replace(BATCH_EDGE_DASH_RE, '')
}

export function matchBatch(
  input: string,
  affectedBatches: readonly string[],
): BatchMatchResult {
  const normalized = normalize(input)
  if (normalized.length === 0) return 'invalid'
  if (!BATCH_VALID_RE.test(normalized)) return 'invalid'

  const normalizedBatches = affectedBatches.map(normalize)
  if (normalizedBatches.includes(normalized)) return 'affected'
  return 'not-found'
}
