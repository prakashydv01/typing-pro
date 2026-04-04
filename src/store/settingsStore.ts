import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'system' | 'light' | 'dark'

export type LanguageCode = 'en' | 'ne'

export type SettingsState = {
  theme: ThemeMode
  soundsEnabled: boolean
  language: LanguageCode
  setTheme: (theme: ThemeMode) => void
  setSoundsEnabled: (enabled: boolean) => void
  setLanguage: (language: LanguageCode) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      soundsEnabled: true,
      language: 'en',
      setTheme: (theme) => set({ theme }),
      setSoundsEnabled: (soundsEnabled) => set({ soundsEnabled }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'typingpro:settings',
      version: 1,
    },
  ),
)

