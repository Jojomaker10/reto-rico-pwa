import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSign, TrendingUp, ArrowRight } from 'lucide-react'

const Hero = () => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative flex items-center justify-center overflow-hidden py-20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-money/20 via-emerald-600/10 to-gold/20 animate-pulse" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-money/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gold/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-emerald-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Logo and brand */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-money to-emerald-600 rounded-2xl mb-6 shadow-2xl shadow-green-money/50 transform hover:scale-110 transition-transform duration-300">
            <DollarSign className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-7xl md:text-8xl font-black mb-4 bg-gradient-to-r from-green-money via-emerald-400 to-gold bg-clip-text text-transparent">
            RETO-RICO
          </h1>
          <p className="text-3xl md:text-4xl font-bold text-gray-200 mb-2">
            Tu camino hacia ingresos extra
          </p>
          <p className="text-xl text-gray-400">
            Construye tu futuro financiero hoy
          </p>
        </div>

        {/* Hero content */}
        <div className={`mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-2xl md:text-3xl font-semibold mb-8 max-w-3xl mx-auto leading-relaxed">
            Genera ingresos reales con nuestros{' '}
            <span className="gradient-text">packs de inversión</span> diseñados para ti
          </p>
          
          {/* Features highlight */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <TrendingUp className="w-5 h-5 text-green-money" />
              <span className="font-medium">Retornos Garantizados</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <DollarSign className="w-5 h-5 text-gold" />
              <span className="font-medium">Gana Hasta x3</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/register')}
            className="btn-primary inline-flex items-center gap-3 text-xl px-12 py-6"
          >
            <span>Empieza ahora gratis</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero

