import axios from 'axios'

const getBaseUrl = () => {
  return localStorage.getItem('skillsync_backend_url') || 'http://localhost:8000'
}

const getApiKey = () => {
  return localStorage.getItem('skillsync_api_key') || ''
}

const createClient = () => {
  return axios.create({
    baseURL: getBaseUrl(),
    headers: {
      'X-API-Key': getApiKey(),
    },
    timeout: 60000,
  })
}

/** Build a FormData from a plain object (skip undefined values) */
function toForm(obj) {
  const fd = new FormData()
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      fd.append(key, value)
    }
  }
  return fd
}

export const api = {
  explainError: (payload) =>
    createClient().post('/api/explain-error', toForm(payload), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  generateDocs: (payload) =>
    createClient().post('/api/generate-docs', toForm(payload), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  simplifyCode: (payload) =>
    createClient().post('/api/simplify-code', toForm(payload), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  uiToCode: (formData) =>
    createClient().post('/api/ui-to-code', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  health: () => createClient().get('/api/health'),
}
