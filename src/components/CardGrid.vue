<template>
  <div class="card-grid-wrapper">
    <!-- Toolbar above the grid -->
    <div class="grid-toolbar container">
      <div class="toolbar-left">
        <span class="toolbar-label">◈ 全部风格</span>
        <span class="toolbar-hint">预览比例</span>
        <div class="ratio-presets">
          <button
            v-for="preset in ratioPresets"
            :key="preset.label"
            class="ratio-btn"
            :class="{ active: activePreset === preset.label }"
            @click="applyPreset(preset)"
          >{{ preset.label }}</button>
        </div>
      </div>
      <div class="toolbar-right">
        <span class="slider-label">高度</span>
        <input
          type="range"
          min="120"
          max="700"
          step="10"
          v-model.number="previewHeight"
          class="height-slider"
          @input="activePreset = '自定义'"
        />
        <span class="slider-value">{{ previewHeight }}px</span>
      </div>
    </div>

    <!-- Card grid -->
    <div class="cards-grid">
      <div
        v-for="(style, idx) in styles"
        :key="style.id"
        class="card-item"
        @click="$emit('select', idx)"
      >
        <div class="card-preview" :style="{ height: previewHeight + 'px' }">
          <div class="card-preview-inner" v-html="style.render(articleData)" :ref="el => setPreviewRef(el, style.id)"></div>
        </div>
        <div class="card-footer">
          <span class="card-name">
            <span class="card-category-dot" :class="style.category"></span>
            {{ style.name }}
          </span>
          <div class="card-actions">
            <button
              class="action-btn download-btn"
              :disabled="downloadStatuses[style.id] === 'downloading'"
              @click.stop="handleDownload(idx, style.id)"
            >
              <span v-if="downloadStatuses[style.id] === 'downloading'" class="spinner"></span>
              {{ downloadStatuses[style.id] === 'downloading' ? '生成中' : '下载图片' }}
            </button>
            <button
              class="action-btn copy-btn"
              :class="{ copied: copyStatuses[style.id] === 'copied' }"
              :disabled="copyStatuses[style.id] === 'copying'"
              @click.stop="handleCopy(idx)"
            >
              {{ getCopyText(style.id) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  styles: { type: Array, required: true },
  articleData: { type: Object, required: true },
})

const emit = defineEmits(['copy', 'select', 'toast'])

const copyStatuses = reactive({})
const downloadStatuses = reactive({})
const cardPreviews = ref({})

// Aspect ratio / height control
const previewHeight = ref(300)
const activePreset = ref('3:4')

const ratioPresets = [
  { label: '自适应', height: null },
  { label: '1:1', ratio: 1 },
  { label: '3:4', ratio: 4 / 3 },
  { label: '4:3', ratio: 3 / 4 },
  { label: '16:9', ratio: 9 / 16 },
]

function applyPreset(preset) {
  activePreset.value = preset.label
  if (preset.height !== undefined && preset.height === null) {
    // auto — use a comfortable default
    previewHeight.value = 300
    return
  }
  // We target a card width of approximately 380px (grid minmax)
  const cardWidth = 356 // 380px - 2*12px padding
  previewHeight.value = Math.round(cardWidth * preset.ratio)
}

// Init with 3:4
applyPreset(ratioPresets[2])

function setPreviewRef(el, id) {
  if (el) cardPreviews.value[id] = el
}

function getCopyText(styleId) {
  const s = copyStatuses[styleId]
  if (s === 'copying') return '...'
  if (s === 'copied') return '✓ 已复制'
  return '复制'
}

async function handleCopy(idx) {
  const style = props.styles[idx]
  copyStatuses[style.id] = 'copying'
  emit('copy', idx)
  setTimeout(() => {
    copyStatuses[style.id] = 'copied'
    setTimeout(() => { copyStatuses[style.id] = '' }, 2000)
  }, 200)
}

async function handleDownload(idx, styleId) {
  const style = props.styles[idx]
  if (downloadStatuses[styleId] === 'downloading') return
  downloadStatuses[styleId] = 'downloading'
  try {
    const html2canvas = (await import('html2canvas')).default
    const el = cardPreviews.value[styleId]
    if (!el) throw new Error('Preview element not found')
    const targetEl = el.firstElementChild || el
    const canvas = await html2canvas(targetEl, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    })
    const link = document.createElement('a')
    link.download = `${props.articleData.title || '文章排版'}_${style.name}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    emit('toast', '图片已下载', 'success')
  } catch (err) {
    console.error('Export failed:', err)
    emit('toast', `导出失败: ${err.message}`, 'error')
  } finally {
    downloadStatuses[styleId] = ''
  }
}
</script>

<style scoped>
.card-grid-wrapper {
  margin-top: 1.5rem;
}

/* ── Toolbar ── */
.grid-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid var(--border);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.toolbar-label {
  font-size: 0.72rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  white-space: nowrap;
}

.toolbar-hint {
  font-size: 0.72rem;
  color: var(--text-secondary);
  opacity: 0.6;
  white-space: nowrap;
}

.ratio-presets {
  display: flex;
  gap: 0.35rem;
}

.ratio-btn {
  padding: 0.28rem 0.65rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--transition);
  white-space: nowrap;
}

.ratio-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.ratio-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #000;
}

.slider-label {
  font-size: 0.72rem;
  color: var(--text-secondary);
}

.height-slider {
  -webkit-appearance: none;
  width: 120px;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  outline: none;
  cursor: pointer;
}

.height-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  transition: transform var(--transition);
}

.height-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.slider-value {
  font-size: 0.72rem;
  color: var(--text-secondary);
  min-width: 42px;
}

/* ── Grid ── */
.cards-grid {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.2rem;
}

.card-item {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border);
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
  cursor: pointer;
  animation: fadeInUp 0.4s ease-out both;
}

.card-item:nth-child(1) { animation-delay: 0.02s; }
.card-item:nth-child(2) { animation-delay: 0.04s; }
.card-item:nth-child(3) { animation-delay: 0.06s; }
.card-item:nth-child(4) { animation-delay: 0.08s; }
.card-item:nth-child(5) { animation-delay: 0.10s; }
.card-item:nth-child(6) { animation-delay: 0.12s; }

.card-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--border-light);
}

/* ── Preview box with fixed height ── */
.card-preview {
  overflow: hidden;
  background: #ffffff;
  position: relative;
  /* height is bound via :style */
}

.card-preview-inner {
  width: 100%;
  /* scale down large content to fit without scroll */
  transform-origin: top left;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem 1rem;
  background: var(--bg-tertiary);
}

.card-name {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-category-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.card-category-dot.gradient { background: #667eea; }
.card-category-dot.glass    { background: #a78bfa; }
.card-category-dot.geek     { background: #00ff88; }
.card-category-dot.classic  { background: #888; }

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0.4rem 0.85rem;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--transition);
}

.action-btn:hover:not(:disabled) { transform: scale(1.05); }

.copy-btn {
  background: linear-gradient(135deg, var(--accent), #e8c86e);
  color: #000;
}
.copy-btn:hover:not(:disabled) { box-shadow: 0 2px 8px rgba(201, 169, 98, 0.3); }
.copy-btn.copied { background: var(--success); color: #fff; }

.download-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
}
.download-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

.action-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .cards-grid { grid-template-columns: 1fr; padding: 0 1rem 2rem; }
  .height-slider { width: 80px; }
  .toolbar-hint { display: none; }
}
</style>
