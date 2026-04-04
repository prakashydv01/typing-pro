import { useState } from 'react'
import type { Difficulty } from '../types/typing'
import { DataEntrySimulator } from '../components/data-entry/DataEntrySimulator'

export function DataEntryPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')

  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">Data Entry Mode</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Simulate real form and table entry. The timer and scoring focus on accuracy under
              realistic constraints.
            </div>
          </div>
          <div className="grid gap-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">Level</div>
            <select
              className="input w-44"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      <DataEntrySimulator difficulty={difficulty} />
    </div>
  )
}
