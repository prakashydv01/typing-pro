import { HistoryChart } from '../components/dashboard/HistoryChart'
import { WeakKeysChart } from '../components/dashboard/WeakKeysChart'
import { HistoryTable } from '../components/dashboard/HistoryTable'
import { AchievementsPanel } from '../components/dashboard/AchievementsPanel'

export function DashboardPage() {
  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <div className="text-lg font-semibold">Progress Dashboard</div>
        <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Your results and analysis are stored locally. No account, no backend.
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <HistoryChart />
        <WeakKeysChart />
      </div>

      <AchievementsPanel />

      <HistoryTable />
    </div>
  )
}

