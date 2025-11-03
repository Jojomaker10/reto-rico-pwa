import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <NavBar />
      <main className="pt-24 px-4">
        <section className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-black mb-6 gradient-text">Quiénes Somos</h1>
          <div className="card space-y-4 text-lg leading-relaxed">
            <p>
              En Reto-Rico multiplicamos el dinero de nuestros miembros gracias al poder del trading internacional. Somos un grupo de traders profesionales con años de experiencia en el mercado de criptomonedas.
            </p>
            <p>
              Invertimos de forma inteligente, diversificada y en tiempo real, operando desde varios países para aprovechar las mejores oportunidades del mercado global.
            </p>
            <p>
              Cada dólar se mueve estratégicamente, con gestión de riesgo y análisis técnico, para lograr un crecimiento sólido y constante. Es más que una inversión, somos una comunidad global de crecimiento.
            </p>
            <p>
              Cuando te unes, no solo haces crecer tu dinero… te unes a personas que creen en la educación financiera, la libertad económica y el poder de construir juntos. Miles ya están viendo resultados.
            </p>
            <p>
              Hoy, tu dinero puede estar durmiendo… o puede estar trabajando por ti.
            </p>
            <p className="text-2xl font-bold text-center mt-6">
              💎 Reto-Rico — Donde la unión multiplica.
            </p>
          </div>
        </section>
      </main>
      <div className="mt-16" />
      <Footer />
    </div>
  )
}

export default About


