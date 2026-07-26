import { Column, ColumnLayouts, Html, Page, Row } from '@unlayer/react-elements'
import {
  BATCH_EDGE_DASH_RE,
  BATCH_SEPARATOR_RE,
  BATCH_VALID_RE,
} from '../../domain/batch-matching'
import type { RecallIncident } from '../../domain/recall-schema'
import {
  formatDate,
  remedyLabel,
  severityLabel,
  statusLabel,
} from '../../domain/recall-selectors'
import { COLORS, severityColor } from '../shared'

export interface PublicRecallNoticeProps {
  incident: RecallIncident
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[character]
  })
}

function safeWebUrl(value: string): string | null {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

function safeImageUrl(value: string): string | null {
  if (/^\/(?!\/)/.test(value)) return value
  return safeWebUrl(value)
}

function safeEmailHref(value: string): string | null {
  const email = value.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(email)) return null
  return `mailto:${encodeURIComponent(email)}`
}

function safePhoneHref(value: string): string | null {
  const phone = value.trim().replace(/(?!^\+)[^\d]/g, '')
  return /^\+?\d{7,15}$/.test(phone) ? `tel:${phone}` : null
}

function normalizeBatch(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(BATCH_SEPARATOR_RE, '-')
    .replace(BATCH_EDGE_DASH_RE, '')
}

function scriptJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

function linkOrText(href: string | null, label: string, className = ''): string {
  const text = escapeHtml(label)
  const safeClass = escapeHtml(className)
  if (!href) return `<span class="${safeClass}">${text}</span>`
  return `<a class="${safeClass}" href="${escapeHtml(href)}">${text}</a>`
}

function publicNoticeMarkup(incident: RecallIncident): string {
  const verificationUrl = safeWebUrl(incident.company.verificationUrl)
  const emailHref = safeEmailHref(incident.company.supportEmail)
  const phoneHref = safePhoneHref(incident.company.supportPhone)
  const imageUrl = safeImageUrl(incident.product.imageUrl)
  const affectedBatches = incident.product.affectedBatches.map(normalizeBatch)
  const status = statusLabel(incident.status)
  const statusTextColor = incident.severity === 'high' ? COLORS.ink : COLORS.surface
  const riskCounts = [
    incident.risk.reportedIncidents == null
      ? null
      : `<span><strong>${incident.risk.reportedIncidents}</strong> reported incident${incident.risk.reportedIncidents === 1 ? '' : 's'}</span>`,
    incident.risk.reportedInjuries == null
      ? null
      : `<span><strong>${incident.risk.reportedInjuries}</strong> reported injur${incident.risk.reportedInjuries === 1 ? 'y' : 'ies'}</span>`,
  ].filter(Boolean).join('')
  const deadline = incident.action.responseDeadline
    ? `<p class="rn-deadline"><strong>Response requested by:</strong> ${escapeHtml(formatDate(incident.action.responseDeadline))}</p>`
    : ''
  const productImage = imageUrl
    ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(incident.product.name)}, model ${escapeHtml(incident.product.model)}" />`
    : '<div class="rn-image-fallback" role="img" aria-label="Product image unavailable">Product image unavailable</div>'
  const verificationLink = verificationUrl
    ? `<a class="rn-button rn-button-light" href="${escapeHtml(verificationUrl)}" target="_blank" rel="noopener noreferrer">Open verification page <span aria-hidden="true">↗</span></a>`
    : ''

  return `
<style>
  .rn{--ink:${COLORS.ink};--paper:${COLORS.paper};--surface:${COLORS.surface};--muted:${COLORS.muted};--line:${COLORS.line};--accent:${severityColor(incident.severity)};--status-ink:${statusTextColor};--mono:ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace;-webkit-tap-highlight-color:transparent;color:var(--ink);font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55}
  .rn *{box-sizing:border-box}.rn h1,.rn h2{text-wrap:balance}.rn a,.rn button,.rn input,.rn summary{touch-action:manipulation}.rn-mono{font-family:var(--mono)}.rn a{color:#075e59;text-decoration-thickness:1px;text-underline-offset:3px}.rn a:hover{text-decoration-thickness:2px}.rn a:focus-visible,.rn button:focus-visible,.rn input:focus-visible,.rn summary:focus-visible{outline:3px solid #148f87;outline-offset:3px}.rn-skip{background:#fff;color:var(--ink)!important;font-weight:700;left:12px;padding:10px 14px;position:fixed;top:12px;transform:translateY(-200%);z-index:10}.rn-skip:focus{transform:translateY(0)}
  .rn-status{align-items:center;background:var(--accent);color:var(--status-ink);display:flex;justify-content:space-between;padding:12px clamp(20px,5vw,64px)}.rn-status strong{font-size:13px;letter-spacing:.1em;text-transform:uppercase}.rn-status span{border:1.5px solid currentColor;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:.06em;padding:4px 12px;text-transform:uppercase}
  .rn-wrap{margin:0 auto;max-width:1120px;padding-left:clamp(20px,5vw,64px);padding-right:clamp(20px,5vw,64px)}.rn-hero{background:var(--surface);padding-bottom:68px;padding-top:52px}.rn-eyebrow{align-items:baseline;border-top:3px solid var(--ink);color:var(--muted);display:inline-flex;flex-wrap:wrap;font-size:12px;font-weight:700;gap:6px 14px;letter-spacing:.12em;margin:0 0 20px;padding-top:12px;text-transform:uppercase}.rn-eyebrow-co{color:var(--ink)}.rn-eyebrow-note{border-left:1px solid #a9b2b0;padding-left:14px}.rn h1{font-size:clamp(34px,6vw,64px);letter-spacing:-.03em;line-height:1.06;margin:0;max-width:900px;overflow-wrap:anywhere}.rn-meta{color:var(--muted);display:flex;flex-wrap:wrap;font-size:14px;font-variant-numeric:tabular-nums;gap:8px 24px;margin:26px 0 0;overflow-wrap:anywhere}.rn-meta .rn-mono{font-size:13px;font-weight:700;letter-spacing:.02em}
  .rn-product{display:grid;gap:40px;grid-template-columns:minmax(0,1.1fr) minmax(260px,.9fr);padding-bottom:64px;padding-top:64px}.rn-product-image{align-items:center;background:#e9edeb;border-radius:8px;display:flex;justify-content:center;min-height:360px;overflow:hidden}.rn-product-image img{display:block;height:auto;max-height:460px;max-width:100%;object-fit:contain}.rn-image-fallback{color:var(--muted);font-size:14px;padding:80px 24px;text-align:center}.rn-kicker{color:var(--muted);font-size:12px;font-weight:700;letter-spacing:.08em;margin:0 0 8px;text-transform:uppercase}.rn h2{font-size:clamp(26px,4vw,40px);letter-spacing:-.02em;line-height:1.15;margin:0 0 18px}.rn h3{font-size:20px;line-height:1.3;margin:0 0 8px}.rn-model{font-size:18px;margin:0 0 26px}.rn-id-list{border-top:1px solid var(--line);margin:0}.rn-id-row{border-bottom:1px solid var(--line);display:grid;gap:18px;grid-template-columns:120px 1fr;padding:14px 0}.rn-id-row dt{color:var(--muted);font-size:14px;padding-top:2px}.rn-id-row dd{font-family:var(--mono);font-weight:700;margin:0;overflow-wrap:anywhere}.rn-plates{display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin:0;padding:0}.rn-plate{background:var(--ink);border-radius:4px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);color:#fff;font-family:var(--mono);font-size:15px;font-weight:700;letter-spacing:.08em;line-height:1;overflow-wrap:anywhere;padding:9px 12px;text-transform:uppercase}
  .rn-risk{background:var(--ink);color:#fff;padding-bottom:64px;padding-top:64px}.rn-risk .rn-kicker{color:#b9c2bf}.rn-risk p{color:#e9edeb;margin:0;max-width:780px}.rn-counts{border-top:1px solid #38424a;display:flex;flex-wrap:wrap;gap:12px 36px;margin-top:28px;padding-top:20px}.rn-counts span{color:#c9d0ce;font-size:14px}.rn-counts strong{color:#fff;font-family:var(--mono);font-size:22px;font-variant-numeric:tabular-nums;margin-right:6px}
  .rn-checker{padding-bottom:72px;padding-top:72px}.rn-check-grid{display:grid;gap:48px;grid-template-columns:minmax(0,.8fr) minmax(300px,1.2fr)}.rn-checker p{color:var(--muted);margin:0}.rn-form{background:var(--surface);border:2px solid var(--ink);border-radius:8px;padding:28px;scroll-margin-top:24px}.rn-form label{display:block;font-size:13px;font-weight:700;letter-spacing:.08em;margin-bottom:10px;text-transform:uppercase}.rn-input-row{display:flex;gap:10px}.rn input{border:1px solid #6f7976;border-radius:6px;flex:1;font-family:var(--mono);font-size:16px;font-weight:700;letter-spacing:.05em;min-height:48px;min-width:0;padding:10px 13px;text-transform:uppercase}.rn button,.rn-button{align-items:center;background:var(--ink);border:0;border-radius:6px;color:#fff;cursor:pointer;display:inline-flex;font:inherit;font-weight:700;justify-content:center;min-height:48px;padding:10px 20px;text-decoration:none;transition:background-color .15s ease}.rn button:hover,.rn-button:hover{background:#2b3540}.rn-help{font-size:13px;margin-top:9px!important}.rn-help span{font-family:var(--mono);font-weight:700}.rn-result{border-left:5px solid var(--line);margin-top:20px;padding:16px 18px}.rn-result:empty{display:none}.rn-result[data-state=affected]{background:#fff1ef;border-color:#d92d20}.rn-result[data-state=not-found]{background:#edf8f6;border-color:#007c78}.rn-result[data-state=invalid]{background:#fff7e0;border-color:#b77900}.rn-result strong{display:block;margin-bottom:4px}.rn-result strong::before{content:"" / "";font-family:var(--mono);margin-right:8px}.rn-result[data-state=affected] strong::before{color:#d92d20;content:"⚠" / ""}.rn-result[data-state=not-found] strong::before{color:#007c78;content:"?" / ""}.rn-result[data-state=invalid] strong::before{color:#b77900;content:"!" / ""}.rn-result p{color:var(--ink);margin:0}
  .rn-sections{background:var(--surface);padding-bottom:72px;padding-top:72px}.rn-two-col{display:grid;gap:56px;grid-template-columns:1fr 1fr}.rn-instruction{border-left:4px solid var(--accent);font-size:18px;font-weight:700;line-height:1.45;margin:0 0 28px;padding-left:16px}.rn-steps{counter-reset:step;list-style:none;margin:0;padding:0}.rn-steps li{border-top:1px solid var(--line);counter-increment:step;display:grid;gap:14px;grid-template-columns:34px 1fr;padding:16px 0}.rn-steps li:before{align-items:center;background:var(--ink);border-radius:4px;color:#fff;content:counter(step);display:flex;font-family:var(--mono);font-size:13px;font-weight:700;height:30px;justify-content:center;width:30px}.rn-remedy{align-self:start;background:var(--paper);border-top:4px solid var(--ink);padding:28px}.rn-remedy .rn-kicker{margin-bottom:10px}.rn-remedy h2{margin-bottom:14px}.rn-remedy p{margin:0 0 18px}.rn-deadline{color:var(--muted);font-size:14px}.rn-return{border-top:1px solid var(--line);font-size:14px;margin-bottom:0!important;padding-top:18px}.rn-return strong{display:inline-block;margin-bottom:4px}.rn-button-light{margin-top:20px}
  .rn-faq{padding-bottom:72px;padding-top:72px}.rn-faq details{border-top:1px solid var(--line)}.rn-faq details:last-child{border-bottom:1px solid var(--line)}.rn-faq summary{cursor:pointer;font-size:18px;font-weight:700;list-style:none;padding:20px 44px 20px 0;position:relative}.rn-faq summary::-webkit-details-marker{display:none}.rn-faq summary::after{color:var(--muted);content:"+";font-family:var(--mono);font-size:22px;font-weight:400;line-height:1;position:absolute;right:4px;top:50%;transform:translateY(-50%)}.rn-faq details[open] summary::after{content:"−"}.rn-faq summary:hover{color:#000}.rn-faq summary:hover::after{color:var(--ink)}.rn-faq details p{color:#4c5654;margin:0;max-width:760px;padding:0 0 22px}
  .rn-support{background:#dfe8e5;padding-bottom:64px;padding-top:64px}.rn-support .rn-kicker{color:#49534f}.rn-support-grid{display:grid;gap:36px;grid-template-columns:1fr 1fr}.rn-contact{display:flex;flex-direction:column;gap:2px}.rn-contact a:not(.rn-button),.rn-contact span{font-size:18px;font-weight:700;overflow-wrap:anywhere;padding:8px 0}.rn-hours{color:#49534f;font-size:14px!important;font-weight:400!important}.rn-footer{background:var(--ink);color:#c9d0ce;font-size:12px;padding-bottom:32px;padding-top:32px}.rn-footer p{margin:4px 0}.rn-footer strong{color:#fff}
  @media(max-width:700px){.rn-status{align-items:flex-start;flex-wrap:wrap;gap:10px}.rn-product,.rn-check-grid,.rn-two-col,.rn-support-grid{grid-template-columns:1fr}.rn-product,.rn-check-grid,.rn-two-col{gap:32px}.rn-product-image{min-height:260px}.rn-hero{padding-bottom:42px;padding-top:36px}.rn-product,.rn-checker,.rn-sections,.rn-faq{padding-bottom:48px;padding-top:48px}.rn-risk,.rn-support{padding-bottom:44px;padding-top:44px}.rn-input-row{align-items:stretch;flex-direction:column}.rn-input-row button{width:100%}.rn-id-row{grid-template-columns:92px 1fr}.rn-form{padding:20px}.rn-remedy{padding:22px 20px}}
  @media(prefers-reduced-motion:reduce){.rn *{scroll-behavior:auto!important;transition:none!important}}
</style>
<main class="rn" id="rn-main" tabindex="-1">
  <a class="rn-skip" href="#rn-batch-input">Skip to batch checker</a>
  <div class="rn-status">
    <strong>${escapeHtml(severityLabel(incident.severity))} product recall</strong>
    <span>${escapeHtml(status)}</span>
  </div>
  <header class="rn-hero">
    <div class="rn-wrap">
      <p class="rn-eyebrow"><span class="rn-eyebrow-co">${escapeHtml(incident.company.name)}</span><span class="rn-eyebrow-note">Public safety notice</span></p>
      <h1>${escapeHtml(incident.title)}</h1>
      <p class="rn-meta"><span>Announced ${escapeHtml(formatDate(incident.announcedAt))}</span><span>Recall <span class="rn-mono" translate="no">${escapeHtml(incident.id)}</span></span><span>Last updated ${escapeHtml(formatDate(incident.updatedAt))}</span></p>
    </div>
  </header>
  <section class="rn-wrap rn-product" aria-labelledby="rn-product-title">
    <div class="rn-product-image">${productImage}</div>
    <div>
      <p class="rn-kicker">Product identification</p>
      <h2 id="rn-product-title">${escapeHtml(incident.product.name)}</h2>
      <p class="rn-model">Model ${escapeHtml(incident.product.model)}</p>
      <dl class="rn-id-list" translate="no">
        <div class="rn-id-row"><dt>Recall ID</dt><dd>${escapeHtml(incident.id)}</dd></div>
        <div class="rn-id-row"><dt>Model</dt><dd>${escapeHtml(incident.product.model)}</dd></div>
        <div class="rn-id-row"><dt>Affected batches</dt><dd><ul class="rn-plates">${incident.product.affectedBatches.map((batch) => `<li class="rn-plate">${escapeHtml(batch)}</li>`).join('')}</ul></dd></div>
      </dl>
    </div>
  </section>
  <section class="rn-risk" aria-labelledby="rn-risk-title">
    <div class="rn-wrap">
      <p class="rn-kicker">Safety risk</p>
      <h2 id="rn-risk-title">${escapeHtml(incident.risk.headline)}</h2>
      <p>${escapeHtml(incident.risk.description)}</p>
      ${riskCounts ? `<div class="rn-counts" aria-label="Reported case counts">${riskCounts}</div>` : ''}
    </div>
  </section>
  <section class="rn-wrap rn-checker" aria-labelledby="rn-checker-title">
    <div class="rn-check-grid">
      <div><p class="rn-kicker">Affected batch checker</p><h2 id="rn-checker-title">Check the label on your product</h2><p>Enter the batch identifier exactly as shown on the rear label. Spaces, letter case, dots, underscores and common dash styles are normalized.</p></div>
      <form class="rn-form" id="rn-batch-form" novalidate>
        <label for="rn-batch-input">Batch identifier</label>
        <div class="rn-input-row"><input id="rn-batch-input" name="batch" type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="rn-batch-help rn-batch-result" /><button type="submit">Check batch</button></div>
        <p class="rn-help" id="rn-batch-help">Example format: <span translate="no">A20-2604-17</span></p>
        <div class="rn-result" id="rn-batch-result" role="status" aria-live="polite" aria-atomic="true"></div>
        <noscript><p class="rn-result" data-state="invalid">JavaScript is unavailable. Compare your identifier with the affected list above, then contact support if you are uncertain.</p></noscript>
      </form>
    </div>
  </section>
  <section class="rn-sections" aria-labelledby="rn-action-title">
    <div class="rn-wrap rn-two-col">
      <div><p class="rn-kicker">Immediate action</p><h2 id="rn-action-title">What you need to do</h2><p class="rn-instruction">${escapeHtml(incident.action.immediateInstruction)}</p><ol class="rn-steps">${incident.action.steps.map((step) => `<li><span>${escapeHtml(step)}</span></li>`).join('')}</ol></div>
      <aside class="rn-remedy" aria-labelledby="rn-remedy-title"><p class="rn-kicker">Remedy</p><h2 id="rn-remedy-title">${escapeHtml(remedyLabel(incident.action.remedyType))} available</h2><p>${escapeHtml(incident.action.remedyDescription)}</p>${deadline}<p class="rn-return"><strong>Return instructions</strong><br>${escapeHtml(incident.action.returnInstructions)}</p>${verificationLink}</aside>
    </div>
  </section>
  <section class="rn-wrap rn-faq" aria-labelledby="rn-faq-title">
    <p class="rn-kicker">Frequently asked questions</p><h2 id="rn-faq-title">Questions about this recall</h2>
    <details><summary>How do I know whether my product is affected?</summary><p>Find the batch identifier on the rear label and use the checker above. A matching identifier is affected. If it is missing, damaged, or not recognized, contact ${escapeHtml(incident.company.name)} support; a “not found” result does not prove the product is safe.</p></details>
    <details><summary>What should I do while I arrange the return?</summary><p>${escapeHtml(incident.action.immediateInstruction)} Follow the return instructions provided by support.</p></details>
    <details><summary>What remedy is available?</summary><p>${escapeHtml(incident.action.remedyDescription)}</p></details>
    <details><summary>What if my batch identifier cannot be read?</summary><p>Do not guess. Stop using the product and contact support by phone or email for help identifying it.</p></details>
  </section>
  <section class="rn-support" aria-labelledby="rn-support-title"><div class="rn-wrap rn-support-grid"><div><p class="rn-kicker">Need help?</p><h2 id="rn-support-title">Contact recall support</h2><p>Have the product, model number and batch label nearby when you contact us.</p></div><div class="rn-contact">${linkOrText(phoneHref, incident.company.supportPhone)}${linkOrText(emailHref, incident.company.supportEmail)}<span class="rn-hours">${escapeHtml(incident.company.supportHours)}</span>${verificationLink}</div></div></section>
  <footer class="rn-footer"><div class="rn-wrap"><p><strong>Last updated ${escapeHtml(formatDate(incident.updatedAt))}</strong> · Recall <span class="rn-mono" translate="no">${escapeHtml(incident.id)}</span></p><p>This is a fictional recall scenario created for demonstration purposes. No real products, companies, or safety incidents are represented.</p></div></footer>
</main>
<script>
(() => {
  const affected = new Set(${scriptJson(affectedBatches)});
  const form = document.getElementById('rn-batch-form');
  const input = document.getElementById('rn-batch-input');
  const result = document.getElementById('rn-batch-result');
  const image = document.querySelector('.rn-product-image img');
  if (image) {
    image.addEventListener('error', () => {
      image.outerHTML = '<div class="rn-image-fallback" role="img" aria-label="Product image unavailable">Product image unavailable</div>';
    });
  }
  if (!form || !input || !result) return;
  const SEP = new RegExp(${scriptJson(BATCH_SEPARATOR_RE.source)}, 'g');
  const EDGE = new RegExp(${scriptJson(BATCH_EDGE_DASH_RE.source)}, 'g');
  const VALID = new RegExp(${scriptJson(BATCH_VALID_RE.source)});
  const normalize = (value) => value.trim().toUpperCase().replace(SEP, '-').replace(EDGE, '');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const batch = normalize(input.value);
    const valid = VALID.test(batch);
    input.setAttribute('aria-invalid', String(!valid));
    result.textContent = '';
    if (!valid) {
      result.dataset.state = 'invalid';
      result.innerHTML = '<strong>Enter a valid batch identifier</strong><p>Use the letters and numbers printed on the product label. Separators such as spaces, dashes, dots and underscores are accepted.</p>';
      return;
    }
    if (affected.has(batch)) {
      result.dataset.state = 'affected';
      result.innerHTML = '<strong>This batch is affected</strong><p>Stop using the product immediately and follow the return instructions below.</p>';
      return;
    }
    result.dataset.state = 'not-found';
    result.innerHTML = '<strong>Batch not found in the affected list</strong><p>This result does not confirm your product is safe. Check the identifier again or contact support if you are uncertain.</p>';
  });
})();
</script>`
}

export function PublicRecallNotice({ incident }: PublicRecallNoticeProps) {
  return (
    <Page
      backgroundColor={COLORS.paper}
      contentWidth="1200px"
      fontFamily={{ label: 'Arial', value: 'Arial, Helvetica, sans-serif' }}
      textColor={COLORS.ink}
    >
      <Row layout={ColumnLayouts.OneColumn} padding="0px">
        <Column padding="0px">
          <Html html={publicNoticeMarkup(incident)} />
        </Column>
      </Row>
    </Page>
  )
}
