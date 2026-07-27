/** Shared type stacks for recall templates — email/document safe, web-enhanced. */

export const BODY_FONT = {
  label: 'Helvetica Neue',
  value: "'Helvetica Neue', Helvetica, Arial, sans-serif",
}

export const DISPLAY_FONT = {
  label: 'Georgia',
  value: 'Georgia, "Times New Roman", Times, serif',
}

export const MONO_FONT = {
  label: 'Courier New',
  value: "'Courier New', Courier, monospace",
}

export const MONO_STACK = "'Courier New', Courier, monospace"

/** Web-only stacks (embedded via @import in PublicRecallNotice). */
export const WEB_DISPLAY = '"Fraunces", Georgia, "Times New Roman", serif'
export const WEB_BODY = '"DM Sans", "Segoe UI", Arial, sans-serif'
export const WEB_MONO = '"IBM Plex Mono", ui-monospace, Consolas, monospace'
