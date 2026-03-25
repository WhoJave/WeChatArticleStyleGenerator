<template>
  <section class="input-section">
    <div class="container">
      <div class="section-header">
        <span class="section-icon">📝</span>
        <span class="section-label">文章内容</span>
      </div>
      <div class="input-grid">
        <div class="input-group">
          <label for="in-title">标题</label>
          <input
            id="in-title"
            type="text"
            v-model="article.title"
            placeholder="输入文章标题"
          />
        </div>
        <div class="input-group">
          <label for="in-subtitle">副标题</label>
          <input
            id="in-subtitle"
            type="text"
            v-model="article.subtitle"
            placeholder="输入副标题"
          />
        </div>
        <div class="input-group">
          <label for="in-author">作者</label>
          <input
            id="in-author"
            type="text"
            v-model="article.author"
            placeholder="作者名"
          />
        </div>
        <div class="input-group">
          <label for="in-date">日期</label>
          <input
            id="in-date"
            type="text"
            v-model="article.date"
            placeholder="2024.10.15"
          />
        </div>
        <div class="input-group">
          <label for="in-tag">标签</label>
          <input
            id="in-tag"
            type="text"
            v-model="article.tag"
            placeholder="散文 · 秋日"
          />
        </div>
        <div class="input-group">
          <label for="in-type">类型</label>
          <select id="in-type" v-model="article.type">
            <option
              v-for="opt in typeOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div class="input-group full">
          <label for="in-body">正文</label>
          <textarea
            id="in-body"
            v-model="article.body"
            placeholder="粘贴或输入文章正文内容...&#10;&#10;支持多段落，用空行分隔段落"
            rows="5"
          ></textarea>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  article: { type: Object, required: true },
  typeOptions: { type: Array, required: true },
})
</script>

<style scoped>
.input-section {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 1.5rem 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.section-icon {
  font-size: 1rem;
}

.section-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-secondary);
  font-weight: 600;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.9rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.input-group.full {
  grid-column: 1 / -1;
}

.input-group label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  font-weight: 500;
}

.input-group input,
.input-group textarea,
.input-group select {
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.65rem 1rem;
  color: var(--text-primary);
  font-size: 0.88rem;
  font-family: inherit;
  transition: border-color var(--transition), box-shadow var(--transition);
  line-height: 1.5;
}

.input-group input:focus,
.input-group textarea:focus,
.input-group select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.input-group textarea {
  resize: vertical;
  min-height: 80px;
}

.input-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238888a0' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2rem;
}

@media (max-width: 768px) {
  .input-grid {
    grid-template-columns: 1fr;
  }
}
</style>
