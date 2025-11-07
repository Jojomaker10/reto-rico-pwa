import axios from 'axios'

// Obtener URL base de Supabase Edge Functions
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY || ''

// Determinar si estamos en desarrollo o producción
const isDev = import.meta.env.DEV

// Crear cliente axios configurado
const api = axios.create({
  baseURL: isDev 
    ? '/api' // En desarrollo, usar proxy de Vite (localhost:4000)
    : `${SUPABASE_URL}/functions/v1`, // En producción, usar Edge Functions
  headers: {
    'Content-Type': 'application/json',
    ...(isDev ? {} : {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    }),
  },
})

// Interceptor para ajustar rutas según el entorno
api.interceptors.request.use((config) => {
  // En producción con Edge Functions, necesitamos incluir el nombre de la función
  if (!isDev && config.url) {
    // Si la URL ya incluye el nombre de la función, no hacer nada
    if (!config.url.startsWith('/deposits') && 
        !config.url.startsWith('/withdrawals') && 
        !config.url.startsWith('/admin')) {
      // Determinar qué función usar basado en la ruta
      if (config.url.includes('/deposits')) {
        config.url = `/deposits${config.url.replace(/^.*\/deposits/, '')}`
      } else if (config.url.includes('/withdrawals')) {
        config.url = `/withdrawals${config.url.replace(/^.*\/withdrawals/, '')}`
      } else if (config.url.includes('/admin')) {
        config.url = `/admin${config.url.replace(/^.*\/admin/, '')}`
      }
    }
  }
  return config
})

export default api

