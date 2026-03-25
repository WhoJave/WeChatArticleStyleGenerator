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
    <Toast :message="toast.message.value" :visible="toast.visible.value" :type="toast.type.value" />
  </div>
</template>

<script setup>
import { computed, provide } from 'vue'
import { useStyles } from './composables/useStyles.js'
import { useArticle } from './composables/useArticle.js'
import { useClipboard } from './composables/useClipboard.js'
import { useToast } from './composables/useToast.js'

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
  // idx is global index
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
</style>
