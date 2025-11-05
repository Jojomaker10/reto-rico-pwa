import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { DollarSign, User, LogIn, Wallet, Globe } from 'lucide-react'
import useAuthStore from '../store/authStoreSupabase'
import useLanguageStore from '../store/languageStore'
import useTranslation from '../hooks/useTranslation'
import secureStorage from '../utils/storage'

const NavBar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { language, setLanguage } = useLanguageStore()
  const { t } = useTranslation()
  const [balance, setBalance] = useState(0)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

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

  // Cerrar menú de idioma al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      const selector = document.getElementById('language-selector')
      if (showLanguageMenu && selector && !selector.contains(event.target)) {
        setShowLanguageMenu(false)
      }
    }
    if (showLanguageMenu) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showLanguageMenu])

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
            {t('nav.home')}
          </Link>
          <Link to="/about" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
            {t('nav.about')}
          </Link>
          
          {/* Language Selector */}
          <div className="relative" id="language-selector">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase text-sm font-medium">{language}</span>
            </button>
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
                <button
                  onClick={() => {
                    setLanguage('es')
                    setShowLanguageMenu(false)
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                    language === 'es' ? 'bg-green-money/20 text-green-money' : 'text-gray-300'
                  }`}
                >
                  🇪🇸 Español
                </button>
                <button
                  onClick={() => {
                    setLanguage('en')
                    setShowLanguageMenu(false)
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                    language === 'en' ? 'bg-green-money/20 text-green-money' : 'text-gray-300'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => {
                    setLanguage('fr')
                    setShowLanguageMenu(false)
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                    language === 'fr' ? 'bg-green-money/20 text-green-money' : 'text-gray-300'
                  }`}
                >
                  🇫🇷 Français
                </button>
              </div>
            )}
          </div>
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
                {t('nav.deposit')}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors">
                <LogIn className="w-4 h-4" />
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-green-money to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-money/50 transition-all font-medium"
              >
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar

