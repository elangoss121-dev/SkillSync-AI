import axios from 'axios'

// In production (Vercel) we use relative URLs so /api/* is served by
// the same domain's serverless functions — no cross-origin issues.
// In local dev, set VITE_API_URL=http://localhost:8000 in frontend/.env.local
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  // Relative URL: uses the current domain (works on Vercel automatically)
  return ''
}

const createClient = () => {
  return axios.create({
    baseURL: getBaseUrl(),
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
  explainError: (payload, headers = {}) =>
    createClient().post('/api/explain-error', toForm(payload), {
      headers: { 'Content-Type': 'multipart/form-data', ...headers },
    }),

  generateDocs: (payload, headers = {}) =>
    createClient().post('/api/generate-docs', toForm(payload), {
      headers: { 'Content-Type': 'multipart/form-data', ...headers },
    }),

  simplifyCode: (payload, headers = {}) =>
    createClient().post('/api/simplify-code', toForm(payload), {
      headers: { 'Content-Type': 'multipart/form-data', ...headers },
    }),

  uiToCode: (formData, headers = {}) =>
    createClient().post('/api/ui-to-code', formData, {
      headers: { 'Content-Type': 'multipart/form-data', ...headers },
    }),

  health: () => createClient().get('/api/health'),
}
