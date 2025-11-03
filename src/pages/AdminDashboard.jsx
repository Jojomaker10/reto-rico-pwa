import { useEffect, useState } from 'react'
import axios from 'axios'
import useAuthStore from '../store/authStoreSupabase'

export default function AdminDashboard() {
  const [pending, setPending] = useState([])
  const [stats, setStats] = useState(null)
  const { user, isAuthenticated, init } = useAuthStore()
  const isAdmin = !!user?.email && import.meta.env.VITE_ADMIN_EMAIL
    ? (user.email?.toLowerCase() === import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase())
    : false

  const load = async () => {
    const { data } = await axios.get('/api/withdrawals/admin/pending', { headers: { 'x-user-email': user.email } })
    setPending(data)
    const statsRes = await axios.get('/api/admin/stats', { headers: { 'x-user-email': user.email } })
    setStats(statsRes.data)
  }

  useEffect(() => { (async () => { await init(); if (isAuthenticated && isAdmin) load() })() }, [init, isAuthenticated, isAdmin])

  if (!isAdmin) return <div className="p-6 text-red-400">Acceso solo para administrador.</div>

  const approve = async (id) => { await axios.post(`/api/withdrawals/admin/${id}/approve`, null, { headers: { 'x-user-email': user.email } }); load() }
  const processSend = async (id) => { await axios.post(`/api/withdrawals/admin/${id}/process`, null, { headers: { 'x-user-email': user.email } }); load() }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Retiros Pendientes</h1>
      {stats && (
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="card"><div className="text-sm text-gray-400">Usuarios (24h / total)</div><div className="text-2xl font-bold">{stats.users.last24h} / {stats.users.total}</div></div>
          <div className="card"><div className="text-sm text-gray-400">Depósitos (24h / total) USDT</div><div className="text-2xl font-bold">{stats.deposits.last24h_usdt} / {stats.deposits.total_usdt}</div></div>
          <div className="card"><div className="text-sm text-gray-400">Retiros Pendientes / Total</div><div className="text-2xl font-bold">{stats.withdrawals.pending} / {stats.withdrawals.total}</div></div>
        </div>
      )}
      <table className="w-full text-sm">
        <thead><tr><th>Usuario</th><th>Monto (USDT)</th><th>Dirección</th><th>Acciones</th></tr></thead>
        <tbody>
          {pending.map(x => (
            <tr key={x.id}>
              <td>{x.user_id}</td>
              <td>{x.amount_usdt}</td>
              <td className="truncate">{x.wallet_address_destination}</td>
              <td className="space-x-2">
                <button className="px-3 py-1 bg-emerald-600 rounded" onClick={() => approve(x.id)}>Aprobar</button>
                <button className="px-3 py-1 bg-blue-600 rounded" onClick={() => processSend(x.id)}>Procesar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


