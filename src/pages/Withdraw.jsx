import { useState } from 'react'
import axios from 'axios'

export default function Withdraw() {
  const [address, setAddress] = useState('')
  const [amountUSDT, setAmountUSDT] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    setErr('')
    try {
      await axios.post('/api/withdrawals/request', {
        address,
        amount_usdt: Number(amountUSDT),
        code,
      }, { headers: { 'x-user-id': 'demo-user' } })
      setMsg('Solicitud enviada. Pendiente de aprobación.')
      setAddress(''); setAmountUSDT(''); setCode('')
    } catch (e) {
      setErr(e.response?.data?.error || 'Error')
    } finally { setLoading(false) }
  }

  return (
    <form className="p-6 max-w-md space-y-4 mx-auto" onSubmit={submit}>
      <h1 className="text-2xl font-bold">Retirar USDT</h1>
      {msg && <p className="text-emerald-400">{msg}</p>}
      {err && <p className="text-red-400">{err}</p>}
      <input className="w-full p-3 rounded bg-gray-800" placeholder="Dirección TRON (TRC20)" value={address} onChange={e=>setAddress(e.target.value)} />
      <input className="w-full p-3 rounded bg-gray-800" placeholder="Monto en USDT" value={amountUSDT} onChange={e=>setAmountUSDT(e.target.value)} />
      <input className="w-full p-3 rounded bg-gray-800" placeholder="Código 2FA / Email" value={code} onChange={e=>setCode(e.target.value)} />
      <button className="btn-primary" disabled={loading}>{loading ? 'Enviando...' : 'Solicitar Retiro'}</button>
    </form>
  )
}


