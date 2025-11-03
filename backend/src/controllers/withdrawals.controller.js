import 'dotenv/config'
import User from '../models/User.js'
import Withdrawal from '../models/Withdrawal.js'
import { getUSDTtoUSD } from '../services/price.service.js'
import { isValidTronAddress, sendUSDT } from '../services/blockchain/tron.service.js'

export const requestWithdrawal = async (req, res) => {
  const userId = req.user?.id || req.headers['x-user-id']
  if (!userId) return res.status(401).json({ error: 'No autorizado' })
  const { address, amount_usd } = req.body || {}
  if (!address || !amount_usd) return res.status(400).json({ error: 'Datos inválidos' })

  const user = await User.findByPk(userId)
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

  const min = Number(process.env.WITHDRAW_MIN_USDT || 10)
  const fee = Number(process.env.WITHDRAW_FEE_USDT || 1.2)

  if (!isValidTronAddress(address)) return res.status(400).json({ error: 'Dirección TRON inválida' })
  if (Number(user.balance_usd) < Number(amount_usd)) return res.status(400).json({ error: 'Saldo insuficiente' })

  const rate = await getUSDTtoUSD()
  const amount_usdt = Number(amount_usd) / rate
  if (amount_usdt < min) return res.status(400).json({ error: `Monto mínimo de retiro: ${min} USDT` })

  const wd = await Withdrawal.create({
    user_id: user.id,
    wallet_address_destination: address,
    amount_usdt,
    amount_usd,
    fee,
    status: 'requested',
  })

  res.json({ success: true, withdrawal: wd })
}

export const getWithdrawalHistory = async (req, res) => {
  const userId = req.user?.id || req.headers['x-user-id']
  if (!userId) return res.status(401).json({ error: 'No autorizado' })
  const withdrawals = await Withdrawal.findAll({ where: { user_id: userId }, order: [['createdAt', 'DESC']] })
  res.json(withdrawals)
}

export const adminListPending = async (_req, res) => {
  const list = await Withdrawal.findAll({ where: { status: 'requested' }, order: [['createdAt', 'ASC']] })
  res.json(list)
}

export const adminApprove = async (req, res) => {
  const { id } = req.params
  const wd = await Withdrawal.findByPk(id)
  if (!wd || wd.status !== 'requested') return res.status(400).json({ error: 'Solicitud inválida' })
  wd.status = 'approved'
  wd.approved_at = new Date()
  await wd.save()
  res.json({ success: true })
}

export const adminProcessSend = async (req, res) => {
  const { id } = req.params
  const wd = await Withdrawal.findByPk(id)
  if (!wd || wd.status !== 'approved') return res.status(400).json({ error: 'Estado inválido' })
  wd.status = 'processing'
  await wd.save()
  try {
    const tx = await sendUSDT(wd.wallet_address_destination, Number(wd.amount_usdt) - Number(wd.fee))
    wd.tx_hash = tx
    wd.status = 'completed'
    wd.completed_at = new Date()
    await wd.save()

    const user = await User.findByPk(wd.user_id)
    user.balance_usd = Number(user.balance_usd) - Number(wd.amount_usd)
    await user.save()

    res.json({ success: true, tx_hash: tx })
  } catch (e) {
    wd.status = 'approved'
    await wd.save()
    res.status(500).json({ error: 'Error enviando USDT' })
  }
}


