/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'

export default function AITypingEffect({ text = '', speed = 18, className = '', onDone }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  // Keep onDone stable in a ref so it doesn't need to be an effect dependency
  const onDoneRef = useRef(onDone)
  useEffect(() => { onDoneRef.current = onDone }, [onDone])

  useEffect(() => {
    // Reset animation when text/speed changes — setState in effect is intentional here.
    setDisplayed('')
    setDone(false)
    if (!text) return

    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
        onDoneRef.current?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span className={className}>
      {displayed}
      {!done && (
        <span className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  )
}
