import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Toast from './components/ui/Toast'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './components/layout/DashboardLayout'
import DebugCode from './pages/dashboard/DebugCode'
import ConvertCode from './pages/dashboard/ConvertCode'
import GenerateTests from './pages/dashboard/GenerateTests'
import OptimizeCode from './pages/dashboard/OptimizeCode'
import ExplainCode from './pages/dashboard/ExplainCode'
import './lib/firebase' // Initialize Firebase and Analytics

// ── Auth guard: redirect to /login if no token stored ──────────────────────────
function RequireAuth({ children }) {
  const token = localStorage.getItem('skillsync_token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"      element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="debug-code" replace />} />
            <Route path="debug-code"      element={<DebugCode />} />
            <Route path="convert-code"    element={<ConvertCode />} />
            <Route path="generate-tests"  element={<GenerateTests />} />
            <Route path="optimize-code"   element={<OptimizeCode />} />
            <Route path="explain-code"    element={<ExplainCode />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toast />
      </BrowserRouter>
    </AppProvider>
  )
}
