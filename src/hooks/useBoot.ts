import { useEffect } from 'react'
import { useSettingsStore } from '../store/settingsStore'
import { registerServiceWorker } from '../utils/pwa'

function applyTheme(theme: 'system' | 'light' | 'dark') {
  const root = document.documentElement
  const systemDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = theme === 'dark' || (theme === 'system' && systemDark)
  root.classList.toggle('dark', dark)
}

export function useBoot() {
  const theme = useSettingsStore((s) => s.theme)

  useEffect(() => {
    applyTheme(theme)
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)')
    const handler = () => applyTheme(theme)
    mql?.addEventListener?.('change', handler)
    return () => mql?.removeEventListener?.('change', handler)
  }, [theme])

  useEffect(() => {
    registerServiceWorker()
  }, [])
}

