import axios from 'axios'

// Obtener URL base de Supabase Edge Functions
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY || ''

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

// Interceptor para agregar headers personalizados si es necesario
api.interceptors.request.use((config) => {
  // En producción, las rutas ya incluyen el path completo
  // En desarrollo, necesitamos mantener el formato /api/...
  return config
})

export default api

