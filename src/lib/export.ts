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

      printWindow.focus()
      printWindow.print()
      window.setTimeout(() => frame.remove(), 1000)
    },
    { once: true },
  )

  document.body.append(frame)
}
