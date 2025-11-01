import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, DollarSign } from 'lucide-react'
import useAuthStore from '../store/authStore'

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    const result = await login(formData.email, formData.password, rememberMe)
    setLoading(false)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setErrors({ submit: result.error || 'Error al iniciar sesión' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-money to-emerald-600 rounded-2xl mb-4 shadow-2xl shadow-green-money/50">
            <DollarSign className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black gradient-text mb-2">Bienvenido</h1>
          <p className="text-gray-400">Inicia sesión en tu cuenta Reto-Rico</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-money text-white placeholder-gray-500"
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-money text-white placeholder-gray-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 bg-gray-800 border-gray-700 rounded focus:ring-green-money focus:ring-2"
                />
                <span className="text-sm text-gray-300">Recordarme</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-green-money hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-sm text-red-400">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-green-money hover:underline font-medium">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

