import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, DollarSign, TrendingUp, Copy, Share2, Trophy,
  Award, Calendar, Package, Eye, Download
} from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import useAuthStore from '../store/authStoreSupabase'
import secureStorage from '../utils/storage'

const Referrals = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, init } = useAuthStore()
  const [referrals, setReferrals] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    totalEarned: 0,
    pending: 0
  })
  const [referralChartData, setReferralChartData] = useState([])
  const [commissionChartData, setCommissionChartData] = useState([])

  useEffect(() => {
    init()
    if (!isAuthenticated) {
      navigate('/login')
    }
    loadReferralData()
  }, [isAuthenticated, navigate, init])

  const loadReferralData = async () => {
    try {
      const allUsers = await secureStorage.getItem('users') || []
      const allInvestments = await secureStorage.getItem('investments') || []
      
      // Find users referred by current user
      const myReferrals = allUsers.filter(u => u.referredBy === user?.referralCode)
      
      // Get investment data for each referral
      const referralsWithInvestments = myReferrals.map(ref => {
        const investment = allInvestments.find(inv => inv.userId === ref.id)
        return {
          ...ref,
          investment
        }
      })

      setReferrals(referralsWithInvestments)

      // Calculate stats
      const total = myReferrals.length
      const totalEarned = referralsWithInvestments.reduce((sum, ref) => {
        if (ref.investment && ref.investment.status === 'activo') {
          return sum + (ref.investment.amount * 0.10)
        }
        return sum
      }, 0)
      
      const pending = referralsWithInvestments.reduce((sum, ref) => {
        if (ref.investment && ref.investment.status === 'pendiente_verificacion') {
          return sum + (ref.investment.amount * 0.10)
        }
        return sum
      }, 0)

      setStats({ total, totalEarned, pending })

      // Generate chart data
      generateChartData(referralsWithInvestments)
    } catch (error) {
      console.error('Error loading referrals:', error)
    }
  }

  const generateChartData = (refs) => {
    // Monthly referrals chart
    const monthlyReferrals = {}
    const monthlyCommissions = {}

    refs.forEach(ref => {
      const date = new Date(ref.createdAt)
      const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`
      
      monthlyReferrals[monthKey] = (monthlyReferrals[monthKey] || 0) + 1
      
      if (ref.investment && ref.investment.status === 'activo') {
        const commission = ref.investment.amount * 0.10
        monthlyCommissions[monthKey] = (monthlyCommissions[monthKey] || 0) + commission
      }
    })

    // Generate last 6 months data
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`
      const monthLabel = date.toLocaleDateString('es-CL', { month: 'short' })
      
      months.push({
        month: monthLabel,
        referidos: monthlyReferrals[monthKey] || 0,
        comisiones: Math.floor(monthlyCommissions[monthKey] || 0)
      })
    }

    setReferralChartData(months)
    setCommissionChartData(months)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user?.referralCode)
    alert('Código copiado al portapapeles')
  }

  const handleShare = (platform) => {
    const message = `¡Únete a Reto-Rico y comienza a generar ingresos! 🚀💰

Usa mi código de referido: ${user?.referralCode}

✅ Gana hasta 10% semanal
✅ Multiplica tu dinero x3
✅ Sistema de referidos que paga

¡No esperes más!`
    const url = `${window.location.origin}?ref=${user?.referralCode}`

    let shareUrl = ''
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + '\n\n' + url)}`
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

  const getStatusBadge = (status) => {
    const badges = {
      'pendiente_verificacion': { text: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-500' },
      'activo': { text: 'Aprobado', color: 'bg-green-money/20 text-green-money' },
      'pagado': { text: 'Pagado', color: 'bg-blue-500/20 text-blue-500' }
    }
    const badge = badges[status] || badges['pendiente_verificacion']
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.text}</span>
  }

  // Calculate badge level
  const getUserBadge = (referralCount) => {
    if (referralCount >= 31) return { name: 'Platino', color: 'from-gray-700 to-gray-900', icon: '👑' }
    if (referralCount >= 16) return { name: 'Oro', color: 'from-yellow-600 to-yellow-800', icon: '🥇' }
    if (referralCount >= 6) return { name: 'Plata', color: 'from-gray-400 to-gray-600', icon: '🥈' }
    return { name: 'Bronce', color: 'from-orange-700 to-orange-900', icon: '🥉' }
  }

  const badge = getUserBadge(stats.total)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="animate-spin w-12 h-12 border-4 border-green-money border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-colors"
              >
                ←
              </button>
              <div>
                <h1 className="text-xl font-bold gradient-text">Mis Referidos</h1>
                <p className="text-xs text-gray-400">Sistema de comisiones</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-blue-400 font-medium">Total</span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Referidos Totales</h3>
            <p className="text-4xl font-black text-blue-400">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-1">Personas</p>
          </div>

          <div className="card hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-money to-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-green-money font-medium">Ganado</span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Total Ganado</h3>
            <p className="text-3xl font-black gradient-text">
              ${stats.totalEarned.toLocaleString('es-CL')}
            </p>
            <p className="text-xs text-gray-500 mt-1">CLP</p>
          </div>

          <div className="card hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gold font-medium">Pendiente</span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Por Cobrar</h3>
            <p className="text-3xl font-black text-gold">
              ${stats.pending.toLocaleString('es-CL')}
            </p>
            <p className="text-xs text-gray-500 mt-1">CLP</p>
          </div>
        </div>

        {/* Badge Display */}
        <div className="card mb-8 bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-700">
          <div className="flex items-center gap-6">
            <div className={`text-6xl ${badge.color.includes('from') ? '' : 'opacity-80'}`}>
              {badge.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-gold" />
                <h3 className="text-2xl font-bold gradient-text">Nivel {badge.name}</h3>
              </div>
              <p className="text-gray-400 mb-3">
                Tienes <strong className="text-white">{stats.total}</strong> referidos activos
              </p>
              <div className="flex gap-2 text-xs">
                {stats.total < 31 && <span className="text-gray-500">
                  Próximo nivel: {stats.total < 6 ? '6' : stats.total < 16 ? '16' : '31'} referidos
                </span>}
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="card mb-8">
          <h3 className="text-2xl font-bold mb-6 gradient-text flex items-center gap-3">
            <Share2 className="w-6 h-6" />
            Tu Código de Referido
          </h3>
          
          <div className="p-6 bg-gradient-to-br from-green-money/20 to-emerald-600/20 border border-green-money/30 rounded-xl mb-6">
            <div className="flex flex-col items-center gap-4">
              <code className="text-6xl font-black tracking-wider gradient-text">
                {user.referralCode}
              </code>
              <div className="flex gap-3 w-full max-w-md">
                <button
                  onClick={handleCopyCode}
                  className="flex-1 py-3 px-4 bg-green-money hover:bg-green-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  Copiar
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}?ref=${user.referralCode}`)}
                  className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Copiar Link
                </button>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div>
            <p className="text-sm text-gray-400 mb-3 text-center">Compartir en redes sociales</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleShare('whatsapp')}
                className="py-4 px-4 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg transition-colors text-green-400 flex flex-col items-center gap-2"
              >
                <Share2 className="w-6 h-6" />
                <span className="text-xs font-medium">WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare('telegram')}
                className="py-4 px-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg transition-colors text-blue-400 flex flex-col items-center gap-2"
              >
                <Share2 className="w-6 h-6" />
                <span className="text-xs font-medium">Telegram</span>
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="py-4 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors text-blue-500 flex flex-col items-center gap-2"
              >
                <Share2 className="w-6 h-6" />
                <span className="text-xs font-medium">Facebook</span>
              </button>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Referrals by Month */}
          <div className="card">
            <h3 className="text-2xl font-bold mb-6 gradient-text flex items-center gap-3">
              <Users className="w-6 h-6" />
              Referidos por Mes
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={referralChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar dataKey="referidos" fill="#16a34a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Commissions by Month */}
          <div className="card">
            <h3 className="text-2xl font-bold mb-6 gradient-text flex items-center gap-3">
              <TrendingUp className="w-6 h-6" />
              Comisiones por Mes
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={commissionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="comisiones" 
                    stroke="#fbbf24" 
                    strokeWidth={3}
                    dot={{ fill: '#fbbf24', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Referrals Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold gradient-text flex items-center gap-3">
              <Award className="w-6 h-6" />
              Lista de Referidos
            </h3>
            <button className="text-sm text-green-money hover:underline flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>

          {referrals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Referido</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Fecha</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Pack</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Inversión</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Tu Comisión</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((ref, idx) => (
                    <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-money to-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{ref.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{ref.name}</p>
                            <p className="text-xs text-gray-400">{ref.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-300">
                          {ref.createdAt ? new Date(ref.createdAt).toLocaleDateString('es-CL') : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {ref.investment ? getPackName(ref.investment.packType) : 'Sin pack'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-white">
                          ${ref.investment?.amount?.toLocaleString('es-CL') || '0'} CLP
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-bold text-green-money">
                          ${ref.investment ? Math.floor(ref.investment.amount * 0.10).toLocaleString('es-CL') : '0'} CLP
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {ref.investment ? getStatusBadge(ref.investment.status) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-500">
                            Sin inversión
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-400 mb-2">No tienes referidos aún</p>
              <p className="text-sm text-gray-500 mb-6">Comparte tu código para comenzar a ganar comisiones</p>
              <button
                onClick={handleCopyCode}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Compartir mi Código
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Referrals

