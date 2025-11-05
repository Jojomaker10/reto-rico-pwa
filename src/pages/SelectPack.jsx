import { useState, useEffect } from 'react'
import { Users, TrendingUp, Bitcoin, Check, ArrowRight, Info, Gift } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStoreSupabase'
import ConfirmInvestmentModal from '../components/ConfirmInvestmentModal'
import NavBar from '../components/NavBar'
import secureStorage from '../utils/storage'

const SelectPack = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  
  const [activePack, setActivePack] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [tradingAmount, setTradingAmount] = useState(25)
  const [cryptoAmount, setCryptoAmount] = useState(100000)
  const [hasCryptoCompleted, setHasCryptoCompleted] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  // Verificar si el usuario completó el Pack Crypto para habilitar el Pack Misterio
  useEffect(() => {
    const checkCryptoCompletion = async () => {
      if (!user?.id) return
      
      const investments = await secureStorage.getItem('investments') || []
      const my = investments.filter(inv => inv.userId === user.id && inv.packType === 'crypto')
      
      // Consideramos completado si:
      // 1. Tiene status 'activo' o 'pagado'
      // 2. O si ha pasado el plazo de 2 meses desde la creación (60 días)
      const completed = my.some(inv => {
        if (inv.status === 'activo' || inv.status === 'pagado' || inv.status === 'completado') {
          return true
        }
        
        // Verificar si ha completado el plazo de 2 meses (60 días)
        if (inv.createdAt) {
          const createdDate = new Date(inv.createdAt)
          const now = new Date()
          const daysDiff = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24))
          return daysDiff >= 60 // Pack Crypto tiene plazo de 2 meses
        }
        
        return false
      })
      
      setHasCryptoCompleted(completed)
    }
    
    checkCryptoCompletion()
    
    // Verificar cada vez que el componente se monta o cuando cambia el usuario
    const interval = setInterval(checkCryptoCompletion, 30000) // Verificar cada 30 segundos
    
    return () => clearInterval(interval)
  }, [user])

  // Calculate weekly earnings for Trading
  const calculateWeeklyEarnings = (amount) => {
    return Math.floor(amount * 0.10)
  }

  // Calculate monthly projected earnings for Trading
  const calculateMonthlyEarnings = (amount) => {
    return Math.floor(calculateWeeklyEarnings(amount) * 4)
  }

  // Calculate crypto return
  const calculateCryptoReturn = (amount) => {
    return amount * 3
  }

  const handleSelectPack = async (packType, amount = null) => {
    // Verificar si ya tiene un pack activo
    const investments = await secureStorage.getItem('investments') || []
    const userInvestments = investments.filter(inv => inv.userId === user?.id)
    const hasActive = userInvestments.some(inv => 
      inv.status === 'pendiente_verificacion' || inv.status === 'activo'
    )

    if (hasActive) {
      alert('Ya tienes un pack activo. Debes completar o cancelar el pack actual antes de seleccionar uno nuevo.')
      return
    }

    setActivePack({
      type: packType,
      amount: amount
    })
    setShowModal(true)
  }

  const handleConfirmInvest = async (paymentData) => {
    // Verificar nuevamente antes de confirmar
    const investments = await secureStorage.getItem('investments') || []
    const userInvestments = investments.filter(inv => inv.userId === user?.id)
    const hasActive = userInvestments.some(inv => 
      inv.status === 'pendiente_verificacion' || inv.status === 'activo'
    )

    if (hasActive) {
      setShowModal(false)
      alert('Ya tienes un pack activo. No puedes tener más de un pack activo al mismo tiempo.')
      return
    }

    // Save investment to IndexedDB
    try {
      const investment = {
        id: Date.now().toString(),
        userId: user.id,
        packType: activePack.type,
        amount: activePack.amount,
        status: 'pendiente_verificacion',
        createdAt: new Date().toISOString(),
        paymentMethod: paymentData.paymentMethod,
        proofUploaded: paymentData.proofUploaded,
        ...paymentData
      }

      // Get existing investments
      await secureStorage.setItem('investments', [...investments, investment])

      // También guardar en Supabase si está configurado
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
      if (supabaseUrl && !supabaseUrl.includes('placeholder') && user?.id) {
        try {
          const { saveInvestment } = useAuthStore.getState()
          await saveInvestment({
            user_id: user.id,
            pack_type: activePack.type,
            amount: activePack.amount,
            status: 'pendiente_verificacion',
            payment_method: paymentData.paymentMethod,
            created_at: new Date().toISOString()
          })
        } catch (supabaseError) {
          console.warn('Error saving to Supabase, using local storage only:', supabaseError)
        }
      }

      // Update user data local
      const users = await secureStorage.getItem('users') || []
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            invested: (u.invested || 0) + investment.amount
          }
        }
        return u
      })
      await secureStorage.setItem('users', updatedUsers)

      // Si es Pack Inicio, acreditar 10 USD bloqueados para segundo pack
      if (activePack.type === 'inicio') {
        try {
          await fetch('/api/users/credit-locked', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
            body: JSON.stringify({ amount_usd: 10 })
          })
        } catch (e) {
          // Silenciar error; el usuario podrá reportar depósito manualmente si fuese necesario
        }
      }

      // Close modal and redirect
      setShowModal(false)
      navigate('/dashboard?success=investment')
    } catch (error) {
      console.error('Error saving investment:', error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Bar */}
      <NavBar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">
            Selecciona tu <span className="gradient-text">Pack de Inversión</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Elige la opción que mejor se adapte a tus objetivos financieros
          </p>
        </div>

        {/* Pack Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* PACK INICIO */}
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Pack Inicio</h2>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent font-black text-4xl">
                Gratis
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Objetivo</p>
                  <p className="text-sm text-gray-300">Invitar 10 amigos a la plataforma</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-emerald-500/10 rounded-lg">
                <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Recompensa</p>
                  <p className="text-sm text-gray-300">Recompensa en USDT al completar</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectPack('inicio', 0)}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
            >
              Seleccionar Pack Inicio
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* PACK TRADING */}
          <div className="card hover:scale-105 transition-transform duration-300 border-2 border-green-money/30">
            <div className="absolute top-4 right-4 bg-gradient-to-r from-gold to-yellow-500 text-gray-900 font-bold px-3 py-1 rounded-full text-xs">
              ⭐ Popular
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-money to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Pack Trading</h2>
              <div className="text-2xl font-semibold text-green-money">
                10% semanal
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Investment Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Monto de Inversión (USDT)
                </label>
                <input
                  type="number"
                  min="25"
                  step="1"
                  value={tradingAmount}
                  onChange={(e) => setTradingAmount(Math.max(25, parseInt(e.target.value) || 25))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-money text-white text-lg font-bold"
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo: 25 USDT — Depósitos: solo USDT TRC20</p>
              </div>

              {/* Calculator */}
              <div className="p-4 bg-gradient-to-br from-green-money/10 to-emerald-600/10 rounded-lg border border-green-money/20">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Ganancia Semanal (equiv. USD):</span>
                    <span className="text-xl font-bold text-green-money">Estimación</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Proyección Mensual (equiv. USD):</span>
                    <span className="text-xl font-bold text-emerald-400">Estimación</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectPack('trading', tradingAmount)}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-money to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-green-money/50 transition-all flex items-center justify-center gap-2"
            >
              Invertir en Trading
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* PACK CRYPTO */}
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bitcoin className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Pack Crypto</h2>
              <div className="text-2xl font-semibold text-purple-400">
                Multiplica x3
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Investment Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Monto de Inversión
                </label>
                <input
                  type="number"
                  min="100000"
                  step="50000"
                  value={cryptoAmount}
                  onChange={(e) => setCryptoAmount(Math.max(100000, parseInt(e.target.value) || 100000))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white text-lg font-bold"
                />
                <p className="text-xs text-gray-500 mt-1">Depósitos: solo USDT TRC20</p>
              </div>

              {/* Calculator */}
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Plazo:</span>
                    <span className="text-lg font-bold text-purple-400">2 meses</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Retorno Esperado (equiv. USD):</span>
                    <span className="text-xl font-bold text-pink-400">Estimación</span>
                  </div>
                  <div className="pt-2 border-t border-purple-500/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Ganancia neta:</span>
                      <span className="text-lg font-bold text-white">Estimación (equiv. USD)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectPack('crypto', cryptoAmount)}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
            >
              Invertir en Crypto
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-semibold mb-1 text-blue-400">Información Importante</p>
              <p>Todas las inversiones están sujetas a verificación. Una vez confirmado el pago, tu inversión será activada y podrás comenzar a generar retornos.</p>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* PACK MISTERIO (bloqueado hasta completar Pack Crypto) */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Pack Misterio</h2>
            <div className="text-2xl font-semibold text-yellow-400">x3 en 3 meses</div>
            <p className="text-sm text-gray-400 mt-2">Inversión: 500 USDT</p>
          </div>

          {!hasCryptoCompleted && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-center mb-4">
              Bloqueado. Se activa automáticamente al completar el Pack Crypto.
            </div>
          )}

          <button
            disabled={!hasCryptoCompleted}
            onClick={() => hasCryptoCompleted && handleSelectPack('misterio', 500)}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              hasCryptoCompleted
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:shadow-yellow-500/50'
                : 'bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            {hasCryptoCompleted ? 'Invertir en Pack Misterio' : 'Bloqueado'}
            {hasCryptoCompleted && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <ConfirmInvestmentModal
          pack={activePack}
          onConfirm={handleConfirmInvest}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default SelectPack

