export function exportFilename(
  kind: string,
  recallId: string,
  ext: string,
  date: Date = new Date(),
) {
  const sanitized = recallId
    .replace(/[^A-Za-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
  const id = sanitized || 'recall'
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `recallkit-${kind}-${id}-${year}-${month}-${day}.${ext}`
}

export function fallbackErrorHtml(title: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
</head>
<body style="margin:0;background:#f4f6f5;font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#111820;">
<div style="max-width:480px;margin:80px auto;padding:32px;background:#ffffff;border:1px solid #d9dedc;border-radius:8px;">
<p style="margin:0 0 8px;font-size:17px;font-weight:700;">Preview failed to render</p>
<p style="margin:0;font-size:14px;line-height:1.5;color:#66716f;">Something went wrong while rendering this output. Your draft is safe and has not been changed. Adjust the incident data and the preview will update.</p>
</div>
</body>
</html>`
}

export function downloadText(
  content: string,
  filename: string,
  type: string,
) {
  const blob = new Blob([content], { type: `${type};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()

  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function printHtml(html: string) {
  const frame = document.createElement('iframe')

  frame.setAttribute('title', 'RecallKit print document')
  frame.style.position = 'fixed'
  frame.style.width = '1px'
  frame.style.height = '1px'
  frame.style.right = '0'
  frame.style.bottom = '0'
  frame.style.border = '0'
  frame.srcdoc = html

  frame.addEventListener(
    'load',
    () => {
      const printWindow = frame.contentWindow

      if (!printWindow) {
        frame.remove()
        return
      }

      try {
        printWindow.focus()
        printWindow.print()
      } catch {
        frame.remove()
        return
      }

      window.setTimeout(() => frame.remove(), 1000)
    },
    { once: true },
  )

  document.body.append(frame)
}
