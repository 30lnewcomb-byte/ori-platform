'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { OriPreferences } from '../lib/theme-settings'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

type OriThemeContextValue = {
  preferences: OriPreferences
  updatePreferences: (patch: Partial<OriPreferences>) => void
  saveState: SaveState
}

const OriThemeContext = createContext<OriThemeContextValue | null>(null)

export function OriThemeProvider({
  initialPreferences,
  children,
}: {
  initialPreferences: OriPreferences
  children: ReactNode
}) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const preferencesRef = useRef(initialPreferences)
  const saveQueue = useRef<Promise<void>>(Promise.resolve())
  const saveVersion = useRef(0)

  useEffect(() => {
    document.documentElement.dataset.oriAppearance = preferences.appearance
    document.documentElement.dataset.oriAccent = preferences.accent
  }, [preferences])

  const updatePreferences = useCallback((patch: Partial<OriPreferences>) => {
    const next = { ...preferencesRef.current, ...patch }
    if (
      next.appearance === preferencesRef.current.appearance &&
      next.accent === preferencesRef.current.accent
    ) return

    preferencesRef.current = next
    setPreferences(next)
    setSaveState('saving')
    const version = ++saveVersion.current

    // Serialize writes so rapid selections cannot save an older choice last.
    saveQueue.current = saveQueue.current
      .catch(() => undefined)
      .then(async () => {
        const response = await fetch('/api/preferences', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(next),
          cache: 'no-store',
        })
        if (!response.ok) throw new Error('Preference save failed.')
        if (version === saveVersion.current) setSaveState('saved')
      })
      .catch(() => {
        if (version === saveVersion.current) setSaveState('error')
      })
  }, [])

  return (
    <OriThemeContext.Provider value={{ preferences, updatePreferences, saveState }}>
      {children}
    </OriThemeContext.Provider>
  )
}

export function useOriTheme() {
  const context = useContext(OriThemeContext)
  if (!context) throw new Error('useOriTheme must be used inside OriThemeProvider.')
  return context
}
