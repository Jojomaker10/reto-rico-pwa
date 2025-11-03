import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// Obtén estos valores desde tu proyecto en Supabase Dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase no está configurado. Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY deben estar en el archivo .env')
}

// Create Supabase client (even with empty values, it won't crash)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

export default supabase

