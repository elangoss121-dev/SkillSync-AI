import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import DemoModeBanner from '../ui/DemoModeBanner'

export default function DashboardLayout() {
  return (
    <div
      className="flex h-screen overflow-hidden transition-colors duration-300"
      style={{ background: 'var(--bg-base)' }}
    >
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DemoModeBanner />
        <Navbar />
        <main className="flex-1 overflow-y-auto p-5 bg-grid">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
