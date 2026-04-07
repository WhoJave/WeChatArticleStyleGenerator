<template>
  <div class="wechat-panel">
    <div class="panel-header">
      <h3 class="panel-title">
        <span class="wechat-icon">💬</span>
        微信公众号草稿同步
      </h3>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <div class="panel-body">
      <div class="config-grid">
        <div class="config-group">
          <label>AppID</label>
          <input
            type="text"
            v-model="config.appId"
            placeholder="输入公众号 AppID"
          />
        </div>
        <div class="config-group">
          <label>AppSecret</label>
          <input
            type="password"
            v-model="config.appSecret"
            placeholder="输入公众号 AppSecret"
          />
        </div>
      </div>

      <div class="sync-info">
        <div class="info-card">
          <span class="info-label">文章标题</span>
          <span class="info-value">{{ article.title || '未填写' }}</span>
        </div>
        <div class="info-card">
          <span class="info-label">当前风格</span>
          <span class="info-value">{{ currentStyle?.name || '未选择' }}</span>
        </div>
      </div>

      <div class="note">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>同步后将出现在公众号后台「草稿箱」中，内容中的图片必须通过微信接口上传。</span>
      </div>

      <div v-if="isStatic" class="static-notice">
        <div class="note warning">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>此功能需要 Node.js 后端支持。在 GitHub Pages (静态网页) 环境下，无法直接同步。请从本地运行以使用此功能。</span>
        </div>
      </div>

      <button
        class="sync-btn"
        :disabled="syncing || !config.appId || !config.appSecret || isStatic"
        @click="syncDraft"
      >
        <span v-if="syncing" class="spinner"></span>
        {{ syncing ? '同步中...' : (isStatic ? '需本地运行' : '同步到草稿箱') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
const props = defineProps({
  article: { type: Object, required: true },
  currentStyle: { type: Object, default: null },
  currentHtml: { type: String, default: '' },
})

const emit = defineEmits(['toast', 'close'])

const syncing = ref(false)
const isStatic = import.meta.env.PROD

const config = reactive({
  appId: '',
  appSecret: '',
})

async function syncDraft() {
  if (!config.appId || !config.appSecret) {
    emit('toast', '请填写 AppID 和 AppSecret', 'error')
    return
  }

  syncing.value = true
  try {
    const response = await axios.post('/api/wechat/draft', {
      appId: config.appId,
      appSecret: config.appSecret,
      title: props.article.title || '未命名',
      author: props.article.author || '',
      content: props.currentHtml,
      digest: props.article.subtitle || '',
    })

    if (response.data.success) {
      emit('toast', `草稿同步成功！Media ID: ${response.data.mediaId}`, 'success')
    } else {
      emit('toast', `同步失败: ${response.data.error}`, 'error')
    }
  } catch (err) {
    emit('toast', `同步失败: ${err.response?.data?.error || err.message}`, 'error')
  } finally {
    syncing.value = false
  }
}
</script>

<style scoped>
.wechat-panel {
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
  background: linear-gradient(135deg, rgba(7, 193, 96, 0.1), rgba(7, 193, 96, 0.05));
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

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.config-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.config-group label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.config-group input {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.5rem 0.8rem;
  color: var(--text-primary);
  font-size: 0.85rem;
  font-family: inherit;
  transition: border-color var(--transition);
}

.config-group input:focus {
  outline: none;
  border-color: #07c160;
  box-shadow: 0 0 0 3px rgba(7, 193, 96, 0.15);
}

.sync-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.info-card {
  background: var(--bg-secondary);
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--border);
}

.info-label {
  display: block;
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.2rem;
}

.note {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.7rem;
  background: rgba(255, 193, 7, 0.08);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.note.warning {
  background: rgba(255, 36, 66, 0.08);
  border-color: rgba(255, 36, 66, 0.2);
  color: #ff2442;
}

.note svg {
  flex-shrink: 0;
  margin-top: 1px;
  color: #ffc107;
}

.note.warning svg {
  color: #ff2442;
}

.sync-btn {
  width: 100%;
  padding: 0.7rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #07c160, #06ad56);
  color: #fff;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.sync-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(7, 193, 96, 0.3);
}

.sync-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@media (max-width: 768px) {
  .config-grid, .sync-info {
    grid-template-columns: 1fr;
  }
}
</style>
