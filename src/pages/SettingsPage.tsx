import { useHistoryStore } from '../store/historyStore'
import { useAnalysisStore } from '../store/analysisStore'
import { useSettingsStore, type LanguageCode } from '../store/settingsStore'

export function SettingsPage() {
  const language = useSettingsStore((s) => s.language)
  const setLanguage = useSettingsStore((s) => s.setLanguage)
  const clearHistory = useHistoryStore((s) => s.clear)
  const resetAnalysis = useAnalysisStore((s) => s.reset)

  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <div className="text-lg font-semibold">Settings</div>
        <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Everything is stored locally in your browser.
        </div>
      </div>

      <div className="card p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <div className="text-sm font-medium">Typing language</div>
            <select
              className="input"
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            >
              <option value="en">English</option>
              <option value="ne">Nepali</option>
            </select>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Tip: Nepali mode uses Unicode Nepali word lists (works offline).
            </div>
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-medium">Data management</div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-ghost" onClick={clearHistory}>
                Clear history
              </button>
              <button className="btn-ghost" onClick={resetAnalysis}>
                Reset analysis
              </button>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              This cannot be undone.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

