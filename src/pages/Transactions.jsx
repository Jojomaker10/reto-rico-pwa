import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Transactions() {
  const [deposits, setDeposits] = useState([])
  const [withdrawals, setWithdrawals] = useState([])

  useEffect(() => {
    ;(async () => {
      const d = await axios.get('/api/deposits/history', { headers: { 'x-user-id': 'demo-user' } })
      const w = await axios.get('/api/withdrawals/history', { headers: { 'x-user-id': 'demo-user' } })
      setDeposits(d.data)
      setWithdrawals(w.data)
    })()
  }, [])

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-bold mb-3">Depósitos</h2>
        <table className="w-full text-sm">
          <thead><tr><th>Fecha</th><th>Monto (USDT)</th><th>Estado</th><th>Hash</th></tr></thead>
          <tbody>
            {deposits.map((x) => (
              <tr key={x.id}>
                <td>{new Date(x.createdAt).toLocaleString()}</td>
                <td>{x.amount_usdt}</td>
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
          <thead><tr><th>Fecha</th><th>Monto (USDT)</th><th>Estado</th><th>Hash</th></tr></thead>
          <tbody>
            {withdrawals.map((x) => (
              <tr key={x.id}>
                <td>{new Date(x.createdAt).toLocaleString()}</td>
                <td>{x.amount_usdt}</td>
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


