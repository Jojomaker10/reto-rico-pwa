import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
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
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-money transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-money transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-money transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-money transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Packs de Inversión
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Beneficios
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Registrarse
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Política de Cookies
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Aviso Legal
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-money transition-colors duration-300">
                  Reclamos
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-green-money" />
                <span>contacto@reto-rico.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-green-money" />
                <span>+56 9 1234 5678</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-green-money flex-shrink-0" />
                <span>Santiago, Chile</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <p>
              © {new Date().getFullYear()} Reto-Rico. Todos los derechos reservados.
            </p>
            <p className="flex items-center gap-2">
              Hecho con <span className="text-red-500">♥</span> en Chile
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

