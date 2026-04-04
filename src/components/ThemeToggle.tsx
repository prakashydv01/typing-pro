import { useSettingsStore, type ThemeMode } from '../store/settingsStore'

const options: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

export function ThemeToggle() {
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)

  return (
    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <span className="text-slate-500 dark:text-slate-400">Theme</span>
      <select
        className="bg-transparent text-sm outline-none"
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeMode)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

