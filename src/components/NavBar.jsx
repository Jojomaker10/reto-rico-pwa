import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { DollarSign, User, LogIn, Wallet } from 'lucide-react'
import useAuthStore from '../store/authStoreSupabase'
import secureStorage from '../utils/storage'

const NavBar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const loadBalance = async () => {
      if (isAuthenticated && user) {
        // Si el usuario tiene balance en Supabase, usarlo
        if (user.balance !== undefined) {
          setBalance(Number(user.balance) || 0)
        } else {
          // Si no, intentar obtenerlo del storage local
          try {
            const users = await secureStorage.getItem('users') || []
            const currentUser = users.find(u => u.id === user.id)
            if (currentUser) {
              setBalance(Number(currentUser.balance) || 0)
            }
          } catch (error) {
            console.error('Error loading balance:', error)
          }
        }
      }
    }

    loadBalance()
    
    // Actualizar balance cada 30 segundos
    const interval = setInterval(loadBalance, 30000)
    
    return () => clearInterval(interval)
  }, [isAuthenticated, user])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-green-money to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black gradient-text">RETO-RICO</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <Link to="/" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/about" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
            Quiénes Somos
          </Link>
          {isAuthenticated ? (
            <>
              {/* Balance Display */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-money/20 to-emerald-600/20 border border-green-money/30 rounded-lg">
                <Wallet className="w-4 h-4 text-green-money" />
                <span className="text-green-money font-bold">
                  {formatBalance(balance)}
                </span>
              </div>
              <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors">
                <User className="w-4 h-4" />
                <span>{user?.name}</span>
              </Link>
              <Link
                to="/deposit"
                className="px-4 py-2 bg-gradient-to-r from-green-money to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-money/50 transition-all font-medium"
              >
                Depositar USDT
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors">
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-green-money to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-money/50 transition-all font-medium"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar

