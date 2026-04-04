import { WordDropGame } from '../components/games/WordDropGame'

export function GamesPage() {
  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <div className="text-lg font-semibold">Typing Games</div>
        <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Single player games that train speed and accuracy. Everything runs
          offline and progress is saved locally.
        </div>
      </div>

      <WordDropGame />
    </div>
  )
}

