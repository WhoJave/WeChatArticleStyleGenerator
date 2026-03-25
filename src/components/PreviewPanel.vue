<template>
  <section class="preview-section">
    <div class="container">
      <div class="preview-header">
        <span class="preview-label">◈ 实时预览</span>
        <span class="preview-style-name" v-if="styleName">当前风格：{{ styleName }}</span>
      </div>
      <div class="preview-box" ref="previewRef">
        <div v-html="html" class="preview-content"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  html: { type: String, default: '' },
  styleName: { type: String, default: '' },
})

const previewRef = ref(null)
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
  padding: 2rem;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition);
  overflow: hidden;
}

.preview-box:hover {
  box-shadow: var(--shadow-lg);
}

.preview-content {
  width: 100%;
}
</style>
