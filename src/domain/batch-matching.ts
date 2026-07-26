export type BatchMatchResult = 'affected' | 'not-found' | 'invalid'

function normalize(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[\s\-‐‑‒–—―._]+/g, '-')
}

export function matchBatch(
  input: string,
  affectedBatches: readonly string[],
): BatchMatchResult {
  const normalized = normalize(input)
  if (normalized.length === 0) return 'invalid'
  if (!/^[A-Z0-9][-A-Z0-9]*[A-Z0-9]$/.test(normalized) && !/^[A-Z0-9]$/.test(normalized)) {
    return 'invalid'
  }

  const normalizedBatches = affectedBatches.map(normalize)
  if (normalizedBatches.includes(normalized)) return 'affected'
  return 'not-found'
}
