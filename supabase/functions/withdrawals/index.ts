import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id, x-user-email',
}

// Función para validar dirección TRON
function isValidTronAddress(address: string): boolean {
  return /^T[0-9A-Za-z]{33}$/.test(address)
}

// Función para obtener precio USDT a USD
async function getUSDTtoUSD(): Promise<number> {
  return 1.0
}

// Función para enviar USDT (simplificada - requiere implementación segura)
async function sendUSDT(toAddress: string, amountUSDT: number): Promise<string> {
  // Nota: Esta función debe implementarse de forma segura
  // usando un servicio que maneje la wallet privada
  throw new Error('Función sendUSDT debe implementarse con un servicio seguro')
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
    // Extraer el path después de /withdrawals/
    const fullPath = url.pathname
    const path = fullPath.replace(/^.*\/withdrawals/, '') || '/'
    const userId = req.headers.get('x-user-id')
    const userEmail = req.headers.get('x-user-email')

    // GET /history - Obtener historial de retiros
    if ((path === '/history' || path.includes('/history')) && req.method === 'GET') {
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'No autorizado' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify(data || []),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /request - Solicitar retiro
    if ((path === '/request' || path.includes('/request')) && req.method === 'POST') {
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'No autorizado' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { address, amount_usdt, code } = await req.json()

      if (!address || !amount_usdt) {
        return new Response(
          JSON.stringify({ error: 'Datos inválidos' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Validar dirección
      if (!isValidTronAddress(address)) {
        return new Response(
          JSON.stringify({ error: 'Dirección TRON inválida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const min = Number(Deno.env.get('WITHDRAW_MIN_USDT') || 10)
      const fee = Number(Deno.env.get('WITHDRAW_FEE_USDT') || 1.2)

      if (Number(amount_usdt) < min) {
        return new Response(
          JSON.stringify({ error: `Monto mínimo de retiro: ${min} USDT` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Obtener usuario
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance_usd, locked_usd')
        .eq('id', userId)
        .single()

      if (profileError || !profile) {
        return new Response(
          JSON.stringify({ error: 'Usuario no encontrado' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const rate = await getUSDTtoUSD()
      const amount_usd = Number(amount_usdt) * rate

      // Validar saldo disponible
      const totalUsd = Number(profile.balance_usd || 0)
      const lockedUsd = Number(profile.locked_usd || 0)
      const availableUsd = totalUsd - lockedUsd

      if (availableUsd < amount_usd) {
        return new Response(
          JSON.stringify({ 
            error: `Saldo insuficiente. Disponible para retirar: ${availableUsd.toFixed(2)} USD` 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Crear solicitud de retiro
      const { data: withdrawal, error: withdrawalError } = await supabase
        .from('withdrawals')
        .insert({
          user_id: userId,
          wallet_address_destination: address,
          amount_usdt: Number(amount_usdt),
          amount_usd,
          fee,
          status: 'requested',
        })
        .select()
        .single()

      if (withdrawalError) throw withdrawalError

      return new Response(
        JSON.stringify({ success: true, withdrawal }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /admin/pending - Listar retiros pendientes (admin)
    if ((path === '/admin/pending' || path.includes('/admin/pending')) && req.method === 'GET') {
      const adminEmail = Deno.env.get('ADMIN_EMAIL') || ''
      
      if (!userEmail || userEmail.toLowerCase() !== adminEmail.toLowerCase()) {
        return new Response(
          JSON.stringify({ error: 'Acceso solo para administrador' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('status', 'requested')
        .order('created_at', { ascending: true })

      if (error) throw error

      return new Response(
        JSON.stringify(data || []),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /admin/:id/approve - Aprobar retiro (admin)
    if (path.includes('/admin') && path.includes('/approve') && req.method === 'POST') {
      const adminEmail = Deno.env.get('ADMIN_EMAIL') || ''
      
      if (!userEmail || userEmail.toLowerCase() !== adminEmail.toLowerCase()) {
        return new Response(
          JSON.stringify({ error: 'Acceso solo para administrador' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const id = path.split('/').pop()?.replace('/approve', '') || url.searchParams.get('id')
      
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'ID requerido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: withdrawal, error: withdrawalError } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('id', id)
        .single()

      if (withdrawalError || !withdrawal) {
        return new Response(
          JSON.stringify({ error: 'Solicitud no encontrada' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (withdrawal.status !== 'requested') {
        return new Response(
          JSON.stringify({ error: 'Estado inválido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { error: updateError } = await supabase
        .from('withdrawals')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (updateError) throw updateError

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /admin/:id/process - Procesar y enviar retiro (admin)
    if (path.includes('/admin') && path.includes('/process') && req.method === 'POST') {
      const adminEmail = Deno.env.get('ADMIN_EMAIL') || ''
      
      if (!userEmail || userEmail.toLowerCase() !== adminEmail.toLowerCase()) {
        return new Response(
          JSON.stringify({ error: 'Acceso solo para administrador' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const id = path.split('/').pop()?.replace('/process', '') || url.searchParams.get('id')
      
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'ID requerido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: withdrawal, error: withdrawalError } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('id', id)
        .single()

      if (withdrawalError || !withdrawal) {
        return new Response(
          JSON.stringify({ error: 'Solicitud no encontrada' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (withdrawal.status !== 'approved') {
        return new Response(
          JSON.stringify({ error: 'Estado inválido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Actualizar a processing
      await supabase
        .from('withdrawals')
        .update({ status: 'processing' })
        .eq('id', id)

      try {
        // Enviar USDT (esto debe implementarse de forma segura)
        const amountToSend = Number(withdrawal.amount_usdt) - Number(withdrawal.fee)
        const txHash = await sendUSDT(withdrawal.wallet_address_destination, amountToSend)

        // Actualizar como completado
        const { error: updateError } = await supabase
          .from('withdrawals')
          .update({
            status: 'completed',
            tx_hash: txHash,
            completed_at: new Date().toISOString(),
          })
          .eq('id', id)

        if (updateError) throw updateError

        // Descontar balance del usuario
        const { data: profile } = await supabase
          .from('profiles')
          .select('balance_usd')
          .eq('id', withdrawal.user_id)
          .single()

        if (profile) {
          const newBalance = Number(profile.balance_usd || 0) - Number(withdrawal.amount_usd)
          await supabase
            .from('profiles')
            .update({ balance_usd: newBalance })
            .eq('id', withdrawal.user_id)
        }

        return new Response(
          JSON.stringify({ success: true, tx_hash: txHash }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        // Revertir a approved si falla
        await supabase
          .from('withdrawals')
          .update({ status: 'approved' })
          .eq('id', id)

        return new Response(
          JSON.stringify({ error: 'Error enviando USDT: ' + error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Ruta no encontrada' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error en withdrawals function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

