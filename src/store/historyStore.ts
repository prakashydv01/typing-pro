import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TypingResult } from '../types/typing'

type HistoryState = {
  results: TypingResult[]
  addResult: (result: TypingResult) => void
  clear: () => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      results: [],
      addResult: (result) =>
        set((s) => ({ results: [result, ...s.results].slice(0, 500) })),
      clear: () => set({ results: [] }),
    }),
    { name: 'typingpro:history', version: 1 },
  ),
)

