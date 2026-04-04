import { NavLink, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SoundToggle } from '../components/SoundToggle'

const navItems = [
  { to: '/test', label: 'Test' },
  { to: '/practice', label: 'Practice' },
 
  { to: '/games', label: 'Games' },
  { to: '/data-entry', label: 'Data Entry' },
  { to: '/certificate', label: 'Certificate' },
  { to: '/daily', label: 'Daily' },
  { to: '/settings', label: 'Settings' },
]

export function AppLayout() {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
        <div className="mx-auto flex max-w-[90rem] items-center gap-3 px-4 py-3">
          <div className="flex items-baseline gap-2 text-20xl">
            <NavLink
              to="/"
              className={({ isActive }) =>
                [
                  'rounded-xl px-3 py-1 transition',
                  'text-base font-extrabold tracking-tight',
                  'bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent',
                  'hover:brightness-110',
                  isActive ? 'opacity-100' : 'opacity-90',
                ].join(' ')
              }
              aria-label="Go to home"
            >
              <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent text-2xl font-extrabold tracking-tight">
                I Love Typing
              </span>
            </NavLink>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              
            </div>
          </div>

          <nav className="ml-2 hidden flex-1 items-center gap-6 lg:flex">
            {navItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) =>
                  [
                    'rounded-xl px-3 py-2 text-sm transition',
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60',
                  ].join(' ')
                }
              >
                {it.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <SoundToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[90rem] px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}

