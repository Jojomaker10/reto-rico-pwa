import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id',
}

interface TronTransaction {
  transaction_id: string
  value: string
  from: string
  to: string
  block_timestamp: number
  token_info?: {
    address: string
  }
}

// Función para validar dirección TRON
function isValidTronAddress(address: string): boolean {
  return /^T[0-9A-Za-z]{33}$/.test(address)
}

// Función para obtener precio USDT a USD (simplificado)
async function getUSDTtoUSD(): Promise<number> {
  // Por ahora retornamos 1.0, pero puedes integrar una API de precios
  return 1.0
}

// Función para obtener transferencias USDT de TronGrid
async function getUSDTTransfersToAddress(address: string): Promise<TronTransaction[]> {
  const base = Deno.env.get('TRON_EVENT_SERVER') || 'https://api.nileex.io'
  const usdtContract = Deno.env.get('USDT_TRON_CONTRACT') || ''
  
  if (!usdtContract) {
    console.error('USDT_TRON_CONTRACT no configurado')
    return []
  }

  const url = `${base.replace(/\/$/, '')}/v1/accounts/${address}/transactions/trc20`
  const headers: Record<string, string> = {}
  
  const tronGridKey = Deno.env.get('TRONGRID_API_KEY')
  if (tronGridKey) {
    headers['TRON-PRO-API-KEY'] = tronGridKey
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })
    
    if (!response.ok) {
      console.error(`Error fetching transfers: ${response.status}`)
      return []
    }

    const data = await response.json()
    const transfers = Array.isArray(data?.data) ? data.data : []
    
    return transfers.filter((tx: TronTransaction) => 
      String(tx.to).toUpperCase() === address.toUpperCase() &&
      String(tx.token_info?.address).toUpperCase() === usdtContract.toUpperCase()
    )
  } catch (error) {
    console.error('Error fetching USDT transfers:', error)
    return []
  }
}

// Función para obtener transacción por hash
async function getTransactionByHash(txHash: string): Promise<TronTransaction | null> {
  const base = Deno.env.get('TRON_EVENT_SERVER') || 'https://api.nileex.io'
  const headers: Record<string, string> = {}
  
  const tronGridKey = Deno.env.get('TRONGRID_API_KEY')
  if (tronGridKey) {
    headers['TRON-PRO-API-KEY'] = tronGridKey
  }

  try {
    const response = await fetch(`${base}/v1/transactions/${txHash}`, { headers })
    
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const tx = data?.data?.[0]
    
    if (!tx) return null
    
    return tx
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return null
  }
}

// Función para enviar USDT (usando API de TronGrid)
async function sendUSDT(toAddress: string, amountUSDT: number): Promise<string> {
  // Nota: Enviar USDT requiere una wallet privada
  // Esto debe hacerse desde un servicio seguro
  // Por ahora retornamos un placeholder
  
  const mainWalletPrivateKey = Deno.env.get('MAIN_WALLET_PRIVATE_KEY')
  if (!mainWalletPrivateKey) {
    throw new Error('MAIN_WALLET_PRIVATE_KEY no configurado')
  }

  // En producción, esto debería usar una API segura o un servicio separado
  // Por ahora, retornamos un error indicando que se debe implementar
  throw new Error('Función sendUSDT debe implementarse con un servicio seguro')
}

serve(async (req) => {
  // Handle CORS
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
    // Extraer el path después de /deposits/
    const fullPath = url.pathname
    const path = fullPath.replace(/^.*\/deposits/, '') || '/'
    const userId = req.headers.get('x-user-id') || url.searchParams.get('user_id')

    // GET /history - Obtener historial de depósitos
    if ((path === '/history' || path.includes('/history')) && req.method === 'GET') {
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'No autorizado' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data, error } = await supabase
        .from('deposits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify(data || []),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /request - Solicitar dirección de depósito
    if ((path === '/request' || path.includes('/request')) && req.method === 'POST') {
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'No autorizado' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Dirección USDT única por defecto (fallback)
      const defaultAddress = 'TCfSTwyseWeq3SdXMjptN2TvBHREhkJNTS'
      const mainAddress = Deno.env.get('MAIN_DEPOSIT_ADDRESS') || defaultAddress
      
      // Prioridad 1: Si existe MAIN_DEPOSIT_ADDRESS (o fallback), validarla y usarla
      if (mainAddress) {
        // Limpiar espacios en blanco si los hay
        const cleanAddress = mainAddress.trim()
        
        if (isValidTronAddress(cleanAddress)) {
          return new Response(
            JSON.stringify({ address: cleanAddress }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          console.error(`Dirección TRON inválida: ${cleanAddress} (longitud: ${cleanAddress.length})`)
        }
      }

      // Prioridad 2: Obtener dirección del usuario si existe
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('wallet_address_deposit')
        .eq('id', userId)
        .single()

      // Si el perfil existe y tiene dirección, devolverla
      if (!profileError && profile?.wallet_address_deposit) {
        const userAddress = profile.wallet_address_deposit.trim()
        if (isValidTronAddress(userAddress)) {
          return new Response(
            JSON.stringify({ address: userAddress }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      // Si llegamos aquí, usar la dirección por defecto (ya validada arriba)
      if (isValidTronAddress(defaultAddress)) {
        return new Response(
          JSON.stringify({ address: defaultAddress }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Último recurso: error
      console.error(`No se pudo obtener dirección de depósito para userId: ${userId}`)
      return new Response(
        JSON.stringify({ 
          error: 'No se pudo obtener dirección de depósito. Por favor, contacta al soporte.' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /report - Reportar transacción de depósito
    if ((path === '/report' || path.includes('/report')) && req.method === 'POST') {
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'No autorizado' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { tx_hash } = await req.json()
      
      if (!tx_hash) {
        return new Response(
          JSON.stringify({ error: 'tx_hash es requerido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Dirección USDT única por defecto (fallback)
      const defaultAddress = 'TCfSTwyseWeq3SdXMjptN2TvBHREhkJNTS'
      const mainAddress = Deno.env.get('MAIN_DEPOSIT_ADDRESS') || defaultAddress
      
      if (!mainAddress || !isValidTronAddress(mainAddress.trim())) {
        return new Response(
          JSON.stringify({ error: 'MAIN_DEPOSIT_ADDRESS no configurada o inválida' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verificar transacción en TronGrid
      const tx = await getTransactionByHash(tx_hash)
      
      if (!tx) {
        return new Response(
          JSON.stringify({ error: 'Transacción no encontrada' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Validar que sea a la dirección principal y de USDT
      const usdtContract = Deno.env.get('USDT_TRON_CONTRACT') || ''
      const isToMain = String(tx.to).toUpperCase() === mainAddress.toUpperCase()
      const isUSDT = String(tx.token_info?.address).toUpperCase() === usdtContract.toUpperCase()

      if (!isToMain || !isUSDT) {
        return new Response(
          JSON.stringify({ error: 'Transacción no válida para este depósito' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const amount_usdt = Number(tx.value || 0) / 1e6 // USDT tiene 6 decimales
      const rate = await getUSDTtoUSD()
      const amount_usd = amount_usdt * rate
      const requiredConfirmations = Number(Deno.env.get('REQUIRED_CONFIRMATIONS') || 20)

      // Verificar si ya existe
      const { data: existing } = await supabase
        .from('deposits')
        .select('id')
        .eq('tx_hash', tx_hash)
        .single()

      if (existing) {
        return new Response(
          JSON.stringify({ success: true, message: 'Transacción ya registrada' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Crear depósito
      const { data: deposit, error: depositError } = await supabase
        .from('deposits')
        .insert({
          user_id: userId,
          amount_usdt,
          amount_usd,
          tx_hash,
          status: 'confirmed',
          confirmations: requiredConfirmations,
          confirmed_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (depositError) throw depositError

      // Actualizar balance del usuario (asegurar que el perfil existe)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance_usd')
        .eq('id', userId)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // Perfil no existe, crear uno básico
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            balance_usd: amount_usd,
          })
        
        if (createError) {
          console.error('Error creando perfil:', createError)
        }
      } else if (profile) {
        const newBalance = Number(profile.balance_usd || 0) + amount_usd
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ balance_usd: newBalance })
          .eq('id', userId)
        
        if (updateError) {
          console.error('Error actualizando balance:', updateError)
        }
      }

      return new Response(
        JSON.stringify({ success: true, deposit }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Ruta no encontrada' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error en deposits function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

