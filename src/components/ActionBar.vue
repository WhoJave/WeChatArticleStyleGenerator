<template>
  <section class="action-section">
    <div class="container">
      <div class="actions">
        <button class="btn btn-primary" @click="copyCurrent">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          复制当前风格
        </button>
        <button class="btn btn-secondary" @click="copyAll">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          复制全部
        </button>

        <div class="action-divider"></div>

        <button class="btn btn-wechat" @click="showWechatPanel = !showWechatPanel">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.69 11.34c-.48 0-.87-.39-.87-.87s.39-.87.87-.87.87.39.87.87-.39.87-.87.87m4.62 0c-.48 0-.87-.39-.87-.87s.39-.87.87-.87.87.39.87.87-.39.87-.87.87M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2"/>
          </svg>
          微信同步
        </button>
        <button class="btn btn-xhs" @click="showXhsPanel = !showXhsPanel">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          小红书导出
        </button>
      </div>

      <!-- WeChat Sync Panel -->
      <Transition name="slide">
        <WeChatSync
          v-if="showWechatPanel"
          :article="article"
          :currentStyle="currentStyle"
          :currentHtml="currentHtml"
          @toast="(msg, type) => $emit('toast', msg, type)"
          @close="showWechatPanel = false"
        />
      </Transition>

      <!-- Xiaohongshu Export Panel -->
      <Transition name="slide">
        <XhsExport
          v-if="showXhsPanel"
          :article="article"
          :currentHtml="currentHtml"
          :currentStyle="currentStyle"
          @toast="(msg, type) => $emit('toast', msg, type)"
          @close="showXhsPanel = false"
        />
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { ref, inject } from 'vue'
import WeChatSync from './WeChatSync.vue'
import XhsExport from './XhsExport.vue'

const props = defineProps({
  currentHtml: { type: String, default: '' },
  allHtml: { type: String, default: '' },
  article: { type: Object, required: true },
  currentStyle: { type: Object, default: null },
  styles: { type: Array, required: true },
})

const emit = defineEmits(['toast'])
const clipboard = inject('clipboard')

const showWechatPanel = ref(false)
const showXhsPanel = ref(false)

async function copyCurrent() {
  const ok = await clipboard.copyHtml(props.currentHtml, 'current')
  emit('toast', ok ? '已复制当前风格' : '复制失败', ok ? 'success' : 'error')
}

async function copyAll() {
  const ok = await clipboard.copyHtml(props.allHtml, 'all')
  emit('toast', ok ? '已复制全部43种风格' : '复制失败', ok ? 'success' : 'error')
}
</script>

<style scoped>
.action-section {
  padding: 1rem 0;
}

.actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  align-items: center;
}

.action-divider {
  width: 1px;
  height: 24px;
  background: var(--border);
  margin: 0 0.3rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.65rem 1.3rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: all var(--transition);
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent), #e8c86e);
  color: #000;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(201, 169, 98, 0.3);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}
.btn-secondary:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.btn-wechat {
  background: linear-gradient(135deg, #07c160, #06ad56);
  color: #fff;
}
.btn-wechat:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(7, 193, 96, 0.3);
}

.btn-xhs {
  background: linear-gradient(135deg, #ff2442, #e01f3d);
  color: #fff;
}
.btn-xhs:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(255, 36, 66, 0.3);
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .action-divider {
    display: none;
  }
  .actions {
    gap: 0.5rem;
  }
  .btn {
    padding: 0.55rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
