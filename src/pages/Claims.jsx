import { useState } from 'react'
import { Mail, Send, AlertCircle } from 'lucide-react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const Claims = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'claim'
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí puedes agregar la lógica para enviar el reclamo
    console.log('Reclamo enviado:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '', type: 'claim' })
    }, 3000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <NavBar />
      <main className="pt-24 px-4 pb-20">
        <section className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-black mb-6 gradient-text">Reclamos y Soporte</h1>
          
          <div className="card space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-blue-400">Información Importante</h3>
                  <p className="text-gray-300">
                    Para procesar su reclamo de manera eficiente, por favor proporcione toda la información relevante. 
                    Nuestro equipo de soporte responderá dentro de 24-48 horas hábiles.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-money text-white"
                  placeholder="Ingrese su nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-money text-white"
                  placeholder="su@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Reclamo *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-money text-white"
                >
                  <option value="claim">Reclamo General</option>
                  <option value="payment">Problema con Pago</option>
                  <option value="withdrawal">Problema con Retiro</option>
                  <option value="account">Problema con Cuenta</option>
                  <option value="investment">Consulta sobre Inversión</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-money text-white"
                  placeholder="Resumen breve del problema"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mensaje *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-money text-white resize-none"
                  placeholder="Describa su reclamo en detalle..."
                />
              </div>

              {submitted && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400">
                  ¡Reclamo enviado exitosamente! Nos pondremos en contacto pronto.
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-primary inline-flex items-center justify-center gap-2 text-lg py-4"
              >
                <Send className="w-5 h-5" />
                Enviar Reclamo
              </button>
            </form>

            <div className="border-t border-gray-700 pt-6 mt-6">
              <h3 className="text-xl font-bold mb-4">También puede contactarnos por:</h3>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-green-money" />
                <a href="mailto:contacto@reto-rico.com" className="hover:text-green-money transition-colors">
                  contacto@reto-rico.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Claims

