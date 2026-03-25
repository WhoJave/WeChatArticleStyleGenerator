<template>
  <header class="topbar">
    <div class="topbar-left">
      <h1 class="topbar-title">
        <span class="topbar-icon">✦</span>
        微信公众号排版器
        <span class="topbar-badge">43种风格</span>
      </h1>
    </div>
    <div class="topbar-right">
      <span class="topbar-tip">✓ 毛玻璃质感 · 渐变背景 · 复制即用 · 微信同步</span>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  background: rgba(18, 18, 26, 0.85);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.topbar-title {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f0f0f5 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.topbar-icon {
  font-size: 1.1rem;
  -webkit-text-fill-color: var(--accent);
  animation: pulse 2s infinite;
}

.topbar-badge {
  background: linear-gradient(135deg, var(--accent), #e8c86e);
  color: #000;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 20px;
  -webkit-text-fill-color: #000;
  letter-spacing: 0.5px;
}

.topbar-right {
  display: flex;
  align-items: center;
}

.topbar-tip {
  font-size: 0.78rem;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .topbar {
    padding: 0.8rem 1rem;
  }
  .topbar-tip {
    display: none;
  }
}
</style>
