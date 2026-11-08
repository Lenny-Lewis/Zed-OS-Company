'use client'

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from 'react'

/*
 * The quote basket: which product categories the visitor has added, and whether the quote drawer is
 * open. Kept for the browser tab (sessionStorage) so a refresh doesn't empty it.
 */

const STORAGE_KEY = 'zedos:quote'
const EMPTY = []
const QuoteContext = createContext(null)

// A tiny store over sessionStorage. The server (and hydration) see an empty quote; the browser then
// re-renders with what was saved, so the first render always matches the HTML.
let saved = null
const listeners = new Set()

function read() {
  if (saved === null) {
    try {
      const value = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]')
      saved = Array.isArray(value) ? value.filter((id) => typeof id === 'string') : EMPTY
    } catch {
      saved = EMPTY
    }
  }
  return saved
}

function write(next) {
  saved = next
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage blocked (private mode, settings): the quote still works for this visit.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function QuoteProvider({ children }) {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY)
  const [open, setOpen] = useState(false)

  const toggle = useCallback((id) => {
    const current = read()
    write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id])
  }, [])
  const remove = useCallback((id) => write(read().filter((x) => x !== id)), [])
  const clear = useCallback(() => write(EMPTY), [])

  const value = useMemo(
    () => ({ ids, has: (id) => ids.includes(id), toggle, remove, clear, open, setOpen }),
    [ids, toggle, remove, clear, open],
  )
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}

export function useQuote() {
  const value = useContext(QuoteContext)
  if (!value) throw new Error('useQuote must be used inside QuoteProvider')
  return value
}
