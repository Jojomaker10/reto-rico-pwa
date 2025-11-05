import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <NavBar />
      <main className="pt-24 px-4 pb-20">
        <section className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-black mb-6 gradient-text">Política de Privacidad</h1>
          <div className="card space-y-6 text-lg leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">1. Información que Recopilamos</h2>
              <p className="text-gray-300 mb-2">
                Recopilamos información que usted nos proporciona directamente, incluyendo:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
                <li>Nombre completo</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Información de pago y transacciones</li>
                <li>Datos de inversión y retiros</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">2. Uso de la Información</h2>
              <p className="text-gray-300">
                Utilizamos su información para procesar transacciones, gestionar su cuenta, comunicarnos con usted y mejorar nuestros servicios.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">3. Protección de Datos</h2>
              <p className="text-gray-300">
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal. Utilizamos encriptación y almacenamiento seguro.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">4. Compartir Información</h2>
              <p className="text-gray-300">
                No vendemos ni compartimos su información personal con terceros, excepto cuando es necesario para proporcionar nuestros servicios o cumplir con obligaciones legales.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">5. Sus Derechos</h2>
              <p className="text-gray-300 mb-2">
                Usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
                <li>Acceder a sus datos personales</li>
                <li>Rectificar información incorrecta</li>
                <li>Solicitar la eliminación de sus datos</li>
                <li>Oponerse al procesamiento de sus datos</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">6. Cookies</h2>
              <p className="text-gray-300">
                Utilizamos cookies para mejorar su experiencia. Puede configurar su navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">7. Contacto</h2>
              <p className="text-gray-300">
                Para ejercer sus derechos o consultas sobre privacidad: contacto@reto-rico.com
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-8">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Privacy

