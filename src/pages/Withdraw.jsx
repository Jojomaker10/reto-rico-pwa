import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import useAuthStore from '../store/authStoreSupabase'
import NavBar from '../components/NavBar'

export default function Withdraw() {
  const navigate = useNavigate()
  const { user, isAuthenticated, init } = useAuthStore()
  const [address, setAddress] = useState('')
  const [amountUSDT, setAmountUSDT] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

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

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    setErr('')
    try {
      await api.post('/withdrawals/request', {
        address,
        amount_usdt: Number(amountUSDT),
        code,
      }, { headers: { 'x-user-id': user?.id } })
      setMsg('Solicitud enviada. Pendiente de aprobación.')
      setAddress(''); setAmountUSDT(''); setCode('')
    } catch (e) {
      setErr(e.response?.data?.error || 'Error')
    } finally { setLoading(false) }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <NavBar />
      <div className="pt-24 pb-20 px-4">
        <form className="max-w-md mx-auto space-y-4" onSubmit={submit}>
          <h1 className="text-2xl font-bold">Retirar USDT</h1>
      {msg && (
        <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
          <p className="text-green-200 text-sm">{msg}</p>
        </div>
      )}
      {err && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
          <p className="text-red-200 text-sm">{err}</p>
        </div>
      )}
          <input className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-green-money" placeholder="Dirección TRON (TRC20)" value={address} onChange={e=>setAddress(e.target.value)} />
          <input className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-green-money" type="number" placeholder="Monto en USDT" value={amountUSDT} onChange={e=>setAmountUSDT(e.target.value)} />
          <input className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-green-money" placeholder="Código 2FA / Email" value={code} onChange={e=>setCode(e.target.value)} />
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Enviando...' : 'Solicitar Retiro'}</button>
        </form>
      </div>
    </div>
  )
}


