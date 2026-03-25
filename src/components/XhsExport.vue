<template>
  <div class="xhs-panel">
    <div class="panel-header">
      <h3 class="panel-title">
        <span class="xhs-icon">📕</span>
        小红书内容导出
      </h3>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <div class="panel-body">
      <div class="note info">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>小红书暂无官方发布 API，支持将排版导出为<strong>图片 + 文案</strong>格式，方便手动发布。</span>
      </div>

      <!-- Preview as image -->
      <div class="export-section">
        <h4 class="export-label">📷 导出为图片</h4>
        <div class="export-preview">
          <div v-html="currentHtml" ref="exportPreview"></div>
        </div>
        <button class="export-btn" @click="exportImage" :disabled="exporting">
          <span v-if="exporting" class="spinner"></span>
          {{ exporting ? '生成中...' : '下载图片' }}
        </button>
      </div>

      <!-- Copy text -->
      <div class="export-section">
        <h4 class="export-label">📝 文案复制</h4>
        <div class="text-preview">
          <p class="text-title">{{ article.title }}</p>
          <p class="text-subtitle" v-if="article.subtitle">{{ article.subtitle }}</p>
          <p class="text-body">{{ article.body }}</p>
          <p class="text-tags">#{{ (article.tag || '').replace(/\s*·\s*/g, ' #') }}</p>
        </div>
        <button class="export-btn btn-copy" @click="copyText">
          复制小红书文案
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const props = defineProps({
  article: { type: Object, required: true },
  currentHtml: { type: String, default: '' },
  currentStyle: { type: Object, default: null },
})

const emit = defineEmits(['toast', 'close'])
const clipboard = inject('clipboard')

const exporting = ref(false)
const exportPreview = ref(null)

async function exportImage() {
  exporting.value = true
  try {
    // Dynamic import to avoid large bundle if not used
    const html2canvas = (await import('html2canvas')).default
    const el = exportPreview.value
    if (!el) throw new Error('Preview element not found')

    // Capture the first child (the actual rendered <section>) to avoid the outer white padding
    const targetEl = el.firstElementChild || el

    const canvas = await html2canvas(targetEl, {
      backgroundColor: null, // use null for transparent background so rounded corners don't have white edges
      scale: 2,
      useCORS: true,
    })

    const link = document.createElement('a')
    link.download = `${props.article.title || '排版'}_${props.currentStyle?.name || '风格'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()

    emit('toast', '图片已下载', 'success')
  } catch (err) {
    console.error('Export failed:', err)
    emit('toast', `导出失败: ${err.message}`, 'error')
  } finally {
    exporting.value = false
  }
}

async function copyText() {
  const text = [
    props.article.title,
    props.article.subtitle ? `\n${props.article.subtitle}` : '',
    `\n\n${props.article.body || ''}`,
    `\n\n#${(props.article.tag || '').replace(/\s*·\s*/g, ' #')}`,
  ].join('')

  try {
    await navigator.clipboard.writeText(text)
    emit('toast', '文案已复制到剪贴板', 'success')
  } catch {
    emit('toast', '复制失败', 'error')
  }
}
</script>

<style scoped>
.xhs-panel {
  margin-top: 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.2rem;
  background: linear-gradient(135deg, rgba(255, 36, 66, 0.1), rgba(255, 36, 66, 0.05));
  border-bottom: 1px solid var(--border);
}

.panel-title {
  font-size: 0.88rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.2rem;
  transition: color var(--transition);
}
.close-btn:hover { color: var(--text-primary); }

.panel-body {
  padding: 1.2rem;
}

.note {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.7rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  line-height: 1.5;
}

.note.info {
  background: rgba(33, 150, 243, 0.08);
  border: 1px solid rgba(33, 150, 243, 0.2);
  color: var(--text-secondary);
}

.note svg {
  flex-shrink: 0;
  margin-top: 1px;
  color: #2196f3;
}

.export-section {
  margin-bottom: 1.2rem;
}

.export-label {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-bottom: 0.6rem;
  font-weight: 600;
}

.export-preview {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.6rem;
  max-height: 300px;
  overflow-y: auto;
}

.text-preview {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  margin-bottom: 0.6rem;
}

.text-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.3rem;
}

.text-subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.text-body {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 0.5rem;
}

.text-tags {
  font-size: 0.8rem;
  color: #ff2442;
  font-weight: 500;
}

.export-btn {
  width: 100%;
  padding: 0.65rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #ff2442, #e01f3d);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.export-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(255, 36, 66, 0.3);
}

.export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.export-btn.btn-copy {
  background: linear-gradient(135deg, var(--accent), #e8c86e);
  color: #000;
}

.export-btn.btn-copy:hover {
  box-shadow: 0 4px 16px rgba(201, 169, 98, 0.3);
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
</style>
