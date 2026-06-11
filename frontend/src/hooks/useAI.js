import { useState, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { api } from '../lib/api'

const RETRY_DELAY = 1500

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function useAI(feature) {
  const { addToast } = useApp()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const run = useCallback(async (payload, provider = 'auto') => {
    setLoading(true)
    setError(null)
    setResult(null)

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
  }, [feature, addToast])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { run, loading, result, error, reset }
}
