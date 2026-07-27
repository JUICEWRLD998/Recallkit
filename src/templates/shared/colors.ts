import type { RecallIncident } from '../../domain/recall-schema'

export type TemplatePalette = {
  ink: string
  paper: string
  surface: string
  accent: string
  accentSoft: string
  critical: string
  warning: string
  safe: string
  muted: string
  line: string
  inkSoft: string
}

export const COLORS: TemplatePalette = {
  ink: '#14141F',
  paper: '#ECECF4',
  surface: '#FFFFFF',
  accent: '#5B45C9',
  accentSoft: '#EEEAFA',
  critical: '#C81E12',
  warning: '#C88A00',
  safe: '#0A6B62',
  muted: '#5C5D6E',
  line: '#D8D8E4',
  inkSoft: '#2A2A3C',
}

export const DEFAULT_THEME = {
  accent: COLORS.accent,
  ink: COLORS.ink,
} as const

export function resolveTemplateColors(incident: RecallIncident): TemplatePalette {
  const accent = incident.theme?.accent ?? DEFAULT_THEME.accent
  const ink = incident.theme?.ink ?? DEFAULT_THEME.ink
  return {
    ...COLORS,
    accent,
    ink,
    accentSoft: blendHex(accent, '#FFFFFF', 0.88),
    inkSoft: blendHex(ink, '#FFFFFF', 0.15),
  }
}

function blendHex(from: string, to: string, amount: number): string {
  const parse = (hex: string) => {
    const value = hex.replace('#', '')
    return [
      Number.parseInt(value.slice(0, 2), 16),
      Number.parseInt(value.slice(2, 4), 16),
      Number.parseInt(value.slice(4, 6), 16),
    ] as const
  }
  const [r1, g1, b1] = parse(from)
  const [r2, g2, b2] = parse(to)
  const mix = (a: number, b: number) => Math.round(a * (1 - amount) + b * amount)
  const channel = (n: number) => n.toString(16).padStart(2, '0')
  return `#${channel(mix(r1, r2))}${channel(mix(g1, g2))}${channel(mix(b1, b2))}`
}

export function severityColor(severity: RecallIncident['severity']): string {
  switch (severity) {
    case 'critical':
      return '#D92D20'
    case 'high':
      return '#E6A700'
    case 'advisory':
      return '#66716F'
  }
}

export function severityTint(severity: RecallIncident['severity']): string {
  switch (severity) {
    case 'critical':
      return '#FEF2F1'
    case 'high':
      return '#FFF8E6'
    case 'advisory':
      return '#F2F4F3'
  }
}

export function statusColor(status: RecallIncident['status']): string {
  switch (status) {
    case 'active':
      return '#C81E12'
    case 'updated':
      return '#C88A00'
    case 'resolved':
      return '#0A6B62'
  }
}
