import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import BudgetsPage from './pages/BudgetsPage'
import StatsPage from './pages/StatsPage'
import WalletPage from './pages/WalletPage'
import GoalsPage from './pages/GoalsPage'
import TipsPage from './pages/TipsPage'
import ComparisonPage from './pages/ComparisonPage'
import CalendarPage from './pages/CalendarPage'
import ProjectionsPage from './pages/ProjectionsPage'
import { useAuth } from './AuthContext'

function Protected({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  // if onboarding missing (null/undefined) redirect to onboarding
  if (!user.onboarding) return <Navigate to="/onboarding" replace />
  return children
}


export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/onboarding" element={<OnboardingPage/>} />
  <Route path="/wallet" element={<Protected><WalletPage/></Protected>} />
      <Route path="/" element={<Protected><DashboardPage/></Protected>} />
      <Route path="/budgets" element={<Protected><BudgetsPage/></Protected>} />
    <Route path="/goals" element={<Protected><GoalsPage/></Protected>} />
      <Route path="/stats" element={<Protected><StatsPage/></Protected>} />
      <Route path="/tips" element={<Protected><TipsPage/></Protected>} />
      <Route path="/comparison" element={<Protected><ComparisonPage/></Protected>} />
      <Route path="/calendar" element={<Protected><CalendarPage/></Protected>} />
      <Route path="/projections" element={<Protected><ProjectionsPage/></Protected>} />
    </Routes>
  )
}
