import { useEffect, useState } from 'react'
import api from '../utils/api'
import useAuthStore from '../store/authStoreSupabase'

export default function Transactions() {
  const [deposits, setDeposits] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const { user } = useAuthStore()

  useEffect(() => {
    ;(async () => {
      if (!user?.id) return
      const d = await api.get('/deposits/history', { headers: { 'x-user-id': user.id } })
      const w = await api.get('/withdrawals/history', { headers: { 'x-user-id': user.id } })
      setDeposits(d.data)
      setWithdrawals(w.data)
    })()
  }, [user])

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-bold mb-3">Depósitos</h2>
        <table className="w-full text-sm">
          <thead><tr><th>Fecha</th><th>Monto</th><th>Estado</th><th>Hash</th></tr></thead>
          <tbody>
            {deposits.map((x) => (
              <tr key={x.id}>
                <td>{new Date(x.created_at || x.createdAt).toLocaleString()}</td>
                <td>
                  <div className="font-semibold">{Number(x.amount_usdt).toFixed(6)} USDT</div>
                  <div className="text-gray-400 text-xs">≈ {Number(x.amount_usd).toFixed(2)} USD</div>
                </td>
                <td>{x.status}</td>
                <td><a className="text-blue-400" href={`https://tronscan.org/#/transaction/${x.tx_hash}`} target="_blank">Ver</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-3">Retiros</h2>
        <table className="w-full text-sm">
          <thead><tr><th>Fecha</th><th>Monto</th><th>Estado</th><th>Hash</th></tr></thead>
          <tbody>
            {withdrawals.map((x) => (
              <tr key={x.id}>
                <td>{new Date(x.created_at || x.createdAt).toLocaleString()}</td>
                <td>
                  <div className="font-semibold">{Number(x.amount_usdt).toFixed(6)} USDT</div>
                  <div className="text-gray-400 text-xs">≈ {Number(x.amount_usd).toFixed(2)} USD</div>
                </td>
                <td>{x.status}</td>
                <td>{x.tx_hash ? <a className="text-blue-400" href={`https://tronscan.org/#/transaction/${x.tx_hash}`} target="_blank">Ver</a> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


