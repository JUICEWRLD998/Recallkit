import type {
  RecallIncident,
  RecallSeverity,
  RecallStatus,
  RemedyType,
} from './recall-schema'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

export function formatDateShort(iso: string): string {
  return shortDateFormatter.format(new Date(iso))
}

const SEVERITY_LABELS: Record<RecallSeverity, string> = {
  critical: 'Critical',
  high: 'High',
  advisory: 'Advisory',
}

const STATUS_LABELS: Record<RecallStatus, string> = {
  active: 'Active',
  updated: 'Updated',
  resolved: 'Resolved',
}

const REMEDY_LABELS: Record<RemedyType, string> = {
  refund: 'Refund',
  replacement: 'Replacement',
  repair: 'Repair',
}

export function severityLabel(severity: RecallSeverity): string {
  return SEVERITY_LABELS[severity]
}

export function statusLabel(status: RecallStatus): string {
  return STATUS_LABELS[status]
}

export function remedyLabel(type: RemedyType): string {
  return REMEDY_LABELS[type]
}

export function hasIncidentCounts(risk: RecallIncident['risk']): boolean {
  return risk.reportedIncidents != null || risk.reportedInjuries != null
}

export function hasDeadline(action: RecallIncident['action']): boolean {
  return action.responseDeadline != null
}
