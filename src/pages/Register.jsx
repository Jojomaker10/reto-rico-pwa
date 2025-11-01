import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, Eye, EyeOff, Gift, CheckCircle } from 'lucide-react'
import useAuthStore from '../store/authStoreSupabase'

const Register = () => {
  const navigate = useNavigate()
  const { register, checkReferralCode, isAuthenticated } = useAuthStore()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [referralValid, setReferralValid] = useState(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  // Validate referral code in real-time
  useEffect(() => {
    if (formData.referralCode && formData.referralCode.length === 6) {
      checkReferralCode(formData.referralCode).then(result => {
        setReferralValid(result.exists)
      })
    } else {
      setReferralValid(null)
    }
  }, [formData.referralCode, checkReferralCode])

  const validateField = (name, value) => {
    let error = ''

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'El nombre es obligatorio'
        } else if (value.trim().length < 3) {
          error = 'El nombre debe tener al menos 3 caracteres'
        }
        break
      case 'email':
        if (!value) {
          error = 'El email es obligatorio'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email inválido'
        }
        break
      case 'phone':
        if (!value) {
          error = 'El teléfono es obligatorio'
        } else if (!/^\+?[1-9]\d{8,14}$/.test(value.replace(/\s/g, ''))) {
          error = 'Teléfono inválido'
        }
        break
      case 'password':
        if (!value) {
          error = 'La contraseña es obligatoria'
        } else if (value.length < 6) {
          error = 'La contraseña debe tener al menos 6 caracteres'
        }
        break
      case 'confirmPassword':
        if (!value) {
          error = 'Confirma tu contraseña'
        } else if (value !== formData.password) {
          error = 'Las contraseñas no coinciden'
        }
        break
      default:
        break
    }

    return error
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Real-time validation
    if (errors[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })

    if (!acceptedTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    
    const { name, email, phone, password, referralCode } = formData
    const result = await register({
      name,
      email,
      phone,
      password,
      referredBy: referralCode || null
    })

    setLoading(false)

    if (result.success) {
      navigate('/select-pack')
    } else {
      setErrors({ submit: result.error || 'Error al registrar usuario' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-money to-emerald-600 rounded-2xl mb-4 shadow-2xl shadow-green-money/50">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black gradient-text mb-2">Únete a Reto-Rico</h1>
          <p className="text-gray-400">Crea tu cuenta y comienza a generar ingresos</p>
        </div>

        {/* Register Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-money text-white placeholder-gray-500"
                  placeholder="Juan Pérez"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

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
                  onBlur={handleBlur}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-money text-white placeholder-gray-500"
                  placeholder="juan@ejemplo.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-money text-white placeholder-gray-500"
                  placeholder="+56 9 1234 5678"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
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
                  onBlur={handleBlur}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-11 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-money text-white placeholder-gray-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
            </div>

            {/* Referral Code */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Código de Referido <span className="text-gray-500">(Opcional)</span>
              </label>
              <div className="relative">
                <Gift className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-green-money text-white placeholder-gray-500 uppercase"
                  placeholder="ABC123"
                  maxLength={6}
                />
                {referralValid && (
                  <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-money" />
                )}
              </div>
              {referralValid === false && formData.referralCode.length === 6 && (
                <p className="mt-1 text-sm text-red-400">Código de referido inválido</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 bg-gray-800 border-gray-700 rounded focus:ring-green-money focus:ring-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                Acepto los{' '}
                <Link to="/terms" className="text-green-money hover:underline">
                  términos y condiciones
                </Link>
                {' '}y la{' '}
                <Link to="/privacy" className="text-green-money hover:underline">
                  política de privacidad
                </Link>
              </label>
            </div>
            {errors.terms && <p className="text-sm text-red-400">{errors.terms}</p>}

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
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-green-money hover:underline font-medium">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

