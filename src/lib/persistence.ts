import { recallIncidentSchema, type RecallIncident } from '../domain/recall-schema'
import { sampleIncident } from '../data/sample-incident'

const STORAGE_KEY = 'recallkit:incident'
const SCHEMA_VERSION = 1

interface StorageEnvelope {
  version: number
  data: unknown
}

export function loadIncident(): RecallIncident {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return sampleIncident

    const envelope: StorageEnvelope = JSON.parse(raw)
    if (envelope.version !== SCHEMA_VERSION) return sampleIncident

    const result = recallIncidentSchema.safeParse(envelope.data)
    if (!result.success) return sampleIncident

    return result.data
  } catch {
    return sampleIncident
  }
}

export function saveIncident(incident: RecallIncident): void {
  try {
    const envelope: StorageEnvelope = {
      version: SCHEMA_VERSION,
      data: incident,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope))
  } catch {
    // Storage full or unavailable — silently degrade
  }
}

export function clearIncident(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Silently degrade
  }
}
