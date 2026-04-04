import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './app/AppLayout'
import { TestPage } from './pages/TestPage'
import { PracticePage } from './pages/PracticePage'
import { LessonsPage } from './pages/LessonsPage'
import { GamesPage } from './pages/GamesPage'
import { DataEntryPage } from './pages/DataEntryPage'
import { CertificatePage } from './pages/CertificatePage'
import { SettingsPage } from './pages/SettingsPage'
import { DailyChallengePage } from './pages/DailyChallengePage'
import { useBoot } from './hooks/useBoot'

function App() {
  useBoot()

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/test" replace />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/data-entry" element={<DataEntryPage />} />
        <Route path="/certificate" element={<CertificatePage />} />
        <Route path="/daily" element={<DailyChallengePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App
