import type { RecallIncident } from '../domain/recall-schema'

export const sampleIncident: RecallIncident = {
  id: 'RK-2026-071',
  title: 'Arc 20K Power Bank Overheating Recall',
  announcedAt: '2026-07-18T00:00:00',
  updatedAt: '2026-07-22T00:00:00',
  severity: 'high',
  status: 'active',
  theme: {
    accent: '#5B45C9',
    ink: '#14141F',
  },
  company: {
    name: 'Northline Devices',
    supportEmail: 'safety@northlinedevices.example',
    supportPhone: '+1 (800) 555-0142',
    supportHours: 'Monday–Friday 8 AM–8 PM ET',
    verificationUrl: 'https://northlinedevices.example/recalls/RK-2026-071',
    returnInstructions:
      'Request a prepaid return label at the verification link or by calling support. Package the unit and drop it at any major carrier location.',
  },
  product: {
    name: 'Arc 20K Power Bank',
    model: 'NL-A20',
    imageUrl: '/powerbank.jpg',
    affectedBatches: [
      'A20-2604-17',
      'A20-2604-18',
      'A20-2605-02',
    ],
  },
  risk: {
    headline: 'Battery may overheat while charging',
    description:
      'Certain batches may overheat during USB-C charging. In rare cases the unit may swell, emit smoke, or ignite.',
    reportedIncidents: 14,
    reportedInjuries: 2,
  },
  action: {
    immediateInstruction:
      'Stop using the power bank immediately. Disconnect it from any power source.',
    steps: [
      'Disconnect the power bank from all cables and devices.',
      'Check the batch code on the rear label against the affected list.',
      'If affected, request a prepaid return label via the link below or by phone.',
    ],
    remedyType: 'replacement',
    remedyDescription:
      'Free replacement from a corrected batch, or a full refund — your choice.',
    responseDeadline: '2026-10-31T00:00:00',
    returnInstructions:
      'Request a prepaid return label at the verification link or by calling support. Package the unit and drop it at any major carrier location.',
  },
}
