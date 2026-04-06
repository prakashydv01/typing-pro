import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './app/AppLayout'
import { useBoot } from './hooks/useBoot'

const TestPage = lazy(() =>
  import('./pages/TestPage').then((module) => ({ default: module.TestPage })),
)
const PracticePage = lazy(() =>
  import('./pages/PracticePage').then((module) => ({ default: module.PracticePage })),
)
const GamesPage = lazy(() =>
  import('./pages/GamesPage').then((module) => ({ default: module.GamesPage })),
)
const DataEntryPage = lazy(() =>
  import('./pages/DataEntryPage').then((module) => ({ default: module.DataEntryPage })),
)
const CertificatePage = lazy(() =>
  import('./pages/CertificatePage').then((module) => ({ default: module.CertificatePage })),
)
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })),
)
const DailyChallengePage = lazy(() =>
  import('./pages/DailyChallengePage').then((module) => ({ default: module.DailyChallengePage })),
)

function App() {
  useBoot()

  return (
    <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading...</div>}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/test" replace />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/data-entry" element={<DataEntryPage />} />
          <Route path="/certificate" element={<CertificatePage />} />
          <Route path="/daily" element={<DailyChallengePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
