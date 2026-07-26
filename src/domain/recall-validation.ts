import type { z } from 'zod/v4'
import { recallIncidentSchema } from './recall-schema'
import type { RecallIncident } from './recall-schema'

export type ValidationErrors = Record<string, string>

function messageFor(issue: z.core.$ZodIssue): string {
  if (issue.code === 'invalid_type' && issue.input === undefined) {
    return 'Required'
  }
  if (issue.code === 'too_small') {
    if (issue.origin === 'string') return 'Required'
    if (issue.origin === 'array') return 'Add at least one entry'
    if (issue.origin === 'number') return 'Enter zero or more'
  }
  if (issue.code === 'invalid_format') {
    if (issue.format === 'email') return 'Enter a valid email address'
    if (issue.format === 'url') return 'Enter a valid URL'
    if (issue.format === 'datetime') return 'Enter a valid date'
  }
  return issue.message
}

/**
 * Validates an incident against the recall schema and flattens Zod issues
 * into a path → message map, e.g. { 'company.supportEmail': 'Enter a valid
 * email address', 'product.affectedBatches.0': 'Required' }.
 * Returns an empty map when the incident is valid.
 */
export function validateIncident(incident: RecallIncident): ValidationErrors {
  const result = recallIncidentSchema.safeParse(incident)
  if (result.success) return {}
  const errors: ValidationErrors = {}
  for (const issue of result.error.issues) {
    const path = issue.path.join('.')
    if (!(path in errors)) {
      errors[path] = messageFor(issue)
    }
  }
  return errors
}

/**
 * Looks up an error for an exact path, falling back to the first error nested
 * under it (useful for array fields such as 'product.affectedBatches', where
 * issues are keyed per item).
 */
export function fieldError(errors: ValidationErrors, path: string): string | undefined {
  if (errors[path]) return errors[path]
  const prefix = path + '.'
  for (const key of Object.keys(errors)) {
    if (key.startsWith(prefix)) return errors[key]
  }
  return undefined
}
