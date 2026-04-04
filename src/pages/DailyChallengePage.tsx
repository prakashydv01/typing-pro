import { useMemo, useState } from 'react'
import type { Difficulty } from '../types/typing'
import { TypingTest } from '../components/typing/TypingTest'
import { loadJson, saveJson } from '../utils/storage'

type DailyState = {
  date: string
  completed: boolean
  seconds: number
  difficulty: Difficulty
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function DailyChallengePage() {
  const today = todayKey()
  const [state, setState] = useState<DailyState>(() => {
    const fallback: DailyState = {
      date: today,
      completed: false,
      seconds: 60,
      difficulty: 'medium',
    }
    const stored = loadJson<DailyState>('typingpro:daily', fallback)
    return stored.date === today ? stored : fallback
  })

  const seedText = useMemo(() => {
    // deterministic "random" based on date
    const s = today.replaceAll('-', '')
    const n = Number(s.slice(-4))
    const words = ['focus', 'flow', 'accuracy', 'tempo', 'rhythm', 'clarity', 'speed', 'practice']
    const pick = (i: number) => words[(n + i * 7) % words.length]
    return Array.from({ length: 80 }, (_, i) => pick(i)).join(' ')
  }, [today])

  const markCompleted = () => {
    const next = { ...state, completed: true }
    setState(next)
    saveJson('typingpro:daily', next)
  }

  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">Daily Challenge</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {today} · {state.seconds}s · {state.difficulty}{' '}
              {state.completed ? '· Completed' : ''}
            </div>
          </div>
          <button className="btn-primary" onClick={markCompleted}>
            Mark complete
          </button>
        </div>
      </div>

      <TypingTest
        mode="custom"
        difficulty={state.difficulty}
        seconds={state.seconds}
        customText={seedText}
      />
    </div>
  )
}

