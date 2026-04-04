import { useEffect, useMemo, useRef, useState } from 'react'
import { useSettingsStore } from '../../store/settingsStore'
import { EN_WORDS } from '../../data/englishWords'
import { NE_WORDS } from '../../data/nepaliWords'

type Dropping = { id: string; word: string; x: number; y: number; speed: number }

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}

export function WordDropGame() {
  const language = useSettingsStore((s) => s.language)
  const [running, setRunning] = useState(false)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [input, setInput] = useState('')
  const [items, setItems] = useState<Dropping[]>([])
  const boxRef = useRef<HTMLDivElement | null>(null)

  const wordPool = useMemo(() => (language === 'ne' ? NE_WORDS : EN_WORDS), [language])

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setItems((prev) => {
        const next = prev.map((it) => ({ ...it, y: it.y + it.speed }))
        const still: Dropping[] = []
        let lost = 0
        for (const it of next) {
          if (it.y > 260) lost++
          else still.push(it)
        }
        if (lost) setLives((l) => Math.max(0, l - lost))
        return still
      })
    }, 60)
    return () => window.clearInterval(id)
  }, [running])

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      const w = boxRef.current?.clientWidth ?? 600
      setItems((prev) => [
        ...prev,
        {
          id: uid(),
          word: pick(wordPool),
          x: Math.max(8, Math.floor(Math.random() * (w - 120))),
          y: -20,
          speed: 1 + Math.random() * 1,
        },
      ])
    }, 900)
    return () => window.clearInterval(id)
  }, [running, wordPool])

  useEffect(() => {
    if (lives === 0) setRunning(false)
  }, [lives])

  const onSubmit = () => {
    const typed = input.trim()
    if (!typed) return
    const hit = items.find((it) => it.word.toLowerCase() === typed.toLowerCase())
    if (hit) {
      setItems((prev) => prev.filter((it) => it.id !== hit.id))
      setScore((s) => s + 10)
    } else {
      setLives((l) => Math.max(0, l - 1))
    }
    setInput('')
  }

  const reset = () => {
    setRunning(false)
    setLives(3)
    setScore(0)
    setItems([])
    setInput('')
  }

  return (
    <div className="card p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-sm font-medium">Word Drop</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Type a falling word and press Enter.
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900/60">
            Score: <span className="font-semibold tabular-nums">{score}</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900/60">
            Lives: <span className="font-semibold tabular-nums">{lives}</span>
          </div>
          <button className="btn-ghost" onClick={reset}>
            Reset
          </button>
          <button className="btn-primary" onClick={() => setRunning((r) => !r)} disabled={lives === 0}>
            {running ? 'Pause' : lives === 0 ? 'Game over' : 'Start'}
          </button>
        </div>
      </div>

      <div
        ref={boxRef}
        className="relative h-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40"
      >
        {items.map((it) => (
          <div
            key={it.id}
            className="absolute rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow"
            style={{ left: it.x, top: it.y }}
          >
            {it.word}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className="input"
          placeholder="Type a word and press Enter…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit()
          }}
          disabled={!running}
        />
        <button className="btn-primary" onClick={onSubmit} disabled={!running}>
          Enter
        </button>
      </div>
    </div>
  )
}

