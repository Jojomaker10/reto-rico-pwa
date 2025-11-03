import Deposit from '../models/Deposit.js'
import User from '../models/User.js'
import { getUSDTtoUSD } from '../services/price.service.js'
import axios from 'axios'
import 'dotenv/config'

export const reportDepositTx = async (req, res) => {
  const userId = req.user?.id || req.headers['x-user-id']
  const { tx_hash } = req.body || {}
  if (!userId || !tx_hash) return res.status(400).json({ error: 'Datos inválidos' })

  const mainAddress = process.env.MAIN_DEPOSIT_ADDRESS
  if (!mainAddress) return res.status(500).json({ error: 'MAIN_DEPOSIT_ADDRESS no configurada' })

  const base = process.env.TRON_EVENT_SERVER || 'https://api.nileex.io'
  const headers = {}
  if (process.env.TRONGRID_API_KEY) headers['TRON-PRO-API-KEY'] = process.env.TRONGRID_API_KEY

  try {
    const { data } = await axios.get(`${base.replace(/\/$/, '')}/v1/transactions/${tx_hash}`, { headers })
    const tx = data?.data?.[0]
    if (!tx) return res.status(404).json({ error: 'Transacción no encontrada' })

    const toAddress = String(tx.to || tx.to_address || '').toUpperCase()
    const tokenContract = String(tx.token_info?.address || '').toUpperCase()
    const expectedTo = String(mainAddress).toUpperCase()
    const expectedToken = String(process.env.USDT_TRON_CONTRACT).toUpperCase()

    if (toAddress !== expectedTo || tokenContract !== expectedToken) {
      return res.status(400).json({ error: 'Transacción no válida para este depósito' })
    }

    const amount_usdt = Number(tx.value || 0) / 1e6
    const confirmations = Number(process.env.REQUIRED_CONFIRMATIONS || 20)
    const rate = await getUSDTtoUSD()

    const exists = await Deposit.findOne({ where: { tx_hash } })
    if (exists) return res.json({ success: true, message: 'Transacción ya registrada' })

    const dep = await Deposit.create({
      user_id: userId,
      amount_usdt,
      amount_usd: amount_usdt * rate,
      tx_hash,
      status: 'confirmed',
      confirmations,
      confirmed_at: new Date(),
    })

    const user = await User.findByPk(userId)
    if (user) {
      user.balance_usd = Number(user.balance_usd || 0) + dep.amount_usd
      await user.save()
    }

    return res.json({ success: true, deposit: dep })
  } catch (e) {
    return res.status(500).json({ error: 'Error verificando transacción' })
  }
}


