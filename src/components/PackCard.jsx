import { useState } from 'react'
import { Check, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStoreSupabase'

const PackCard = ({ pack, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = pack.icon
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const handleClick = () => {
    if (pack?.title?.toLowerCase().includes('inicio')) {
      if (isAuthenticated) {
        navigate('/select-pack')
      } else {
        navigate('/register')
      }
      return
    }
    // Para Pack Trading y Pack Crypto
    if (isAuthenticated) {
      navigate('/select-pack')
    } else {
      navigate('/login')
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${pack.featured ? 'lg:scale-110 shadow-2xl' : 'hover:scale-105'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Featured badge */}
      {pack.featured && (
        <div className="absolute top-6 right-6 z-20 bg-gradient-to-r from-gold to-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-full text-sm shadow-lg animate-pulse">
          ⭐ Recomendado
        </div>
      )}

      {/* Card with gradient border */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-1">
        <div className={`bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-xl p-8 h-full transition-all duration-500 ${isHovered ? 'bg-opacity-100' : 'bg-opacity-80'}`}>
          {/* Icon */}
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${pack.gradient} flex items-center justify-center mb-6 transform transition-transform duration-300 ${isHovered ? 'scale-110 rotate-3' : ''}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Title and price */}
          <h3 className="text-3xl font-bold mb-2">{pack.title}</h3>
          <div className="mb-4">
            <span className="text-sm text-gray-400">{pack.price}</span>
          </div>

          {/* Amount */}
          <div className={`inline-block bg-gradient-to-r ${pack.gradient} bg-clip-text text-transparent font-black text-4xl mb-2`}>
            {pack.amount}
          </div>
          <p className="text-gray-300 mb-8">{pack.description}</p>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {pack.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-money to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <button 
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              pack.featured
                ? 'bg-gradient-to-r from-green-money to-emerald-600 text-white hover:shadow-lg hover:shadow-green-money/50'
                : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700'
            } transform ${isHovered ? 'scale-105' : ''} active:scale-95`}
            onClick={handleClick}
          >
            {pack.cta}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${pack.gradient} opacity-0 hover:opacity-10 transition-opacity duration-500 pointer-events-none rounded-2xl`} />
    </div>
  )
}

export default PackCard

