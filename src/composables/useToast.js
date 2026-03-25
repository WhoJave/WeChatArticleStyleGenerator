import { ref } from 'vue'

export function useToast() {
  const message = ref('')
  const visible = ref(false)
  const type = ref('success') // 'success' | 'error' | 'info'
  let timer = null

  function show(msg, toastType = 'success', duration = 2500) {
    if (timer) clearTimeout(timer)
    message.value = msg
    type.value = toastType
    visible.value = true
    timer = setTimeout(() => {
      visible.value = false
    }, duration)
  }

  return { message, visible, type, show }
}
