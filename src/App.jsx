import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import SelectPack from './pages/SelectPack'
import Referrals from './pages/Referrals'
import Withdrawals from './pages/Withdrawals'
import Deposit from './pages/Deposit'
import Withdraw from './pages/Withdraw'
import Transactions from './pages/Transactions'
import AdminDashboard from './pages/AdminDashboard'
import About from './pages/About'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Cookies from './pages/Cookies'
import Legal from './pages/Legal'
import Claims from './pages/Claims'
import ProtectedRoute from './components/ProtectedRoute'
import InstallPrompt from './components/InstallPrompt'

function App() {
  console.log('✅ App component renderizando...')
  
  return (
    <BrowserRouter>
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/select-pack"
          element={
            <ProtectedRoute>
              <SelectPack />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/referrals"
          element={
            <ProtectedRoute>
              <Referrals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/withdrawals"
          element={
            <ProtectedRoute>
              <Withdraw />
            </ProtectedRoute>
          }
        />
        <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
        <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/claims" element={<Claims />} />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

