<template>
  <div class="app">
    <TopBar />
    <ArticleInput :article="article" :typeOptions="typeOptions" />
    <StyleSelector
      :categories="STYLE_CATEGORIES"
      :activeCategory="activeCategory"
      :filteredStyles="filteredStyles"
      :currentIndex="currentIndex"
      :styles="STYLES"
      @select-category="selectCategory"
      @select-style="handleStyleSelect"
    />

    <!-- Font selector bar -->
    <div class="font-bar container">
      <span class="font-bar-label">🔤 字体</span>
      <div class="font-options">
        <button
          v-for="font in FONTS"
          :key="font.id"
          class="font-btn"
          :class="{ active: currentFontId === font.id }"
          :style="{ fontFamily: font.family }"
          @click="setFont(font.id)"
        >
          {{ font.name }}
        </button>
      </div>
    </div>

    <!-- Font wrapper: applies selected font to all preview output via CSS var + override -->
    <div class="font-scope" :style="{ '--preview-font': currentFont.family }">
      <PreviewPanel
        :html="currentPreviewHtml"
        :styleName="currentStyle?.name"
      />
      <ActionBar
        :currentHtml="currentPreviewHtml"
        :allHtml="allStylesHtml"
        :article="getArticleData()"
        :currentStyle="currentStyle"
        :styles="STYLES"
        @toast="showToast"
      />
      <CardGrid
        :styles="filteredStyles"
        :articleData="getArticleData()"
        @copy="handleCardCopy"
        @select="handleCardSelect"
        @toast="showToast"
      />
    </div>

    <Toast :message="toast.message.value" :visible="toast.visible.value" :type="toast.type.value" />
  </div>
</template>

<script setup>
import { computed, provide } from 'vue'
import { useStyles } from './composables/useStyles.js'
import { useArticle } from './composables/useArticle.js'
import { useClipboard } from './composables/useClipboard.js'
import { useToast } from './composables/useToast.js'
import { useFont, FONTS } from './composables/useFont.js'

import TopBar from './components/TopBar.vue'
import ArticleInput from './components/ArticleInput.vue'
import StyleSelector from './components/StyleSelector.vue'
import PreviewPanel from './components/PreviewPanel.vue'
import ActionBar from './components/ActionBar.vue'
import CardGrid from './components/CardGrid.vue'
import Toast from './components/Toast.vue'

const { STYLES, STYLE_CATEGORIES, currentIndex, activeCategory, filteredStyles, currentStyle, selectStyle, selectCategory, getGlobalIndex } = useStyles()
const { article, typeOptions, getArticleData, formatBody } = useArticle()
const clipboard = useClipboard()
const toast = useToast()
const { currentFontId, setFont, getCurrentFont } = useFont()

const currentFont = computed(() => getCurrentFont())

provide('clipboard', clipboard)
provide('toast', toast)

const currentPreviewHtml = computed(() => {
  if (!currentStyle.value) return ''
  return currentStyle.value.render(getArticleData())
})

const allStylesHtml = computed(() => {
  const data = getArticleData()
  return STYLES.map(s => s.render(data)).join('\n\n<!-- 风格分割 -->\n\n')
})

function handleStyleSelect(idx) {
  selectStyle(idx)
}

function handleCardSelect(filteredIdx) {
  const globalIdx = getGlobalIndex(filteredIdx)
  selectStyle(globalIdx)
}

async function handleCardCopy(filteredIdx) {
  const style = filteredStyles.value[filteredIdx]
  const html = style.render(getArticleData())
  const ok = await clipboard.copyHtml(html, `card-${style.id}`)
  showToast(ok ? `已复制「${style.name}」风格` : '复制失败，请手动选择')
}

function showToast(msg, type = 'success') {
  toast.show(msg, type)
}
</script>

<style>
.app {
  min-height: 100vh;
  padding-bottom: 4rem;
}

/* Font bar */
.font-bar {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding-top: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

.font-bar-label {
  font-size: 0.72rem;
  color: var(--text-secondary);
  font-weight: 600;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.font-options {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.font-btn {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}

.font-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.font-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #000;
  font-weight: 600;
}

/* Apply CSS var font-family to ALL rendered HTML in cards and preview */
.font-scope .preview-content *,
.font-scope .card-preview-inner * {
  font-family: var(--preview-font) !important;
}
</style>
