import { renderToHtml } from '@unlayer/react-elements'
import { it } from 'vitest'
import { writeFileSync } from 'node:fs'
import { sampleIncident } from '../../src/data/sample-incident'
import { CustomerRecallEmail } from '../../src/templates/email/CustomerRecallEmail'

it('dumps html', () => {
  const html = renderToHtml(CustomerRecallEmail({ incident: sampleIncident }), { title: 'Customer Recall Email' })
  writeFileSync('C:/Users/fadhm/Desktop/stupid/tmp-email-dump.html', html)
})
