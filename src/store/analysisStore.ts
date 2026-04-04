import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type KeyStats = {
  key: string
  presses: number
  mistakes: number
  avgMs: number
}

type AnalysisState = {
  keys: Record<string, KeyStats>
  recordKey: (key: string, ms: number, correct: boolean) => void
  reset: () => void
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      keys: {},
      recordKey: (key, ms, correct) =>
        set((s) => {
          const prev = s.keys[key] ?? { key, presses: 0, mistakes: 0, avgMs: 0 }
          const presses = prev.presses + 1
          const mistakes = prev.mistakes + (correct ? 0 : 1)
          const avgMs = prev.avgMs + (ms - prev.avgMs) / presses
          return { keys: { ...s.keys, [key]: { key, presses, mistakes, avgMs } } }
        }),
      reset: () => set({ keys: {} }),
    }),
    { name: 'typingpro:analysis', version: 1 },
  ),
)

