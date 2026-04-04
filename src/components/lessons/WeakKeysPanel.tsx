import { useMemo, useState } from 'react'
import { useAnalysisStore } from '../../store/analysisStore'
import { TypingTest } from '../typing/TypingTest'
import type { Difficulty, TestMode } from '../../types/typing'

export function WeakKeysPanel() {
  const keys = useAnalysisStore((s) => s.keys)
  const [practice, setPractice] = useState<{ enabled: boolean; text: string }>({
    enabled: false,
    text: '',
  })

  const suggestions = useMemo(() => {
    const list = Object.values(keys)
      .filter((k) => k.presses >= 10)
      .map((k) => ({
        key: k.key,
        mistakes: k.mistakes,
        presses: k.presses,
        rate: k.mistakes / k.presses,
        avgMs: k.avgMs,
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 8)
    return list
  }, [keys])

  const buildPracticeText = () => {
    const weak = suggestions.map((s) => (s.key === ' ' ? '_' : s.key)).join(' ')
    const lines = [
      `Weak keys: ${weak}`,
      '',
      ...suggestions.map((s) => `${s.key} `.repeat(25).trim()),
    ]
    return lines.join('\n')
  }

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-sm font-medium">Weak key practice</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Generated locally
        </div>
      </div>

      <div className="grid gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-950/40">
          {suggestions.length ? (
            <div className="grid gap-2">
              {suggestions.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="font-mono text-base">
                    {s.key === ' ' ? '␠' : s.key}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    {Math.round(s.rate * 100)}% mistakes · {Math.round(s.avgMs)}ms avg
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-600 dark:text-slate-300">
              No analysis yet. Take a few tests so we can identify weak keys.
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="btn-primary"
            onClick={() =>
              setPractice({ enabled: true, text: buildPracticeText() })
            }
            disabled={!suggestions.length}
          >
            Start weak-key lesson
          </button>
          <button
            className="btn-ghost"
            onClick={() => setPractice({ enabled: false, text: '' })}
          >
            Stop
          </button>
        </div>

        {practice.enabled ? (
          <TypingTest
            mode={'custom' as TestMode}
            difficulty={'easy' as Difficulty}
            seconds={60}
            customText={practice.text}
          />
        ) : null}
      </div>
    </div>
  )
}

