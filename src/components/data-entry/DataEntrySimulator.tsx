import { useEffect, useMemo, useState } from 'react'
import type { Difficulty } from '../../types/typing'

type Row = { id: string; name: string; email: string; amount: string }

const sampleEasy: Row[] = [
  { id: 'A-1', name: 'Raj', email: 'raj@mail.com', amount: '25' },
  { id: 'A-2', name: 'Sita', email: 'sita@mail.com', amount: '40' },
  { id: 'A-3', name: 'Hari', email: 'hari@mail.com', amount: '12' },
]

const sampleMedium: Row[] = [
  { id: 'INV-1001', name: 'Asha Sharma', email: 'asha@example.com', amount: '125.50' },
  { id: 'INV-1002', name: 'Bina Thapa', email: 'bina@example.com', amount: '40.00' },
  { id: 'INV-1003', name: 'Ramesh Karki', email: 'ramesh@example.com', amount: '310.75' },
]

const sampleHard: Row[] = [
  {
    id: 'PO-INV-2024-881902',
    name: 'Christopher Montgomery',
    email: 'c.montgomery@enterprise-solutions.co.uk',
    amount: '12,450.99',
  },
  {
    id: 'SO-RET-00912-XJ',
    name: 'Dr. Priya Natarajan-Koirala',
    email: 'priya.n.koirala@regional-health.org.np',
    amount: '8,001.25',
  },
  {
    id: 'B2B-CR-77331',
    name: 'International Trading GmbH',
    email: 'accounts.payable@intl-trading-gmbh.de',
    amount: '156,789.00',
  },
]

function rowsForDifficulty(d: Difficulty): Row[] {
  if (d === 'easy') return sampleEasy
  if (d === 'hard') return sampleHard
  return sampleMedium
}

function scoreAccuracy(expected: string, actual: string) {
  const max = Math.max(expected.length, actual.length)
  if (max === 0) return 100
  let same = 0
  for (let i = 0; i < max; i++) if ((expected[i] ?? '') === (actual[i] ?? '')) same++
  return Math.round((same / max) * 1000) / 10
}

type Props = { difficulty: Difficulty }

export function DataEntrySimulator({ difficulty }: Props) {
  const sample = useMemo(() => rowsForDifficulty(difficulty), [difficulty])
  const [idx, setIdx] = useState(0)
  const [values, setValues] = useState({ id: '', name: '', email: '', amount: '' })
  const [submitted, setSubmitted] = useState<null | { accuracy: number; correctFields: number }>(null)

  useEffect(() => {
    setIdx(0)
    setValues({ id: '', name: '', email: '', amount: '' })
    setSubmitted(null)
  }, [difficulty])

  const row = sample[idx % sample.length]

  const expected = useMemo(
    () => ({ id: row.id, name: row.name, email: row.email, amount: row.amount }),
    [row.amount, row.email, row.id, row.name],
  )

  const submit = () => {
    const accs = [
      scoreAccuracy(expected.id, values.id),
      scoreAccuracy(expected.name, values.name),
      scoreAccuracy(expected.email, values.email),
      scoreAccuracy(expected.amount, values.amount),
    ]
    const accuracy = Math.round((accs.reduce((a, b) => a + b, 0) / accs.length) * 10) / 10
    const correctFields =
      Number(values.id === expected.id) +
      Number(values.name === expected.name) +
      Number(values.email === expected.email) +
      Number(values.amount === expected.amount)
    setSubmitted({ accuracy, correctFields })
  }

  const next = () => {
    setIdx((i) => (i + 1) % sample.length)
    setValues({ id: '', name: '', email: '', amount: '' })
    setSubmitted(null)
  }

  const inputClass =
    difficulty === 'hard'
      ? 'input font-mono text-sm'
      : difficulty === 'easy'
        ? 'input font-mono text-base'
        : 'input font-mono'

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <div className="text-sm font-medium">Target record</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Row {idx + 1} / {sample.length}
          </div>
        </div>
        <div className="grid gap-2 text-sm">
          <div
            className={
              difficulty === 'hard'
                ? 'rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed dark:border-slate-800 dark:bg-slate-950/40'
                : 'rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono dark:border-slate-800 dark:bg-slate-950/40'
            }
          >
            <div>ID: {row.id}</div>
            <div>Name: {row.name}</div>
            <div>Email: {row.email}</div>
            <div>Amount: {row.amount}</div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {difficulty === 'easy'
              ? 'Short fields — focus on clean, accurate entry.'
              : difficulty === 'hard'
                ? 'Longer identifiers and formatting — match punctuation and spacing exactly.'
                : 'Type exactly. This simulates copy-accurate data entry work.'}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <div className="text-sm font-medium">Your input</div>
          {submitted ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Accuracy: <span className="font-semibold">{submitted.accuracy}%</span> · Correct fields:{' '}
              <span className="font-semibold">{submitted.correctFields}/4</span>
            </div>
          ) : null}
        </div>

        <div className="grid gap-3">
          {(['id', 'name', 'email', 'amount'] as const).map((k) => (
            <div key={k}>
              <div className="text-xs text-slate-500 dark:text-slate-400">{k.toUpperCase()}</div>
              <input
                className={inputClass}
                value={values[k]}
                onChange={(e) => setValues((v) => ({ ...v, [k]: e.target.value }))}
                placeholder={expected[k]}
                spellCheck={false}
              />
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={submit}>
              Submit
            </button>
            <button className="btn-ghost" onClick={next}>
              Next row
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
