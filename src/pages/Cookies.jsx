import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const Cookies = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <NavBar />
      <main className="pt-24 px-4 pb-20">
        <section className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-black mb-6 gradient-text">Política de Cookies</h1>
          <div className="card space-y-6 text-lg leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">¿Qué son las Cookies?</h2>
              <p className="text-gray-300">
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Nos ayudan a mejorar su experiencia y a entender cómo utiliza nuestro sitio.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">Tipos de Cookies que Utilizamos</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-400">Cookies Esenciales</h3>
                  <p className="text-gray-300">
                    Son necesarias para el funcionamiento básico del sitio. Incluyen autenticación de usuarios y sesiones.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-400">Cookies de Funcionalidad</h3>
                  <p className="text-gray-300">
                    Permiten recordar sus preferencias y personalizar su experiencia.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-400">Cookies Analíticas</h3>
                  <p className="text-gray-300">
                    Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">Gestión de Cookies</h2>
              <p className="text-gray-300">
                Puede configurar su navegador para aceptar o rechazar cookies. Sin embargo, algunas funcionalidades del sitio pueden no funcionar correctamente si desactiva las cookies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">Cookies de Terceros</h2>
              <p className="text-gray-300">
                Algunos servicios de terceros pueden colocar cookies en su dispositivo. No tenemos control sobre estas cookies y recomendamos revisar las políticas de privacidad de estos servicios.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">Actualizaciones</h2>
              <p className="text-gray-300">
                Esta política puede actualizarse periódicamente. Le recomendamos revisarla regularmente.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">Contacto</h2>
              <p className="text-gray-300">
                Para más información sobre nuestras cookies: contacto@reto-rico.com
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

export default Cookies

