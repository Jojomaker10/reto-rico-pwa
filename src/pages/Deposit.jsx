import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import api from '../utils/api'
import useAuthStore from '../store/authStoreSupabase'

export default function Deposit() {
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
      } catch {}
    })()
  }, [init])

  useEffect(() => {
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
        setError('No se pudo obtener dirección de depósito')
      } finally {
        setLoading(false)
      }
    })()
  }, [isAuthenticated, user])

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Depositar USDT (TRC20)</h1>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-400">{error}</p>}
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
            {msg && <p className="text-emerald-400">{msg}</p>}
          </div>
        </div>
      )}
    </div>
  )
}


