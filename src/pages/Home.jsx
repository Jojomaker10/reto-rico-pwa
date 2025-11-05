import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Users, Bitcoin, ArrowRight } from 'lucide-react'
import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import PackCard from '../components/PackCard'
import Benefits from '../components/Benefits'
import Footer from '../components/Footer'

const Home = () => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const packs = [
    {
      id: 1,
      title: 'Pack Inicio',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      price: 'Gratis',
      description: 'Invita 10 amigos y gana',
      amount: 'Recompensa en USDT',
      features: [
        'Sin inversión inicial',
        'Registro completamente gratuito',
        'Gana por cada referido',
        'Retiro inmediato'
      ],
      cta: 'Comenzar ahora'
    },
    {
      id: 2,
      title: 'Pack Trading',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      price: 'Retorno 10%',
      description: 'Invierte en mercado trading',
      amount: '10% semanal',
      features: [
        'Inversión flexible',
        'Retornos semanales garantizados',
        'Dashboard en tiempo real',
        'Soporte 24/7'
      ],
      cta: 'Invertir ahora',
      featured: true
    },
    {
      id: 3,
      title: 'Pack Crypto',
      icon: Bitcoin,
      gradient: 'from-purple-500 to-pink-500',
      price: 'Solo USDT TRC20',
      description: 'Deposita en USDT y multiplica x3',
      amount: 'x3 en 2 meses',
      features: [
        'Depósito mínimo 100,000 CLP',
        'Multiplicación garantizada x3',
        'Plazo de 2 meses',
        'Máxima seguridad'
      ],
      cta: 'Multiplicar'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <NavBar />
      
      {/* Hero Section */}
      <div className="pt-20">
        <Hero />
      </div>

      {/* Investment Packs Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-5xl font-bold mb-4">
            Elige tu <span className="gradient-text">Pack de Inversión</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tres opciones diseñadas para ayudarte a alcanzar tus metas financieras
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packs.map((pack, index) => (
            <PackCard key={pack.id} pack={pack} index={index} />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <div id="benefits">
        <Benefits />
      </div>

      {/* CTA Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto text-center">
        <div className="card max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a miles de personas que ya están generando ingresos con Reto-Rico
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="btn-primary inline-flex items-center gap-2 text-lg"
          >
            Crear cuenta gratis
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home

