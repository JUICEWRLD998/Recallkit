import type { RecallIncident } from '../domain/recall-schema'
import heroImage from '../assets/hero.png'

export const sampleIncident: RecallIncident = {
  id: 'RK-2026-071',
  title: 'Arc 20K Power Bank Overheating Recall',
  announcedAt: '2026-07-18T00:00:00',
  updatedAt: '2026-07-22T00:00:00',
  severity: 'high',
  status: 'active',
  company: {
    name: 'Northline Devices',
    supportEmail: 'safety@northlinedevices.example',
    supportPhone: '+1 (800) 555-0142',
    supportHours: 'Monday–Friday 8 AM–8 PM ET',
    verificationUrl: 'https://northlinedevices.example/recalls/RK-2026-071',
    returnInstructions:
      'Request a prepaid return label at the verification link above or by calling support. Package the unit in its original box or a padded mailer and drop it at any major carrier location.',
  },
  product: {
    name: 'Arc 20K Power Bank',
    model: 'NL-A20',
    imageUrl: heroImage,
    affectedBatches: [
      'A20-2604-17',
      'A20-2604-18',
      'A20-2605-02',
    ],
  },
  risk: {
    headline: 'Battery may overheat while charging',
    description:
      'A component defect in certain production batches can cause the lithium-ion cell to overheat during USB-C charging. In rare cases the unit may swell, emit smoke, or ignite. The defect does not affect units while idle or discharging.',
    reportedIncidents: 14,
    reportedInjuries: 2,
  },
  action: {
    immediateInstruction:
      'Stop using the power bank immediately. Disconnect it from any power source and do not charge or discharge it.',
    steps: [
      'Disconnect the power bank from all cables and devices.',
      'Check the batch identifier on the rear label against the affected list.',
      'If your batch is affected, stop using the unit entirely.',
      'Visit the verification link or call support to request a prepaid return label.',
      'Package the unit and ship it using the prepaid label.',
    ],
    remedyType: 'replacement',
    remedyDescription:
      'Northline Devices will provide a free replacement Arc 20K from a corrected production batch. Alternatively, customers may request a full refund of the purchase price.',
    responseDeadline: '2026-10-31T00:00:00',
    returnInstructions:
      'Request a prepaid return label at the verification link or by calling support. Package the unit in its original box or a padded mailer and drop it at any major carrier location.',
  },
}
