import express from 'express'
import cors from 'cors'
import { getAccessToken, addDraft } from './wechat.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json({ limit: '5mb' }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/**
 * POST /api/wechat/draft
 * Body: { appId, appSecret, title, author, content, digest }
 */
app.post('/api/wechat/draft', async (req, res) => {
  try {
    const { appId, appSecret, title, author, content, digest } = req.body

    if (!appId || !appSecret) {
      return res.status(400).json({ success: false, error: '缺少 AppID 或 AppSecret' })
    }

    if (!content) {
      return res.status(400).json({ success: false, error: '缺少文章内容' })
    }

    // 1. Get access token
    const accessToken = await getAccessToken(appId, appSecret)

    // 2. Add draft (without thumb_media_id for now — it's optional for text-only drafts)
    const articles = [{
      title: title || '未命名',
      author: author || '',
      content: content,
      digest: digest || '',
      // thumb_media_id is required for news, but we'll make it optional
      // Users can upload cover image separately
      content_source_url: '',
      need_open_comment: 0,
      only_fans_can_comment: 0,
    }]

    const mediaId = await addDraft(accessToken, articles)

    res.json({ success: true, mediaId })
  } catch (err) {
    console.error('Draft sync error:', err.message)
    res.status(500).json({ success: false, error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 WeChat Article Server running on http://localhost:${PORT}`)
  console.log(`   Health: http://localhost:${PORT}/api/health`)
})
