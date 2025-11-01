import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import useAuthStore from '../store/authStoreSupabase'

const ForgotPassword = () => {
  const { forgotPassword } = useAuthStore()
  
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('El email es obligatorio')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email inválido')
      return
    }

    setLoading(true)
    const result = await forgotPassword(email)
    setLoading(false)

    if (result.success) {
      setSuccess(true)
      setError('')
    } else {
      setError(result.error || 'Error al procesar la solicitud')
      setSuccess(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-money to-emerald-600 rounded-2xl mb-4 shadow-2xl shadow-green-money/50">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black gradient-text mb-2">Recuperar Contraseña</h1>
          <p className="text-gray-400">Ingresa tu email para recuperar acceso</p>
        </div>

        {/* Form */}
        <div className="card">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-money/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-money" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Email Enviado</h2>
              <p className="text-gray-400 mb-6">
                Se ha enviado un enlace de recuperación a <strong>{email}</strong>
              </p>
              <Link to="/login" className="btn-primary inline-block">
                Volver al Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-money text-white placeholder-gray-500"
                    placeholder="tu@email.com"
                  />
                </div>
                {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6">
            <Link to="/login" className="flex items-center gap-2 text-green-money hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Volver al Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

