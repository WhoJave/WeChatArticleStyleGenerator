import { ref } from 'vue'

export function useClipboard() {
  const copyStatus = ref({})

  async function copyHtml(html, key = 'default') {
    copyStatus.value[key] = 'copying'
    try {
      if (navigator.clipboard && navigator.clipboard.write) {
        const blob = new Blob([html], { type: 'text/html' })
        await navigator.clipboard.write([
          new ClipboardItem({ 'text/html': blob })
        ])
      } else {
        await navigator.clipboard.writeText(html)
      }
      copyStatus.value[key] = 'copied'
      setTimeout(() => {
        copyStatus.value[key] = ''
      }, 2000)
      return true
    } catch (err) {
      copyStatus.value[key] = 'failed'
      setTimeout(() => {
        copyStatus.value[key] = ''
      }, 1500)
      return false
    }
  }

  function getStatus(key = 'default') {
    return copyStatus.value[key] || ''
  }

  function getStatusText(key = 'default') {
    const s = copyStatus.value[key]
    if (s === 'copying') return '复制中...'
    if (s === 'copied') return '已复制 ✓'
    if (s === 'failed') return '失败'
    return '复制'
  }

  return {
    copyStatus,
    copyHtml,
    getStatus,
    getStatusText,
  }
}
