import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import api from '../utils/api'
import useAuthStore from '../store/authStoreSupabase'
import NavBar from '../components/NavBar'

export default function Deposit() {
  const navigate = useNavigate()
  const { user, isAuthenticated, init } = useAuthStore()
  const [address, setAddress] = useState('')
  const [qr, setQr] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [txHash, setTxHash] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        await init()
        if (!isAuthenticated) {
          navigate('/login')
          return
        }
      } catch {}
    })()
  }, [init, isAuthenticated, navigate])

  useEffect(() => {
    if (!isAuthenticated) return
    ;(async () => {
      try {
        setLoading(true)
        if (!isAuthenticated || !user?.id) {
          setError('Debes iniciar sesión para obtener tu dirección de depósito.')
          setLoading(false)
          return
        }
        const { data } = await api.post('/deposits/request', null, { headers: { 'x-user-id': user.id } })
        setAddress(data.address)
        setQr(await QRCode.toDataURL(data.address))
      } catch (e) {
        const errorMessage = e.response?.data?.error || 'No se pudo obtener dirección de depósito'
        setError(errorMessage)
        console.error('Error obteniendo dirección de depósito:', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <NavBar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Depositar USDT (TRC20)</h1>
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin w-12 h-12 border-4 border-green-money border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Cargando...</p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl mb-4">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}
      {address && (
        <div className="space-y-4">
          {qr && <img src={qr} alt="QR" className="w-48 h-48" />}
          <div className="flex items-center gap-2">
            <code className="bg-gray-800 px-3 py-2 rounded break-all">{address}</code>
            <button className="btn-primary" onClick={() => navigator.clipboard.writeText(address)}>Copiar</button>
          </div>
          <p className="text-sm text-gray-400">Envía únicamente USDT TRC20 a esta dirección.</p>
          <div className="mt-6 space-y-3">
            <h2 className="text-lg font-semibold">¿Ya enviaste tu depósito?</h2>
            <input className="w-full p-3 rounded bg-gray-800" placeholder="Pega aquí el hash de la transacción (txid)" value={txHash} onChange={e=>setTxHash(e.target.value)} />
            <button
              className="btn-primary"
              onClick={async () => {
                try {
                  setMsg(''); setError('')
                  if (!txHash) { setError('Ingresa el hash de la transacción'); return }
                  await api.post('/deposits/report', { tx_hash: txHash }, { headers: { 'x-user-id': user.id } })
                  setMsg('Depósito verificado y acreditado.')
                  setTxHash('')
                } catch (e) {
                  setError(e.response?.data?.error || 'No se pudo verificar la transacción')
                }
              }}
            >
              Confirmar depósito
            </button>
            {msg && (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                <p className="text-green-200 text-sm">{msg}</p>
              </div>
            )}
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  )
}


