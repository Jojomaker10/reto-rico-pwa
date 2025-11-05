import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  DollarSign, TrendingUp, Users, LogOut, Gift, Copy, Share2, 
  Clock, Target, Calendar, Zap, RefreshCw, Download, 
  BarChart3, Activity, Plus
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import useAuthStore from '../store/authStoreSupabase'
import secureStorage from '../utils/storage'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, init } = useAuthStore()
  const [investment, setInvestment] = useState(null)
  const [activities, setActivities] = useState([])
  const [performanceData, setPerformanceData] = useState([])
  const [referralCount, setReferralCount] = useState(0)

  useEffect(() => {
    init()
    if (user) {
      loadDashboardData()
    }
  }, [init, user])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const loadDashboardData = async () => {
    try {
      // Load investments
      const investments = await secureStorage.getItem('investments') || []
      const userInvestments = investments.filter(inv => inv.userId === user?.id)
      const activeInvestment = userInvestments.find(inv => inv.status === 'pendiente_verificacion' || inv.status === 'activo')
      setInvestment(activeInvestment)

      // Load referrals count
      const allUsers = await secureStorage.getItem('users') || []
      const myReferrals = allUsers.filter(u => u.referredBy === user?.referralCode)
      setReferralCount(myReferrals.length)

      // Load activities
      const allActivities = await secureStorage.getItem('activities') || []
      const userActivities = allActivities.filter(act => act.userId === user?.id)
      setActivities(userActivities.slice(0, 10).reverse())

      // Generate performance data
      generatePerformanceData()
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const generatePerformanceData = () => {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' }),
        earnings: Math.floor(Math.random() * 50000) + 10000
      })
    }
    setPerformanceData(data)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user?.referralCode)
    alert('Código copiado al portapapeles')
  }

  const handleShare = (platform) => {
    const message = `¡Únete a Reto-Rico y comienza a generar ingresos! Usa mi código: ${user?.referralCode}`
    const url = window.location.origin

    let shareUrl = ''
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`
        break
      default:
        return
    }
    
    window.open(shareUrl, '_blank')
  }

  const getPackName = (packType) => {
    switch (packType) {
      case 'inicio': return 'Pack Inicio'
      case 'trading': return 'Pack Trading'
      case 'crypto': return 'Pack Crypto'
      default: return 'Sin Pack'
    }
  }

  const getPackIcon = (packType) => {
    switch (packType) {
      case 'inicio': return Users
      case 'trading': return TrendingUp
      case 'crypto': return Gift
      default: return Target
    }
  }

  const calculateProgress = () => {
    if (!investment) return { progress: 0, text: 'Sin pack activo' }
    
    switch (investment.packType) {
      case 'inicio':
        const totalReferrals = referralCount || 0
        const targetReferrals = 10
        const progressPercent = Math.min((totalReferrals / targetReferrals) * 100, 100)
        const remaining = Math.max(targetReferrals - totalReferrals, 0)
        
        return {
          progress: progressPercent,
          text: `${totalReferrals} de ${targetReferrals} amigos invitados`,
          remaining: remaining > 0 ? `${remaining} amigos restantes` : '¡Completado!'
        }
      case 'trading':
        const weeks = investment.createdAt ? Math.floor((Date.now() - new Date(investment.createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000)) : 0
        return {
          progress: Math.min(weeks * 10, 100),
          text: `${weeks} semanas activas`,
          remaining: `${(investment.amount * 0.1 * weeks).toFixed(2)} USDT equivalentes`
        }
      case 'crypto':
        const days = investment.createdAt ? Math.floor((Date.now() - new Date(investment.createdAt).getTime()) / (24 * 60 * 60 * 1000)) : 0
        return {
          progress: Math.min((days / 60) * 100, 100),
          text: `${days} de 60 días`,
          remaining: `${60 - days} días restantes`
        }
      default:
        return { progress: 0, text: 'Sin progreso' }
    }
  }

  const progress = calculateProgress()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-green-money border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const PackIcon = investment ? getPackIcon(investment.packType) : Target

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-money to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Reto-Rico</h1>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-medium text-white bg-green-money rounded-lg">
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/referrals')}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                Referidos
              </button>
              <button 
                onClick={() => navigate('/withdrawals')}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Retiros
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                Perfil
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <button
                onClick={handleLogout}
                className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Welcome */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              Bienvenido, <span className="font-semibold text-white">{user.name}</span>
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Balance */}
          <div className="card hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-money to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-green-money font-medium">Disponible</span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Balance Total</h3>
            <p className="text-3xl font-black gradient-text">
              {(user.balance_usd || 0).toFixed(2)} USD
            </p>
            <p className="text-xs text-gray-500 mt-1">Equivalente a USDT</p>
            <div className="mt-4">
              <button
                onClick={() => navigate('/deposit')}
                className="w-full py-2 px-4 bg-gradient-to-r from-green-money to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-money/40 transition-all"
              >
                Depositar USDT
              </button>
            </div>
          </div>

          {/* Active Pack */}
          <div className="card hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <PackIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-blue-400 font-medium">
                {investment ? 'Activo' : 'Sin pack'}
              </span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Pack Actual</h3>
            <p className="text-2xl font-bold text-white mb-1">
              {investment ? getPackName(investment.packType) : 'Sin Pack'}
            </p>
            {investment && (
              <p className="text-xs text-gray-500">
                {Number(investment.amount || 0).toFixed(6)} USDT invertidos
              </p>
            )}
          </div>

          {/* Total Earned */}
          <div className="card hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gold font-medium">+Retornos</span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Total Ganado</h3>
            <p className="text-3xl font-black text-gold">
              +{Number(user.earnings_usd || 0).toFixed(2)} USD
            </p>
            <p className="text-xs text-gray-500 mt-1">Equivalente</p>
          </div>

          {/* Referrals */}
          <div className="card hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-purple-400 font-medium">Red</span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Referidos Totales</h3>
            <p className="text-3xl font-black text-purple-400">
              {user.referrals || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Personas</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* My Active Pack */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold gradient-text">Mi Pack Activo</h3>
                <button
                  onClick={() => navigate('/select-pack')}
                  className="px-4 py-2 bg-green-money hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Pack
                </button>
              </div>

              {investment ? (
                <div>
                  {/* Pack Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      investment.packType === 'inicio' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                      investment.packType === 'trading' ? 'bg-gradient-to-br from-green-money to-emerald-600' :
                      'bg-gradient-to-br from-purple-500 to-pink-500'
                    }`}>
                      <PackIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-1">
                        {getPackName(investment.packType)}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {Number(investment.amount || 0).toFixed(6)} USDT
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {investment.createdAt ? new Date(investment.createdAt).toLocaleDateString('es-CL') : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">{progress.text}</span>
                      <span className="text-sm font-bold text-white">{progress.progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          investment.packType === 'inicio' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          investment.packType === 'trading' ? 'bg-gradient-to-r from-green-money to-emerald-600' :
                          'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                    {progress.remaining && (
                      <p className="text-xs text-gray-500 mt-2">{progress.remaining}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {investment.status === 'pendiente_verificacion' 
                          ? 'Verificación Pendiente'
                          : 'Pack Activo'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {investment.status === 'pendiente_verificacion'
                          ? 'Tu comprobante está siendo verificado'
                          : 'Generando retornos activamente'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No tienes packs activos</p>
                  <button
                    onClick={() => navigate('/select-pack')}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    Seleccionar Pack
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Performance Chart */}
            <div className="card mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold gradient-text">Rendimiento</h3>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="#16a34a" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorEarnings)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Referral Code & Recent Activity */}
          <div className="space-y-8">
            {/* Referral Code */}
            <div className="card">
              <h3 className="text-2xl font-bold mb-6 gradient-text">Tu Código</h3>
              <div className="p-6 bg-gradient-to-br from-green-money/20 to-emerald-600/20 border border-green-money/30 rounded-xl mb-6">
                <p className="text-sm text-gray-400 mb-4 text-center">Comparte y gana 10%</p>
                <div className="flex flex-col items-center gap-4">
                  <code className="text-5xl font-black tracking-wider gradient-text">
                    {user.referralCode}
                  </code>
                  <button
                    onClick={handleCopyCode}
                    className="w-full py-3 px-4 bg-green-money hover:bg-green-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Copy className="w-5 h-5" />
                    Copiar Código
                  </button>
                </div>
              </div>

              {/* Share Links */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Share2 className="w-4 h-4" />
                  <span className="flex-1 break-all text-xs">
                    {window.location.origin}?ref={user.referralCode}
                  </span>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="py-3 px-4 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg transition-colors text-green-400 flex items-center justify-center"
                  title="Compartir en WhatsApp"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('telegram')}
                  className="py-3 px-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg transition-colors text-blue-400 flex items-center justify-center"
                  title="Compartir en Telegram"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors text-blue-500 flex items-center justify-center"
                  title="Compartir en Facebook"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-2xl font-bold mb-6 gradient-text">Estadísticas Rápidas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-green-money" />
                    <span className="text-sm text-gray-300">Retorno Semanal</span>
                  </div>
                  <span className="text-lg font-bold text-green-money">10%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-300">Comisión Referidos</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-500">10%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">Retiros Min.</span>
                  </div>
                  <span className="text-lg font-bold text-blue-400">$10K</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity History */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold gradient-text">Historial de Actividad</h3>
            <button className="text-sm text-green-money hover:underline">Ver todo</button>
          </div>
          
          {activities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Tipo</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Descripción</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Monto</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Fecha</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, idx) => (
                    <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-green-money" />
                          <span className="text-sm text-gray-300">{activity.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-300">{activity.description}</td>
                      <td className="py-4 px-4">
                        <span className={`text-sm font-medium ${
                          activity.amount > 0 ? 'text-green-money' : 'text-gray-400'
                        }`}>
                          {activity.amount > 0 ? '+' : ''}
                          {Number(activity.amount_usdt || 0).toFixed(6)} USDT
                          <span className="text-xs text-gray-400 ml-2">≈ {Number(activity.amount_usd || 0).toFixed(2)} USD</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400">
                        {activity.date ? new Date(activity.date).toLocaleDateString('es-CL') : 'N/A'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'completed' 
                            ? 'bg-green-money/20 text-green-money' 
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {activity.status || 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No hay actividad registrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
