import { useState, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { api } from '../lib/api'
import {
  MOCK_ERROR_RESPONSE,
  MOCK_DOCS_RESPONSE,
  MOCK_SIMPLIFIER_RESPONSE,
  MOCK_UI_TO_CODE_RESPONSE,
} from '../data/mockData'

const MOCK_MAP = {
  explainError: MOCK_ERROR_RESPONSE,
  generateDocs: MOCK_DOCS_RESPONSE,
  simplifyCode: MOCK_SIMPLIFIER_RESPONSE,
  uiToCode: MOCK_UI_TO_CODE_RESPONSE,
}

const MOCK_DELAY = 1800

const RETRY_DELAY = 1500

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function useAI(feature) {
  const { addToast, demoMode } = useApp()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const run = useCallback(async (payload, provider = 'auto') => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      if (demoMode) {
        await sleep(MOCK_DELAY)
        const mock = MOCK_MAP[feature]
        setResult(mock)
        addToast('AI analysis complete (demo mode) ✓', 'success')
        return mock
      }

      const maxRetries = 3
      let attempt = 0
      let success = false
      let res = null
      let lastError = null

      while (attempt < maxRetries && !success) {
        try {
          const headers = provider && provider !== 'auto' ? { 'X-Preferred-Provider': provider } : {}
          res = await api[feature](payload, headers)
          success = true
        } catch (err) {
          lastError = err
          const isNetworkError = !err.response || err.code === 'ERR_NETWORK' || err.message === 'Network Error'

          if (isNetworkError) {
            attempt++
            if (attempt < maxRetries) {
              addToast(`Connection issue. Retrying... (Attempt ${attempt}/${maxRetries - 1})`, 'info')
              await sleep(RETRY_DELAY)
            }
          } else {
            // If it is a server response error (e.g. 400, 500, etc.), do not retry
            break
          }
        }
      }

      if (success && res) {
        setResult(res.data)
        addToast('AI analysis complete ✓', 'success')
        return res.data
      } else {
        const message = lastError?.response?.data?.detail || lastError?.message || 'Server is currently unreachable. Please try again later.'
        setError(message)
        addToast(`Error: ${message}`, 'error')
        return null
      }
    } finally {
      setLoading(false)
    }
  }, [feature, addToast, demoMode])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { run, loading, result, error, reset }
}
