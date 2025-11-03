import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import axios from 'axios'

export default function Deposit() {
  const [address, setAddress] = useState('')
  const [qr, setQr] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const { data } = await axios.post('/api/deposits/request', null, { headers: { 'x-user-id': 'demo-user' } })
        setAddress(data.address)
        setQr(await QRCode.toDataURL(data.address))
      } catch (e) {
        setError('No se pudo obtener dirección de depósito')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

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
        </div>
      )}
    </div>
  )
}


