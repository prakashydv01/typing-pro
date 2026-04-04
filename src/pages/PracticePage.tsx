import { useState } from 'react'
import type { Difficulty, TestMode } from '../types/typing'
import { TypingTest } from '../components/typing/TypingTest'

export function PracticePage() {
  const [mode, setMode] = useState<TestMode>('sentences')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')

  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="grid gap-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Practice mode
            </div>
            <select
              className="input w-44"
              value={mode}
              onChange={(e) => setMode(e.target.value as TestMode)}
            >
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
              <option value="paragraphs">Paragraphs</option>
              <option value="numbers">Numbers</option>
              <option value="symbols">Symbols</option>
              <option value="code">Code</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="grid gap-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Difficulty
            </div>
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

      <TypingTest mode={mode} difficulty={difficulty} seconds={0} timed={false} />
    </div>
  )
}

