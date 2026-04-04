import { useEffect, useMemo, useRef, useState } from 'react'
import { useSettingsStore } from '../../store/settingsStore'
import { useHistoryStore } from '../../store/historyStore'
import { useAnalysisStore } from '../../store/analysisStore'
import { useAchievementsStore } from '../../store/achievementsStore'
import type { Difficulty, TestMode, TypingResult } from '../../types/typing'
import { generateText, hashText } from '../../utils/textGen'
import { uid } from '../../utils/id'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  mode: TestMode
  difficulty: Difficulty
  seconds: number
  customText?: string
  /** Countdown timer; when false, session ends when the target is fully typed. */
  timed?: boolean
  /** Larger text and wider typing column. */
  layout?: 'default' | 'test'
}

type Status = 'idle' | 'running' | 'finished'

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

function computeStats(params: {
  startedAtMs: number | null
  nowMs: number
  typed: string
  target: string
}) {
  const { startedAtMs, nowMs, typed, target } = params
  const elapsedMs = startedAtMs == null ? 0 : Math.max(0, nowMs - startedAtMs)
  const elapsedMin = elapsedMs / 60000

  let correct = 0
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) correct++
  }
  const incorrect = typed.length - correct
  const accuracy = typed.length === 0 ? 100 : clamp01(correct / typed.length) * 100
  const wpm = elapsedMin > 0 ? (correct / 5) / elapsedMin : 0
  const cpm = elapsedMin > 0 ? correct / elapsedMin : 0

  return { elapsedMs, correct, incorrect, accuracy, wpm, cpm }
}

export function TypingTest({
  mode,
  difficulty,
  seconds,
  customText,
  timed = true,
  layout = 'test',
}: Props) {
  const language = useSettingsStore((s) => s.language)
  const soundsEnabled = useSettingsStore((s) => s.soundsEnabled)
  const results = useHistoryStore((s) => s.results)
  const addResult = useHistoryStore((s) => s.addResult)
  const recordKey = useAnalysisStore((s) => s.recordKey)
  const evaluateAchievements = useAchievementsStore((s) => s.evaluate)

  const [target, setTarget] = useState(() =>
    generateText({ mode, difficulty, language, customText }),
  )
  const [typed, setTyped] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null)
  const [nowMs, setNowMs] = useState<number>(() => performance.now())
  const [lastKeyAt, setLastKeyAt] = useState<number | null>(null)
  const [lastKeyVisual, setLastKeyVisual] = useState<{
    key: string
    id: string
  } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const targetHash = useMemo(() => hashText(target), [target])

  const tick = useMemo(
    () => ({
      ok: () => {},
      err: () => {},
      click: () => {},
    }),
    [],
  )

  useEffect(() => {
    // tiny oscillator sounds; create lazily after user gesture
    const AudioContextImpl =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: AudioContext }).webkitAudioContext
    if (!AudioContextImpl) return
    const ctx = new AudioContextImpl()
    const play = (freq: number, durMs: number, gain: number) => {
      if (!soundsEnabled) return
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'square'
      o.frequency.value = freq
      g.gain.value = gain
      o.connect(g)
      g.connect(ctx.destination)
      o.start()
      setTimeout(() => o.stop(), durMs)
    }
    tick.ok = () => play(880, 18, 0.02)
    tick.err = () => play(220, 40, 0.04)
    tick.click = () => play(740, 14, 0.018)
  }, [soundsEnabled, tick])

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(performance.now()), 100)
    return () => window.clearInterval(id)
  }, [])

  const stats = useMemo(
    () => computeStats({ startedAtMs, nowMs, typed, target }),
    [startedAtMs, nowMs, typed, target],
  )

  const remainingSec = useMemo(() => {
    if (startedAtMs == null) return seconds
    const elapsedSec = Math.floor(stats.elapsedMs / 1000)
    return Math.max(0, seconds - elapsedSec)
  }, [seconds, startedAtMs, stats.elapsedMs])

  useEffect(() => {
    if (status !== 'running') return
    if (timed) {
      if (remainingSec === 0) setStatus('finished')
    } else if (typed.length >= target.length && target.length > 0) {
      setStatus('finished')
    }
  }, [remainingSec, status, timed, typed.length, target.length])

  useEffect(() => {
    if (status !== 'finished') return
    const finishedAt = Date.now()
    const startedAt = finishedAt - (timed ? Math.min(seconds * 1000, stats.elapsedMs) : stats.elapsedMs)
    const durationSec = timed
      ? seconds
      : Math.max(1, Math.round(stats.elapsedMs / 1000))
    const result: TypingResult = {
      id: uid(),
      startedAt,
      finishedAt,
      mode,
      difficulty,
      language,
      durationSec,
      typedChars: typed.length,
      correctChars: stats.correct,
      incorrectChars: stats.incorrect,
      wpm: Math.round(stats.wpm),
      cpm: Math.round(stats.cpm),
      accuracy: Math.round(stats.accuracy * 10) / 10,
      slowKeys: [],
      weakKeys: [],
      textHash: targetHash,
    }
    addResult(result)
    evaluateAchievements(result)
  }, [
    addResult,
    difficulty,
    evaluateAchievements,
    language,
    mode,
    seconds,
    stats.accuracy,
    stats.correct,
    stats.cpm,
    stats.elapsedMs,
    stats.incorrect,
    stats.wpm,
    status,
    targetHash,
    timed,
    typed.length,
  ])

  const caretIndex = typed.length

  const ghostBest = useMemo(() => {
    const relevant = results.filter((r) => {
      if (r.mode !== mode || r.difficulty !== difficulty || r.language !== language) return false
      if (timed) return r.durationSec === seconds
      return true
    })
    if (!relevant.length) return null
    return relevant.reduce((best, r) => (r.wpm > best.wpm ? r : best), relevant[0])
  }, [difficulty, language, mode, results, seconds, timed])

  const rendered = useMemo(() => {
    const chars = Array.from(target) as string[]
    return chars.map((ch, i) => {
      const t = typed[i]
      const isTyped = i < typed.length
      const correct = isTyped && t === ch
      const wrong = isTyped && t !== ch
      const isCaret = i === caretIndex && status !== 'finished'
      const isNewline = ch === '\n'

      const base =
        layout === 'test'
          ? 'relative whitespace-pre-wrap break-words font-mono text-xl leading-9 xl:text-2xl xl:leading-10'
          : 'relative whitespace-pre-wrap break-words font-mono text-[15px] leading-7'

      let cls = base + ' text-slate-500 dark:text-slate-300'
      if (correct) cls = base + ' text-slate-900 dark:text-white'
      if (wrong) cls = base + ' text-rose-600 dark:text-rose-400'

      return (
        <span
          key={i}
          className={[
            cls,
            isCaret ? 'after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-indigo-500' : '',
            wrong ? 'bg-rose-500/10 dark:bg-rose-500/10' : '',
            isNewline ? 'block' : '',
          ].join(' ')}
        >
          {ch}
        </span>
      )
    })
  }, [caretIndex, layout, status, target, typed])

  const reset = () => {
    setTarget(generateText({ mode, difficulty, language, customText }))
    setTyped('')
    setStatus('idle')
    setStartedAtMs(null)
    setLastKeyAt(null)
    textareaRef.current?.focus()
  }

  const onChange = (val: string) => {
    // prevent typing beyond target in code mode with newlines; keep it simple
    if (status === 'finished') return
    const next = val.slice(0, target.length)

    if (status === 'idle' && next.length > 0) {
      setStatus('running')
      setStartedAtMs(performance.now())
      setLastKeyAt(performance.now())
    }

    // analysis per key (expected char)
    const prevLen = typed.length
    if (next.length > prevLen) {
      const now = performance.now()
      const ms = lastKeyAt == null ? 0 : Math.max(0, now - lastKeyAt)
      const idx = prevLen
      const expected = target[idx] ?? ''
      const actual = next[idx] ?? ''
      const correct = expected === actual
      if (expected) recordKey(expected, ms, correct)
      setLastKeyAt(now)
      if (soundsEnabled) (correct ? tick.ok : tick.err)()
    }

    setTyped(next)
  }

  return (
    <div className="grid gap-4">
      <div
        className={
          layout === 'test'
            ? 'grid gap-3 xl:grid-cols-5'
            : 'grid gap-3 lg:grid-cols-4'
        }
      >
        <div
          className={
            layout === 'test' ? 'card p-4 xl:col-span-4' : 'card p-4 lg:col-span-3'
          }
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                {status === 'running'
                  ? 'Typing…'
                  : status === 'finished'
                    ? 'Finished'
                    : 'Ready'}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Mode: <span className="font-medium">{mode}</span> · Difficulty:{' '}
                <span className="font-medium">{difficulty}</span> · Language:{' '}
                <span className="font-medium">{language === 'en' ? 'English' : 'Nepali'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-ghost" onClick={reset}>
                New
              </button>
              <button
                className="btn-primary"
                onClick={() => textareaRef.current?.focus()}
              >
                Focus
              </button>
            </div>
          </div>

          <div
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40"
            onMouseDown={(e) => {
              e.preventDefault()
              textareaRef.current?.focus()
            }}
          >
            <div className="select-none">{rendered}</div>
          </div>

          <textarea
            ref={textareaRef}
            className="sr-only"
            value={typed}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (status === 'finished') return
              if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter' || e.key === ' ') {
                const keyLabel =
                  e.key === ' ' ? 'Space' : e.key === 'Enter' ? 'Enter' : e.key === 'Backspace' ? 'Backspace' : e.key
                setLastKeyVisual({ key: keyLabel, id: uid() })
                tick.click()
              }
            }}
            autoFocus
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>

        <div className="card p-4">
          <div className="grid gap-3">
            {timed ? (
              <div className="flex items-baseline justify-between">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Time left
                </div>
                <div className="text-2xl font-semibold tabular-nums">
                  {remainingSec}s
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  WPM
                </div>
                <div className="text-xl font-semibold tabular-nums">
                  {Math.round(stats.wpm)}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  CPM
                </div>
                <div className="text-xl font-semibold tabular-nums">
                  {Math.round(stats.cpm)}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Accuracy
                </div>
                <div className="text-xl font-semibold tabular-nums">
                  {Math.round(stats.accuracy * 10) / 10}%
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Mistakes
                </div>
                <div className="text-xl font-semibold tabular-nums">
                  {stats.incorrect}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              {timed ? (
                <>
                  Tip: click the text area to focus, then type. The timer starts on your first
                  keypress.
                </>
              ) : (
                <>
                  Tip: click the text area to focus. Practice ends when you finish the whole passage.
                </>
              )}
            </div>

            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
              Ghost mode: {ghostBest ? (
                <span>
                  best <span className="font-semibold tabular-nums">{ghostBest.wpm}</span> WPM ·{' '}
                  <span className="font-semibold tabular-nums">{ghostBest.accuracy}</span>% accuracy
                </span>
              ) : (
                <span>no previous score for this setup yet.</span>
              )}
            </div>

            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Key press
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Visual click feedback
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <AnimatePresence mode="popLayout">
                  {lastKeyVisual ? (
                    <motion.div
                      key={lastKeyVisual.id}
                      initial={{ opacity: 0, scale: 0.8, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="inline-flex items-center rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow"
                    >
                      {lastKeyVisual.key}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-slate-600 dark:text-slate-300"
                    >
                      Start typing…
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

