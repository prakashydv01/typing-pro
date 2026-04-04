import { useMemo } from 'react'
import { useHistoryStore } from '../../store/historyStore'

export function HistoryTable() {
  const results = useHistoryStore((s) => s.results)

  const rows = useMemo(() => results.slice(0, 20), [results])

  return (
    <div className="card overflow-hidden">
      <div className="flex items-baseline justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="text-sm font-medium">Recent results</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing 20
        </div>
      </div>
      <div className="overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-950/40 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Mode</th>
              <th className="px-4 py-2">Diff</th>
              <th className="px-4 py-2">WPM</th>
              <th className="px-4 py-2">Acc</th>
              <th className="px-4 py-2">Mistakes</th>
              <th className="px-4 py-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-t border-slate-200 dark:border-slate-800"
              >
                <td className="px-4 py-2">
                  {new Date(r.finishedAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">{r.mode}</td>
                <td className="px-4 py-2">{r.difficulty}</td>
                <td className="px-4 py-2 font-semibold tabular-nums">{r.wpm}</td>
                <td className="px-4 py-2 tabular-nums">{r.accuracy}%</td>
                <td className="px-4 py-2 tabular-nums">{r.incorrectChars}</td>
                <td className="px-4 py-2 tabular-nums">{r.durationSec}s</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-slate-500 dark:text-slate-400" colSpan={7}>
                  No results yet. Run a test to populate your dashboard.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

