import { ref, computed } from 'vue'
import { STYLES, STYLE_CATEGORIES } from '../styles/styleDefinitions.js'

export function useStyles() {
  const currentIndex = ref(0)
  const activeCategory = ref('all')

  const filteredStyles = computed(() => {
    if (activeCategory.value === 'all') return STYLES
    return STYLES.filter(s => s.category === activeCategory.value)
  })

  const currentStyle = computed(() => STYLES[currentIndex.value])

  function selectStyle(index) {
    currentIndex.value = index
  }

  function selectCategory(catId) {
    activeCategory.value = catId
  }

  function getGlobalIndex(filteredIdx) {
    const style = filteredStyles.value[filteredIdx]
    return STYLES.findIndex(s => s.id === style.id)
  }

  return {
    STYLES,
    STYLE_CATEGORIES,
    currentIndex,
    activeCategory,
    filteredStyles,
    currentStyle,
    selectStyle,
    selectCategory,
    getGlobalIndex,
  }
}
