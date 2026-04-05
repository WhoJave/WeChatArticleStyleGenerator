<template>
  <div class="card-grid-wrapper">
    <!-- Toolbar -->
    <div class="grid-toolbar container">
      <div class="toolbar-left">
        <span class="toolbar-label">◈ 全部风格</span>
        <select v-model="aspectRatio" class="aspect-select">
          <option value="auto">自适应</option>
          <option value="1/1">1:1</option>
          <option value="3/4">3:4</option>
          <option value="4/3">4:3</option>
          <option value="16/9">16:9</option>
        </select>
        <div class="ratio-presets">
          <button
            v-for="preset in presets"
            :key="preset.label"
            class="ratio-btn"
            :class="{ active: activePreset === preset.label }"
            @click="applyPreset(preset)"
          >{{ preset.label }}</button>
        </div>
      </div>
      <div class="toolbar-right">
        <div class="slider-group">
          <span class="slider-icon">↔</span>
          <span class="slider-label">宽度</span>
          <input type="range" min="250" max="700" step="10" v-model.number="cardWidth" class="toolbar-slider" @input="activePreset = '自定义'" />
          <span class="slider-value">{{ cardWidth }}px</span>
        </div>
        <div class="slider-group">
          <span class="slider-icon">🔍</span>
          <span class="slider-label">缩放</span>
          <input type="range" min="30" max="100" step="5" v-model.number="scalePercent" class="toolbar-slider" @input="activePreset = '自定义'" />
          <span class="slider-value">{{ scalePercent }}%</span>
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div class="cards-grid" :style="gridStyle">
      <div
        v-for="(style, idx) in styles"
        :key="style.id"
        class="card-item"
        @click="$emit('select', idx)"
      >
        <div class="card-preview" :style="frameStyle">
          <div class="card-inner-content" :style="scalerStyle" v-html="renderWithFont(style)" :ref="el => setPreviewRef(el, style.id)"></div>
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
import { reactive, ref, computed } from 'vue'

const props = defineProps({
  styles: { type: Array, required: true },
  articleData: { type: Object, required: true },
  fontFamily: { type: String, default: '' },
})

const emit = defineEmits(['copy', 'select', 'toast'])

import { useLayout } from '../composables/useLayout.js'
const { aspectRatio } = useLayout()

const frameStyle = computed(() => {
  if (aspectRatio.value === 'auto') return {}
  return {
    aspectRatio: aspectRatio.value,
  }
})

// Replace hard-coded font-family in render output with the selected font
function renderWithFont(style) {
  const html = style.render(props.articleData)
  if (!props.fontFamily) return html
  return html.replace(/font-family:[^;"]+/gi, `font-family:${props.fontFamily}`)
}

const copyStatuses = reactive({})
const downloadStatuses = reactive({})
const cardPreviews = ref({})

// ── Layout controls ──
const cardWidth = ref(380)
const scalePercent = ref(60)
const activePreset = ref('默认')

const presets = [
  { label: '大图', width: 600, scale: 80 },
  { label: '默认', width: 380, scale: 60 },
  { label: '紧凑', width: 300, scale: 45 },
  { label: '缩略', width: 250, scale: 35 },
]

function applyPreset(preset) {
  activePreset.value = preset.label
  cardWidth.value = preset.width
  scalePercent.value = preset.scale
}

// Init
applyPreset(presets[1])

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(auto-fill, minmax(${cardWidth.value}px, 1fr))`,
}))

const scalerStyle = computed(() => {
  const s = scalePercent.value / 100
  return {
    zoom: s,
  }
})

// ── Card logic ──
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
  gap: 1.2rem;
}

.toolbar-label {
  font-size: 0.72rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  white-space: nowrap;
}

.aspect-select {
  padding: 0.28rem 0.65rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg-primary);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-secondary);
  outline: none;
  cursor: pointer;
  transition: all var(--transition);
}

.aspect-select:hover {
  border-color: var(--accent);
  color: var(--accent);
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

.slider-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.slider-icon {
  font-size: 0.8rem;
}

.slider-label {
  font-size: 0.72rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.toolbar-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100px;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  outline: none;
  cursor: pointer;
}

.toolbar-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  transition: transform var(--transition);
}

.toolbar-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.slider-value {
  font-size: 0.72rem;
  color: var(--text-secondary);
  min-width: 42px;
  text-align: right;
}

/* ── Grid ── */
.cards-grid {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
  display: grid;
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

/* ── Preview with zoom ── */
.card-preview {
  background: #ffffff;
  overflow: hidden;
  position: relative;
}

.card-inner-content {
  width: 100%;
}

/* ── Footer ── */
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
  .cards-grid { grid-template-columns: 1fr !important; padding: 0 1rem 2rem; }
  .toolbar-slider { width: 70px; }
  .grid-toolbar { flex-direction: column; align-items: flex-start; }
}
</style>
