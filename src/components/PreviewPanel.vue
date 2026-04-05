<template>
  <section class="preview-section">
    <div class="container">
      <div class="preview-header">
        <div class="header-left">
          <span class="preview-label">◈ 实时预览</span>
          <span class="preview-style-name" v-if="styleName">当前风格：{{ styleName }}</span>
        </div>
        <div class="header-actions">
          <select v-model="aspectRatio" class="aspect-select">
            <option value="auto">自适应</option>
            <option value="1/1">1:1</option>
            <option value="3/4">3:4</option>
            <option value="4/3">4:3</option>
            <option value="16/9">16:9</option>
          </select>
          <button class="export-btn" @click="exportImage" :disabled="exporting">
            <span v-if="exporting" class="spinner"></span>
            {{ exporting ? '生成中...' : '📥 下载图片' }}
          </button>
        </div>
      </div>
      <div class="preview-box">
        <div class="export-frame" ref="exportPreview">
          <div v-html="html" class="preview-content" :style="frameStyle"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const props = defineProps({
  html: { type: String, default: '' },
  styleName: { type: String, default: '' },
})

const exportPreview = ref(null)
const exporting = ref(false)
const aspectRatio = ref('auto')
const toast = inject('toast')

const frameStyle = computed(() => {
  if (aspectRatio.value === 'auto') return {}
  return {
    aspectRatio: aspectRatio.value,
  }
})

async function exportImage() {
  exporting.value = true
  try {
    const html2canvas = (await import('html2canvas')).default
    const el = exportPreview.value
    if (!el) throw new Error('Preview element not found')

    const canvas = await html2canvas(el, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    })

    const link = document.createElement('a')
    link.download = `Preview_${props.styleName || 'Style'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()

    if (toast) toast.show('图片已成功下载', 'success')
  } catch (err) {
    console.error('Export failed:', err)
    if (toast) toast.show(`导出失败: ${err.message}`, 'error')
  } finally {
    exporting.value = false
  }
}
</script>

<style scoped>
.preview-section {
  padding: 1.5rem 0 0;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.aspect-select {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg-primary);
  font-size: 0.8rem;
  color: var(--text-primary);
  outline: none;
  cursor: pointer;
  transition: all var(--transition);
}
.aspect-select:hover {
  border-color: var(--accent);
}

.export-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  background: linear-gradient(135deg, #ff2442, #e01f3d);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all var(--transition);
}

.export-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 36, 66, 0.3);
}

.export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.preview-label {
  font-size: 0.72rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
}

.preview-style-name {
  font-size: 0.72rem;
  color: var(--accent);
  font-weight: 500;
}

.preview-box {
  background: #ffffff;
  border-radius: var(--radius-md);
  min-height: 180px;
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.export-frame {
  width: 100%;
  background: #ffffff;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
}

.preview-box:hover {
  box-shadow: var(--shadow-lg);
}

.preview-content {
  width: 100%;
}

:deep(.preview-content > *) {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
