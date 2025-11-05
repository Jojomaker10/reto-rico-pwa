import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react'
import useAuthStore from '../store/authStoreSupabase'

const Footer = () => {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleBenefitsClick = (e) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const benefitsSection = document.getElementById('benefits')
        if (benefitsSection) {
          benefitsSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const benefitsSection = document.getElementById('benefits')
      if (benefitsSection) {
        benefitsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="bg-gradient-to-b from-transparent via-gray-900/80 to-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">Reto-Rico</h3>
            <p className="text-gray-400 mb-4">
              Tu plataforma de confianza para generar ingresos extra con inversiones inteligentes.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-money transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-money transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-money transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-money transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to={isAuthenticated ? "/select-pack" : "/register"} className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Packs de Inversión
                </Link>
              </li>
              <li>
                <a 
                  href="/#benefits" 
                  onClick={handleBenefitsClick}
                  className="text-gray-400 hover:text-green-money transition-colors duration-300 cursor-pointer"
                >
                  Beneficios
                </a>
              </li>
              <li>
                <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link to="/claims" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Reclamos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-green-money" />
                <a href="mailto:contacto@reto-rico.com" className="hover:text-green-money transition-colors">
                  contacto@reto-rico.com
                </a>
              </li>
              {/* Teléfono y ubicación eliminados por solicitud */}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <p>
              © {new Date().getFullYear()} Reto-Rico. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

