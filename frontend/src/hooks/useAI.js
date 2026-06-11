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

const MOCK_DELAY = 2200 // realistic loading time

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function useAI(feature) {
  const { demoMode, addToast } = useApp()
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
        addToast('AI analysis complete (demo mode)', 'success')
        return mock
      }

      const headers = provider && provider !== 'auto' ? { 'X-Preferred-Provider': provider } : {}
      const res = await api[feature](payload, headers)
      // res.data is the full API response body: { success, confidence, data, model, demo_mode }
      setResult(res.data)
      addToast('AI analysis complete ✓', 'success')
      return res.data
    } catch (err) {
      const message = err?.response?.data?.detail || err.message || 'Something went wrong'
      setError(message)
      addToast(`Error: ${message}`, 'error')
      return null
    } finally {
      setLoading(false)
    }
  }, [demoMode, feature, addToast])


  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { run, loading, result, error, reset }
}
