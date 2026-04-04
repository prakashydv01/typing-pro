import { useAchievementsStore } from '../../store/achievementsStore'

export function AchievementsPanel() {
  const unlocked = useAchievementsStore((s) => s.unlocked)
  const meta = useAchievementsStore((s) => s.meta)

  const all = Object.entries(meta)
  return (
    <div className="card p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-sm font-medium">Achievements</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {unlocked.length} / {all.length}
        </div>
      </div>
      <div className="grid gap-2">
        {all.map(([id, m]) => {
          const isUnlocked = unlocked.includes(id as any)
          return (
            <div
              key={id}
              className={[
                'rounded-xl border p-3',
                isUnlocked
                  ? 'border-emerald-500/30 bg-emerald-500/10'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60',
              ].join(' ')}
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="text-sm font-semibold">{m.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {isUnlocked ? 'Unlocked' : 'Locked'}
                </div>
              </div>
              <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                {m.description}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

