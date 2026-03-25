<template>
  <section class="style-section">
    <div class="container">
      <!-- Category filter -->
      <div class="category-bar">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="cat-btn"
          :class="{ active: activeCategory === cat.id }"
          @click="$emit('select-category', cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Style tabs -->
      <div class="style-tabs">
        <button
          v-for="(style, idx) in filteredStyles"
          :key="style.id"
          class="style-tab"
          :class="{ active: getGlobalIndex(idx) === currentIndex }"
          @click="$emit('select-style', getGlobalIndex(idx))"
        >
          {{ style.name }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  categories: { type: Array, required: true },
  activeCategory: { type: String, required: true },
  filteredStyles: { type: Array, required: true },
  currentIndex: { type: Number, required: true },
  styles: { type: Array, required: true },
})

defineEmits(['select-category', 'select-style'])

function getGlobalIndex(filteredIdx) {
  const style = props.filteredStyles[filteredIdx]
  return props.styles.findIndex(s => s.id === style.id)
}
</script>

<style scoped>
.style-section {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 1rem 0 1.2rem;
}

.category-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
}

.cat-btn {
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  font-size: 0.78rem;
  cursor: pointer;
  background: transparent;
  color: var(--text-secondary);
  font-family: inherit;
  transition: all var(--transition);
  font-weight: 500;
}

.cat-btn:hover {
  border-color: var(--accent);
  color: var(--text-primary);
}

.cat-btn.active {
  background: var(--accent);
  color: #000;
  border-color: var(--accent);
  font-weight: 600;
}

.style-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.style-tab {
  padding: 0.35rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: 20px;
  font-size: 0.75rem;
  cursor: pointer;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-family: inherit;
  transition: all 0.15s ease;
  font-weight: 400;
}

.style-tab:hover {
  border-color: var(--accent);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.style-tab.active {
  background: linear-gradient(135deg, var(--accent), #e8c86e);
  color: #000;
  border-color: var(--accent);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(201, 169, 98, 0.3);
}
</style>
