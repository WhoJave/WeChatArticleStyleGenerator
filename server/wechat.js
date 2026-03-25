import axios from 'axios'

// In-memory token cache
let tokenCache = {
  token: null,
  expiresAt: 0,
}

/**
 * Get WeChat access_token (with caching)
 */
export async function getAccessToken(appId, appSecret) {
  const now = Date.now()
  if (tokenCache.token && tokenCache.expiresAt > now + 60000) {
    return tokenCache.token
  }

  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
  const resp = await axios.get(url)

  if (resp.data.errcode) {
    throw new Error(`WeChat token error: ${resp.data.errmsg} (${resp.data.errcode})`)
  }

  tokenCache = {
    token: resp.data.access_token,
    expiresAt: now + resp.data.expires_in * 1000,
  }

  return tokenCache.token
}

/**
 * Upload image to WeChat and get media URL for content
 * @param {string} accessToken
 * @param {Buffer} imageBuffer
 * @returns {string} Image URL that can be used in content
 */
export async function uploadContentImage(accessToken, imageBuffer) {
  const FormData = (await import('form-data')).default
  const form = new FormData()
  form.append('media', imageBuffer, {
    filename: 'cover.png',
    contentType: 'image/png',
  })

  const url = `https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=${accessToken}`
  const resp = await axios.post(url, form, {
    headers: form.getHeaders(),
  })

  if (resp.data.errcode) {
    throw new Error(`Upload image error: ${resp.data.errmsg}`)
  }

  return resp.data.url
}

/**
 * Upload permanent material to WeChat (for thumb_media_id)
 */
export async function uploadMaterial(accessToken, imageBuffer, type = 'image') {
  const FormData = (await import('form-data')).default
  const form = new FormData()
  form.append('media', imageBuffer, {
    filename: 'thumb.png',
    contentType: 'image/png',
  })

  const url = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${accessToken}&type=${type}`
  const resp = await axios.post(url, form, {
    headers: form.getHeaders(),
  })

  if (resp.data.errcode) {
    throw new Error(`Upload material error: ${resp.data.errmsg}`)
  }

  return resp.data.media_id
}

/**
 * Add a draft to WeChat
 */
export async function addDraft(accessToken, articles) {
  const url = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`
  const resp = await axios.post(url, { articles })

  if (resp.data.errcode) {
    throw new Error(`Draft add error: ${resp.data.errmsg} (${resp.data.errcode})`)
  }

  return resp.data.media_id
}
