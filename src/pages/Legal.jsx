import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const Legal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <NavBar />
      <main className="pt-24 px-4 pb-20">
        <section className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-black mb-6 gradient-text">Aviso Legal</h1>
          <div className="card space-y-6 text-lg leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">1. Información General</h2>
              <p className="text-gray-300">
                Reto-Rico es una plataforma de inversión en trading y criptomonedas. Este aviso legal establece los términos y condiciones de uso del sitio web.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">2. Propiedad Intelectual</h2>
              <p className="text-gray-300">
                Todo el contenido de este sitio web, incluyendo textos, gráficos, logos, iconos y software, es propiedad de Reto-Rico y está protegido por las leyes de propiedad intelectual.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">3. Limitación de Responsabilidad</h2>
              <p className="text-gray-300">
                Reto-Rico no se hace responsable de las pérdidas financieras derivadas de inversiones. Las inversiones conllevan riesgos y los resultados pasados no garantizan resultados futuros.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">4. Enlaces Externos</h2>
              <p className="text-gray-300">
                Nuestro sitio puede contener enlaces a sitios web de terceros. No tenemos control sobre estos sitios y no somos responsables de su contenido.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">5. Modificaciones</h2>
              <p className="text-gray-300">
                Nos reservamos el derecho de modificar el contenido del sitio y este aviso legal en cualquier momento sin previo aviso.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">6. Jurisdicción</h2>
              <p className="text-gray-300">
                Este aviso legal se rige por las leyes aplicables. Cualquier disputa será resuelta en los tribunales competentes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-money">7. Contacto</h2>
              <p className="text-gray-300">
                Para consultas legales: contacto@reto-rico.com
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

export default Legal

