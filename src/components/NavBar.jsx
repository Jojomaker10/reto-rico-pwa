import { Link, useNavigate } from 'react-router-dom'
import { DollarSign, User, LogIn } from 'lucide-react'
import useAuthStore from '../store/authStore'

const NavBar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/')
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
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors">
                <User className="w-4 h-4" />
                <span>{user?.name}</span>
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

