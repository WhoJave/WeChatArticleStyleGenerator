import { ref, reactive } from 'vue'

export function useArticle() {
  const article = reactive({
    title: '秋日私语',
    subtitle: '秋风起，万物收',
    author: '林清玄',
    date: '2024.10.15',
    tag: '散文 · 秋日',
    type: 'article',
    body: '秋风起，白云飞，草木黄落，雁南归。秋天的风，带着一丝凉意，却也带来无尽的思绪。在这个收获的季节里，一切都变得安静而深邃。风穿过林间，叶子沙沙作响，仿佛在低语着季节的秘密。',
  })

  const typeOptions = [
    { value: 'article', label: '文章' },
    { value: 'poem', label: '诗词' },
    { value: 'quote', label: '语录' },
    { value: 'product', label: '产品' },
    { value: 'profile', label: '人物' },
  ]

  function getArticleData() {
    return {
      title: article.title || '标题',
      subtitle: article.subtitle || '',
      author: article.author || '作者',
      date: article.date || '2024.01.01',
      tag: article.tag || '标签',
      body: article.body || '内容',
      type: article.type || 'article',
    }
  }

  // Auto-detect paragraphs and format long text
  function formatBody(text) {
    if (!text) return ''
    // Split by double newlines for paragraphs
    return text
      .split(/\n{2,}/)
      .map(p => p.trim())
      .filter(Boolean)
      .join('</p><p style="margin-top:12px">')
  }

  return {
    article,
    typeOptions,
    getArticleData,
    formatBody,
  }
}
