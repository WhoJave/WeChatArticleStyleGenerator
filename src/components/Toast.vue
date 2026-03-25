<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" class="toast" :class="type">
        <span class="toast-icon">
          {{ type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ' }}
        </span>
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  message: { type: String, default: '' },
  visible: { type: Boolean, default: false },
  type: { type: String, default: 'success' },
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  font-weight: 500;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(8px);
}

.toast.success {
  background: rgba(76, 175, 80, 0.95);
  color: #fff;
}

.toast.error {
  background: rgba(231, 76, 60, 0.95);
  color: #fff;
}

.toast.info {
  background: rgba(33, 150, 243, 0.95);
  color: #fff;
}

.toast-icon {
  font-weight: 700;
  font-size: 0.9rem;
}

.toast-enter-active {
  animation: toastIn 0.3s ease-out;
}
.toast-leave-active {
  animation: toastOut 0.3s ease-in;
}
</style>
