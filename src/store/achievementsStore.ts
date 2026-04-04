import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TypingResult } from '../types/typing'

export type AchievementId =
  | 'first_test'
  | 'wpm_50'
  | 'wpm_80'
  | 'wpm_100'
  | 'accuracy_95'
  | 'accuracy_99'

const achievementMeta: Record<
  AchievementId,
  { title: string; description: string }
> = {
  first_test: {
    title: 'First Steps',
    description: 'Complete your first typing test.',
  },
  wpm_50: { title: 'Quick Start', description: 'Reach 50 WPM.' },
  wpm_80: { title: 'Fast Hands', description: 'Reach 80 WPM.' },
  wpm_100: { title: 'Pro Typist', description: 'Reach 100 WPM.' },
  accuracy_95: { title: 'Steady', description: 'Reach 95% accuracy.' },
  accuracy_99: { title: 'Laser Focus', description: 'Reach 99% accuracy.' },
}

type AchievementsState = {
  unlocked: AchievementId[]
  unlock: (id: AchievementId) => void
  evaluate: (result: TypingResult) => AchievementId[]
  meta: typeof achievementMeta
}

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      unlocked: [],
      meta: achievementMeta,
      unlock: (id) =>
        set((s) =>
          s.unlocked.includes(id) ? s : { unlocked: [...s.unlocked, id] },
        ),
      evaluate: (result) => {
        const newly: AchievementId[] = []
        const have = new Set(get().unlocked)
        const maybe = (id: AchievementId, ok: boolean) => {
          if (ok && !have.has(id)) newly.push(id)
        }
        maybe('first_test', true)
        maybe('wpm_50', result.wpm >= 50)
        maybe('wpm_80', result.wpm >= 80)
        maybe('wpm_100', result.wpm >= 100)
        maybe('accuracy_95', result.accuracy >= 95)
        maybe('accuracy_99', result.accuracy >= 99)
        newly.forEach((id) => get().unlock(id))
        return newly
      },
    }),
    { name: 'typingpro:achievements', version: 1 },
  ),
)

