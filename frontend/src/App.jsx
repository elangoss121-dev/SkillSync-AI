import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Toast from './components/ui/Toast'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './components/layout/DashboardLayout'
import ErrorExplainer from './pages/dashboard/ErrorExplainer'
import DocsGenerator from './pages/dashboard/DocsGenerator'
import CodeSimplifier from './pages/dashboard/CodeSimplifier'
import UIToCode from './pages/dashboard/UIToCode'

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
            <Route index element={<Navigate to="error-explainer" replace />} />
            <Route path="error-explainer" element={<ErrorExplainer />} />
            <Route path="docs-generator"  element={<DocsGenerator />} />
            <Route path="code-simplifier" element={<CodeSimplifier />} />
            <Route path="ui-to-code"      element={<UIToCode />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toast />
      </BrowserRouter>
    </AppProvider>
  )
}
