import { ref } from 'vue'

const aspectRatio = ref('auto')

export function useLayout() {
  return {
    aspectRatio,
  }
}
