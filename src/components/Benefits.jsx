import { useState, useEffect } from 'react'
import { Users, BarChart3, Shield, Zap, Target, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'
import secureStorage from '../utils/storage'

const Benefits = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalInvested: 0,
    satisfaction: 98,
    support: '24/7'
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Cargar usuarios activos desde IndexedDB
        const allUsers = await secureStorage.getItem('users') || []
        const activeUsersCount = allUsers.filter(u => (Number(u.balance) || 0) > 0 || (Number(u.invested) || 0) > 0).length
        
        // Cargar inversiones totales desde IndexedDB
        const allInvestments = await secureStorage.getItem('investments') || []
        const totalInvested = allInvestments.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0)
        
        // Intentar cargar desde Supabase también
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
        if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
          try {
            const { createClient } = await import('@supabase/supabase-js')
            const supabase = createClient(
              supabaseUrl,
              import.meta.env.VITE_SUPABASE_ANON_KEY || ''
            )
            
            // Obtener usuarios activos
            const { count: usersCount } = await supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true })
            
            // Obtener inversiones totales
            const { data: investmentsData } = await supabase
              .from('investments')
              .select('amount')
            
            const supabaseInvested = investmentsData?.reduce((sum, inv) => 
              sum + (Number(inv.amount) || 0), 0) || 0
            
            setStats({
              activeUsers: usersCount || activeUsersCount,
              totalInvested: Math.max(supabaseInvested, totalInvested),
              satisfaction: 98,
              support: '24/7'
            })
          } catch (error) {
            console.warn('Error loading from Supabase:', error)
            setStats({
              activeUsers: activeUsersCount,
              totalInvested,
              satisfaction: 98,
              support: '24/7'
            })
          }
        } else {
          setStats({
            activeUsers: activeUsersCount,
            totalInvested,
            satisfaction: 98,
            support: '24/7'
          })
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
    
    loadStats()
  }, [])

  const formatNumber = (num) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`
    return num.toString()
  }
  const benefits = [
    {
      icon: Users,
      title: 'Sistema de Referidos',
      description: 'Gana el 10% del depósito de cada persona que invites a la plataforma',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Dashboard Personal',
      description: 'Monitorea tus inversiones en tiempo real con análisis detallados',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Seguridad Garantizada',
      description: 'Protección de datos y transacciones con tecnología blockchain',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Opciones Flexibles',
      description: 'Elige el pack que mejor se adapte a tu perfil de inversor',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Target,
      title: 'Retornos Claros',
      description: 'Plazos y rendimientos definidos desde el primer día',
      gradient: 'from-green-money to-gold'
    },
    {
      icon: DollarSign,
      title: 'Retiros Rápidos',
      description: 'Retira tus ganancias cuando lo necesites, sin complicaciones',
      gradient: 'from-cyan-500 to-blue-500'
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Beneficios <span className="gradient-text">Exclusivos</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Todo lo que necesitas para hacer crecer tu dinero de forma inteligente
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="group card hover:scale-105"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.description}</p>

                {/* Decorative element */}
                <div className={`mt-6 w-20 h-1 bg-gradient-to-r ${benefit.gradient} rounded-full transform transition-all duration-300 group-hover:w-full`} />
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-black gradient-text mb-2">
              {stats.activeUsers > 0 ? `+${stats.activeUsers.toLocaleString()}` : '0'}
            </div>
            <div className="text-gray-400">Usuarios Activos</div>
          </div>
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-black gradient-text mb-2">
              {formatNumber(stats.totalInvested)}
            </div>
            <div className="text-gray-400">Invertido</div>
          </div>
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-black gradient-text mb-2">{stats.satisfaction}%</div>
            <div className="text-gray-400">Satisfacción</div>
          </div>
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-black gradient-text mb-2">{stats.support}</div>
            <div className="text-gray-400">Soporte</div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 card max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">
            ¿Por qué elegir Reto-Rico?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-money flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-1">Registros Asegurados</h4>
                <p className="text-gray-400">Cada inversión está protegida por seguros de alta cobertura</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-money flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-1">Sin Comisiones Ocultas</h4>
                <p className="text-gray-400">Transparencia total en todos los costos y comisiones</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-money flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-1">Asesores Certificados</h4>
                <p className="text-gray-400">Equipo de expertos financieros disponibles para ayudarte</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-money flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-1">Resultados Comprobados</h4>
                <p className="text-gray-400">Miles de casos de éxito respaldan nuestros métodos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Benefits

