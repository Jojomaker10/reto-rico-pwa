import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminDashboard() {
  const [pending, setPending] = useState([])

  const load = async () => {
    const { data } = await axios.get('/api/withdrawals/admin/pending')
    setPending(data)
  }

  useEffect(() => { load() }, [])

  const approve = async (id) => { await axios.post(`/api/withdrawals/admin/${id}/approve`); load() }
  const processSend = async (id) => { await axios.post(`/api/withdrawals/admin/${id}/process`); load() }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Retiros Pendientes</h1>
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


