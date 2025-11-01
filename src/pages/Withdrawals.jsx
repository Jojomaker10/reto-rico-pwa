import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  DollarSign, TrendingDown, Clock, CheckCircle, XCircle, 
  AlertCircle, Info, Calendar, Filter, Download
} from 'lucide-react'
import useAuthStore from '../store/authStoreSupabase'
import supabase from '../config/supabase'
import NavBar from '../components/NavBar'

const Withdrawals = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [withdrawals, setWithdrawals] = useState([])
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([])
  
  const [formData, setFormData] = useState({
    amount: '',
    usdtAddress: ''
  })
  
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: ''
  })
  
  const [errors, setErrors] = useState({})
  const [showInfo, setShowInfo] = useState(false)

  const MIN_WITHDRAWAL = 10000

  // Load withdrawals from Supabase
  useEffect(() => {
    loadWithdrawals()
  }, [user])

  // Filter withdrawals
  useEffect(() => {
    filterWithdrawals()
  }, [withdrawals, filters])

  const loadWithdrawals = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading withdrawals:', error)
        return
      }

      setWithdrawals(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const filterWithdrawals = () => {
    let filtered = [...withdrawals]

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(w => w.status === filters.status)
    }

    // Filter by date
    if (filters.dateFrom) {
      filtered = filtered.filter(w => 
        new Date(w.created_at) >= new Date(filters.dateFrom)
      )
    }

    if (filters.dateTo) {
      filtered = filtered.filter(w => 
        new Date(w.created_at) <= new Date(filters.dateTo)
      )
    }

    setFilteredWithdrawals(filtered)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.amount) {
      newErrors.amount = 'El monto es requerido'
    } else {
      const amount = parseFloat(formData.amount)
      
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'El monto debe ser mayor a 0'
      } else if (amount < MIN_WITHDRAWAL) {
        newErrors.amount = `El monto mínimo es ${MIN_WITHDRAWAL.toLocaleString('es-CL')} CLP`
      } else if (amount > user.balance) {
        newErrors.amount = 'Fondos insuficientes'
      }
    }

    if (!formData.usdtAddress) {
      newErrors.usdtAddress = 'La dirección USDT es requerida'
    } else if (formData.usdtAddress.length < 26) {
      newErrors.usdtAddress = 'Dirección USDT inválida'
    }

    // Check for pending withdrawals
    const hasPending = withdrawals.some(w => 
      w.status === 'pendiente' || w.status === 'en_proceso'
    )

    if (hasPending) {
      newErrors.general = 'Ya tienes un retiro en proceso'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const amount = parseFloat(formData.amount)

      // Create withdrawal in Supabase
      const { data, error } = await supabase
        .from('withdrawals')
        .insert([
          {
            user_id: user.id,
            amount: amount,
            method: 'USDT',
            address: formData.usdtAddress,
            status: 'pendiente'
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Error creating withdrawal:', error)
        alert('Error al crear la solicitud de retiro')
        setLoading(false)
        return
      }

      // Update user balance
      await supabase
        .from('profiles')
        .update({ balance: user.balance - amount })
        .eq('id', user.id)

      // Reload withdrawals and user
      await loadWithdrawals()
      
      // Reset form
      setFormData({ amount: '', usdtAddress: '' })
      setErrors({})
      
      alert('✅ Solicitud de retiro enviada correctamente')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pendiente: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      en_proceso: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      completado: 'bg-green-500/20 text-green-500 border-green-500/30',
      rechazado: 'bg-red-500/20 text-red-500 border-red-500/30'
    }

    const labels = {
      pendiente: 'Pendiente',
      en_proceso: 'En Proceso',
      completado: 'Completado',
      rechazado: 'Rechazado'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
    )
  }

  const getStatusIcon = (status) => {
    const icons = {
      pendiente: Clock,
      en_proceso: AlertCircle,
      completado: CheckCircle,
      rechazado: XCircle
    }
    const Icon = icons[status] || Clock
    return <Icon size={16} />
  }

  const pendingWithdrawals = withdrawals.filter(w => 
    w.status === 'pendiente' || w.status === 'en_proceso'
  )

  const completedWithdrawals = withdrawals.filter(w => 
    w.status === 'completado'
  )

  const totalWithdrawn = completedWithdrawals.reduce((sum, w) => sum + parseFloat(w.amount || 0), 0)

  const availableBalance = user?.balance || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-20">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Solicitar Retiro
          </h1>
          <p className="text-gray-400">
            Retira tus ganancias de manera segura
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Available Balance */}
          <div className="bg-gradient-to-br from-green-money/20 to-green-money/10 backdrop-blur-lg rounded-2xl p-6 border border-green-money/30">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-money/20 p-3 rounded-xl">
                <DollarSign className="text-green-money" size={24} />
              </div>
              <TrendingDown className="text-green-money" size={20} />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Balance Disponible</h3>
            <p className="text-3xl font-bold text-white">
              {availableBalance.toLocaleString('es-CL')} CLP
            </p>
          </div>

          {/* In Process */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Clock className="text-blue-500" size={24} />
              </div>
              <AlertCircle className="text-blue-500" size={20} />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">En Proceso</h3>
            <p className="text-3xl font-bold text-white">
              {pendingWithdrawals.reduce((sum, w) => sum + parseFloat(w.amount || 0), 0).toLocaleString('es-CL')} CLP
            </p>
          </div>

          {/* Total Withdrawn */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <CheckCircle className="text-purple-500" size={24} />
              </div>
              <Download className="text-purple-500" size={20} />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Retirado</h3>
            <p className="text-3xl font-bold text-white">
              {totalWithdrawn.toLocaleString('es-CL')} CLP
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Nueva Solicitud</h2>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <Info className="text-gray-400" size={20} />
              </button>
            </div>

            {showInfo && (
              <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                <p className="text-blue-200 text-sm">
                  <strong>ℹ️ Información Importante:</strong>
                </p>
                <ul className="text-blue-200/80 text-sm mt-2 space-y-1">
                  <li>• Monto mínimo: {MIN_WITHDRAWAL.toLocaleString('es-CL')} CLP</li>
                  <li>• Método de pago: USDT (TRC20 o ERC20)</li>
                  <li>• Tiempo de procesamiento: 2-5 días hábiles</li>
                  <li>• No puedes tener más de un retiro pendiente</li>
                </ul>
              </div>
            )}

            {errors.general && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-200 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Monto a Retirar (CLP)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                    errors.amount ? 'border-red-500' : 'border-white/20'
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-money`}
                  placeholder="10,000"
                  min={MIN_WITHDRAWAL}
                  max={availableBalance}
                />
                {errors.amount && (
                  <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Máximo: {availableBalance.toLocaleString('es-CL')} CLP
                </p>
              </div>

              {/* USDT Address */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Dirección USDT
                </label>
                <input
                  type="text"
                  value={formData.usdtAddress}
                  onChange={(e) => setFormData({ ...formData, usdtAddress: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                    errors.usdtAddress ? 'border-red-500' : 'border-white/20'
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-money`}
                  placeholder="TXhash... o 0x..."
                />
                {errors.usdtAddress && (
                  <p className="text-red-400 text-sm mt-1">{errors.usdtAddress}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Aceptamos direcciones TRC20 y ERC20
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || availableBalance < MIN_WITHDRAWAL}
                className="w-full bg-gradient-to-r from-green-money to-green-money/80 text-white py-3 rounded-xl font-semibold hover:from-green-money/90 hover:to-green-money/70 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : 'Solicitar Retiro'}
              </button>
            </form>
          </div>

          {/* History */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Historial</h2>
              <Filter className="text-gray-400" size={20} />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Estado</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-money"
                >
                  <option value="all">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="completado">Completado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Desde</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-money"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Hasta</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-money"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-2 text-gray-400 text-sm font-medium">Fecha</th>
                    <th className="text-left py-3 px-2 text-gray-400 text-sm font-medium">Monto</th>
                    <th className="text-left py-3 px-2 text-gray-400 text-sm font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWithdrawals.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-gray-500">
                        No hay retiros registrados
                      </td>
                    </tr>
                  ) : (
                    filteredWithdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="py-4 px-2 text-gray-300 text-sm">
                          {new Date(withdrawal.created_at).toLocaleDateString('es-CL')}
                        </td>
                        <td className="py-4 px-2 text-white font-medium">
                          {parseFloat(withdrawal.amount).toLocaleString('es-CL')} CLP
                        </td>
                        <td className="py-4 px-2">
                          {getStatusBadge(withdrawal.status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Withdrawals

