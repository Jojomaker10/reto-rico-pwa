import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-email',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    })

    const url = new URL(req.url)
    // Extraer el path después de /admin/
    const fullPath = url.pathname
    const path = fullPath.replace(/^.*\/admin/, '') || '/'
    const userEmail = req.headers.get('x-user-email')

    // Verificar admin
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || ''
    if (!userEmail || userEmail.toLowerCase() !== adminEmail.toLowerCase()) {
      return new Response(
        JSON.stringify({ error: 'Acceso solo para administrador' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /stats - Estadísticas generales
    if ((path === '/stats' || path.includes('/stats')) && req.method === 'GET') {
      const now = new Date()
      const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()

      // Obtener estadísticas de usuarios
      const { count: usersTotal } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const { count: users24h } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', since24h)

      // Obtener estadísticas de depósitos
      const { data: deposits24hData } = await supabase
        .from('deposits')
        .select('amount_usdt')
        .eq('status', 'confirmed')
        .gte('created_at', since24h)

      const { data: depositsTotalData } = await supabase
        .from('deposits')
        .select('amount_usdt')
        .eq('status', 'confirmed')

      const deposits24h = deposits24hData?.reduce((sum, d) => sum + Number(d.amount_usdt || 0), 0) || 0
      const depositsTotal = depositsTotalData?.reduce((sum, d) => sum + Number(d.amount_usdt || 0), 0) || 0

      // Obtener estadísticas de retiros
      const { count: withdrawalsPending } = await supabase
        .from('withdrawals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'requested')

      const { count: withdrawalsTotal } = await supabase
        .from('withdrawals')
        .select('*', { count: 'exact', head: true })

      return new Response(
        JSON.stringify({
          users: { total: usersTotal || 0, last24h: users24h || 0 },
          deposits: { last24h_usdt: deposits24h, total_usdt: depositsTotal },
          withdrawals: { pending: withdrawalsPending || 0, total: withdrawalsTotal || 0 },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /users - Listar usuarios
    if ((path === '/users' || path.includes('/users')) && req.method === 'GET') {
      const search = url.searchParams.get('q') || ''
      const limit = parseInt(url.searchParams.get('limit') || '50')
      const offset = parseInt(url.searchParams.get('offset') || '0')

      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1)

      if (search) {
        query = query.ilike('email', `%${search}%`)
      }

      const { data, error, count } = await query

      if (error) throw error

      return new Response(
        JSON.stringify({ rows: data || [], total: count || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /deposits - Listar depósitos
    if ((path === '/deposits' || path.includes('/deposits')) && req.method === 'GET') {
      const status = url.searchParams.get('status') || ''
      const from = url.searchParams.get('from') || ''
      const to = url.searchParams.get('to') || ''
      const limit = parseInt(url.searchParams.get('limit') || '50')
      const offset = parseInt(url.searchParams.get('offset') || '0')

      let query = supabase
        .from('deposits')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (status) {
        query = query.eq('status', status)
      }

      if (from) {
        query = query.gte('created_at', from)
      }

      if (to) {
        query = query.lte('created_at', to)
      }

      const { data, error, count } = await query

      if (error) throw error

      return new Response(
        JSON.stringify({ rows: data || [], total: count || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /withdrawals - Listar retiros
    if ((path === '/withdrawals' || path.includes('/withdrawals')) && req.method === 'GET') {
      const status = url.searchParams.get('status') || ''
      const limit = parseInt(url.searchParams.get('limit') || '50')
      const offset = parseInt(url.searchParams.get('offset') || '0')

      let query = supabase
        .from('withdrawals')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error, count } = await query

      if (error) throw error

      return new Response(
        JSON.stringify({ rows: data || [], total: count || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Ruta no encontrada' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error en admin function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

