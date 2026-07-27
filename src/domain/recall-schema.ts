import { z } from 'zod/v4'

export const recallSeveritySchema = z.enum(['critical', 'high', 'advisory'])
export type RecallSeverity = z.infer<typeof recallSeveritySchema>

export const recallStatusSchema = z.enum(['active', 'updated', 'resolved'])
export type RecallStatus = z.infer<typeof recallStatusSchema>

export const remedyTypeSchema = z.enum(['refund', 'replacement', 'repair'])
export type RemedyType = z.infer<typeof remedyTypeSchema>

const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/)

export const templateThemeSchema = z.object({
  accent: hexColorSchema,
  ink: hexColorSchema,
})

export type TemplateTheme = z.infer<typeof templateThemeSchema>

export const recallIncidentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  announcedAt: z.iso.datetime({ local: true }),
  updatedAt: z.iso.datetime({ local: true }),
  severity: recallSeveritySchema,
  status: recallStatusSchema,
  theme: templateThemeSchema.default({
    accent: '#5B45C9',
    ink: '#14141F',
  }),
  company: z.object({
    name: z.string().min(1),
    supportEmail: z.email(),
    supportPhone: z.string().min(1),
    supportHours: z.string().min(1),
    verificationUrl: z.url(),
    returnInstructions: z.string().min(1),
  }),
  product: z.object({
    name: z.string().min(1),
    model: z.string().min(1),
    imageUrl: z.string(),
    affectedBatches: z.array(z.string().min(1)).min(1),
  }),
  risk: z.object({
    headline: z.string().min(1),
    description: z.string().min(1),
    reportedIncidents: z.number().int().nonnegative().optional(),
    reportedInjuries: z.number().int().nonnegative().optional(),
  }),
  action: z.object({
    immediateInstruction: z.string().min(1),
    steps: z.array(z.string().min(1)).min(1),
    remedyType: remedyTypeSchema,
    remedyDescription: z.string().min(1),
    responseDeadline: z.iso.datetime({ local: true }).optional(),
    returnInstructions: z.string().min(1),
  }),
})

export type RecallIncident = z.infer<typeof recallIncidentSchema>
