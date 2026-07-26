import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const mod = await server.ssrLoadModule('/src/templates/document/render-retailer-bulletin.ts')
const data = await server.ssrLoadModule('/src/data/sample-incident.ts')
const html = mod.renderRetailerBulletinHtml(data.sampleIncident)
const { writeFileSync } = await import('node:fs')
writeFileSync('tmp/bulletin.html', html)
console.log('bytes:', html.length)
await server.close()
