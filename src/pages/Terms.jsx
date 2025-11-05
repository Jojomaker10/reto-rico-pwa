import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <NavBar />
      <main className="pt-24 px-4 pb-20">
        <section className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-black mb-6 gradient-text">Términos y Condiciones</h1>
          <div className="card space-y-6 text-lg leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">1. Aceptación de los Términos</h2>
              <p className="text-gray-300">
                Al acceder y utilizar Reto-Rico, usted acepta cumplir con estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">2. Servicios Ofrecidos</h2>
              <p className="text-gray-300">
                Reto-Rico ofrece plataformas de inversión en trading y criptomonedas. Los servicios incluyen diferentes packs de inversión con retornos y plazos específicos.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">3. Registro y Cuenta</h2>
              <p className="text-gray-300">
                Para utilizar nuestros servicios, debe registrarse y crear una cuenta. Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">4. Inversiones y Retornos</h2>
              <p className="text-gray-300">
                Las inversiones están sujetas a verificación. Los retornos mencionados son estimaciones basadas en condiciones de mercado. No garantizamos retornos específicos, ya que los mercados financieros son volátiles.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">5. Pagos y Retiros</h2>
              <p className="text-gray-300">
                Los pagos se realizan mediante USDT TRC20. Los retiros están sujetos a verificación y pueden tardar hasta 48 horas en procesarse. Aplican comisiones según el método de pago.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">6. Responsabilidades del Usuario</h2>
              <p className="text-gray-300">
                Usted se compromete a proporcionar información precisa y actualizada. Es responsable de mantener la seguridad de su cuenta y notificar inmediatamente cualquier uso no autorizado.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">7. Modificaciones</h2>
              <p className="text-gray-300">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor al publicarse en esta página.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">8. Contacto</h2>
              <p className="text-gray-300">
                Para preguntas sobre estos términos, contacte a: contacto@reto-rico.com
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

export default Terms

