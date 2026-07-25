import type { RecallSeverity, RecallStatus } from '../../domain/recall-schema'

export const COLORS = {
  ink: '#111820',
  paper: '#F4F6F5',
  surface: '#FFFFFF',
  critical: '#D92D20',
  warning: '#E6A700',
  safe: '#007C78',
  muted: '#66716F',
  line: '#D9DEDC',
} as const

export function severityColor(severity: RecallSeverity): string {
  switch (severity) {
    case 'critical':
      return '#D92D20'
    case 'high':
      return '#E6A700'
    case 'advisory':
      return '#66716F'
  }
}

export function statusColor(status: RecallStatus): string {
  switch (status) {
    case 'active':
      return '#D92D20'
    case 'updated':
      return '#E6A700'
    case 'resolved':
      return '#007C78'
  }
}
