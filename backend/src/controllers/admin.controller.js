import { Op } from 'sequelize'
import User from '../models/User.js'
import Deposit from '../models/Deposit.js'
import Withdrawal from '../models/Withdrawal.js'

export const getStats = async (_req, res) => {
  const now = new Date()
  const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const [usersTotal, users24h, deposits24h, depositsTotal, withdrawalsPending, withdrawalsTotal] = await Promise.all([
    User.count(),
    User.count({ where: { createdAt: { [Op.gte]: since24h } } }),
    Deposit.sum('amount_usdt', { where: { createdAt: { [Op.gte]: since24h }, status: 'confirmed' } }),
    Deposit.sum('amount_usdt', { where: { status: 'confirmed' } }),
    Withdrawal.count({ where: { status: 'requested' } }),
    Withdrawal.count(),
  ])

  res.json({
    users: { total: usersTotal, last24h: users24h },
    deposits: { last24h_usdt: Number(deposits24h || 0), total_usdt: Number(depositsTotal || 0) },
    withdrawals: { pending: withdrawalsPending, total: withdrawalsTotal },
  })
}


