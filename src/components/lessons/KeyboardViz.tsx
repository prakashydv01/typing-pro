import { useMemo, useState } from 'react'

type KeyDef = { label: string; finger: 'L5' | 'L4' | 'L3' | 'L2' | 'R2' | 'R3' | 'R4' | 'R5' }

const rows: KeyDef[][] = [
  [
    { label: 'Q', finger: 'L5' },
    { label: 'W', finger: 'L4' },
    { label: 'E', finger: 'L3' },
    { label: 'R', finger: 'L2' },
    { label: 'T', finger: 'L2' },
    { label: 'Y', finger: 'R2' },
    { label: 'U', finger: 'R2' },
    { label: 'I', finger: 'R3' },
    { label: 'O', finger: 'R4' },
    { label: 'P', finger: 'R5' },
  ],
  [
    { label: 'A', finger: 'L5' },
    { label: 'S', finger: 'L4' },
    { label: 'D', finger: 'L3' },
    { label: 'F', finger: 'L2' },
    { label: 'G', finger: 'L2' },
    { label: 'H', finger: 'R2' },
    { label: 'J', finger: 'R2' },
    { label: 'K', finger: 'R3' },
    { label: 'L', finger: 'R4' },
  ],
  [
    { label: 'Z', finger: 'L5' },
    { label: 'X', finger: 'L4' },
    { label: 'C', finger: 'L3' },
    { label: 'V', finger: 'L2' },
    { label: 'B', finger: 'L2' },
    { label: 'N', finger: 'R2' },
    { label: 'M', finger: 'R3' },
  ],
]

const fingerColor: Record<KeyDef['finger'], string> = {
  L5: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
  L4: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
  L3: 'bg-amber-500/15 border-amber-500/30 text-amber-200',
  L2: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200',
  R2: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200',
  R3: 'bg-amber-500/15 border-amber-500/30 text-amber-200',
  R4: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
  R5: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
}

export function KeyboardViz() {
  const [highlight, setHighlight] = useState<string>('F')

  const allKeys = useMemo(() => rows.flat().map((k) => k.label), [])

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-sm font-medium">Keyboard visualization</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Finger guide (QWERTY)
        </div>
      </div>

      <div className="grid gap-2">
        {rows.map((r, idx) => (
          <div key={idx} className="flex flex-wrap gap-2">
            {r.map((k) => {
              const isHot = k.label === highlight.toUpperCase()
              return (
                <button
                  key={k.label}
                  type="button"
                  onClick={() => setHighlight(k.label)}
                  className={[
                    'rounded-xl border px-3 py-2 text-sm font-semibold transition',
                    'dark:text-white',
                    fingerColor[k.finger],
                    isHot ? 'ring-2 ring-indigo-400/70' : '',
                  ].join(' ')}
                >
                  {k.label}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Select a key to see its finger zone. Home row tips: keep index fingers on
        <span className="font-semibold"> F </span>and
        <span className="font-semibold"> J</span>.
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Quick highlight
        </div>
        <select
          className="input w-28"
          value={highlight.toUpperCase()}
          onChange={(e) => setHighlight(e.target.value)}
        >
          {allKeys.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

