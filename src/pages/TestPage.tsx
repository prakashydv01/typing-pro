import { useMemo, useState } from 'react'
import type { Difficulty, TestMode } from '../types/typing'
import { TypingTest } from '../components/typing/TypingTest'

const timerPresets = [15, 30, 60]
const CUSTOM_TIMER = 999

export function TestPage() {
  const [mode, setMode] = useState<TestMode>('words')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [seconds, setSeconds] = useState<number>(60)
  const [customMinutes, setCustomMinutes] = useState<string>('2')
  const [customText, setCustomText] = useState<string>('')

  const actualSeconds = useMemo(() => {
    if (timerPresets.includes(seconds)) return seconds
    const m = Number(customMinutes)
    if (Number.isFinite(m) && m >= 1 && m <= 10) return Math.round(m * 60)
    return 60
  }, [customMinutes, seconds])

  const isCustomTimer = seconds === CUSTOM_TIMER

  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="grid gap-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Mode
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

          <div className="grid gap-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Timer (countdown shown in seconds)
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {timerPresets.map((p) => (
                <button
                  key={p}
                  className={p === seconds ? 'btn-primary' : 'btn-ghost'}
                  onClick={() => setSeconds(p)}
                  type="button"
                >
                  {p}s
                </button>
              ))}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className={isCustomTimer ? 'btn-primary' : 'btn-ghost'}
                  onClick={() => setSeconds(CUSTOM_TIMER)}
                  type="button"
                >
                  Custom
                </button>
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Minutes (1–10)</span>
                  <input
                    className="input w-16"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    inputMode="decimal"
                    min={1}
                    max={10}
                    disabled={!isCustomTimer}
                    type="number"
                  />
                </label>
                {isCustomTimer ? (
                  <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    → {actualSeconds}s total
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {mode === 'custom' ? (
            <div className="min-w-[240px] flex-1">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Custom text
              </div>
              <input
                className="input"
                placeholder="Paste your own text here…"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
              />
            </div>
          ) : null}
        </div>
      </div>

      <TypingTest
        mode={mode}
        difficulty={difficulty}
        seconds={actualSeconds}
        customText={customText}
        layout="test"
      />
    </div>
  )
}
