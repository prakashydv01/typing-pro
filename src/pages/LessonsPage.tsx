import { KeyboardViz } from '../components/lessons/KeyboardViz'
import { WeakKeysPanel } from '../components/lessons/WeakKeysPanel'

export function LessonsPage() {
  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <div className="text-lg font-semibold">Typing Lessons</div>
        <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Beginner to advanced lessons with a keyboard visualizer, finger guide,
          and weak key practice generated from your local analysis data.
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-4 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
              1
            </div>
            <div>
              <div className="text-sm font-semibold">Lesson 1: Keyboard visualization</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Pick a key and see which finger zone it belongs to.
              </div>
            </div>
          </div>
          <div className="mt-4">
            <KeyboardViz />
          </div>
        </div>

        <div className="card p-4 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
              2
            </div>
            <div>
              <div className="text-sm font-semibold">Lesson 2: Finger & home-row tips</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Fast accuracy comes from consistent positioning.
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-sm text-slate-700 dark:text-slate-200">
              Keep left index on <span className="font-semibold">F</span> and right index on{' '}
              <span className="font-semibold">J</span>.
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-200">
              Use the finger zones from Lesson 1. Avoid “reaching” with the wrong finger.
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Tip: click the typing area (in any test) to start, and keep going until you’re
              comfortable with the rhythm.
            </div>
          </div>
        </div>

        <div className="card p-4 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
              3
            </div>
            <div>
              <div className="text-sm font-semibold">Lesson 3: Weak-key practice</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                The app generates a practice text from your most mistake-prone keys.
              </div>
            </div>
          </div>
          <div className="mt-4">
            <WeakKeysPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

