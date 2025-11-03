import User from '../models/User.js'
import Deposit from '../models/Deposit.js'
import { generateDepositAddressForUser } from '../services/blockchain/tron.service.js'

export const requestDepositAddress = async (req, res) => {
  const userId = req.user?.id || req.headers['x-user-id']
  if (!userId) return res.status(401).json({ error: 'No autorizado' })
  let user = await User.findByPk(userId)
  if (!user) {
    // Auto-create placeholder user if not exists
    user = await User.create({
      id: userId,
      email: `${userId}@placeholder.local`,
      password_hash: 'external',
      balance_usd: 0
    })
  }

  if (!user.wallet_address_deposit) {
    user.wallet_address_deposit = await generateDepositAddressForUser(userId)
    await user.save()
  }
  res.json({ address: user.wallet_address_deposit })
}

export const getDepositHistory = async (req, res) => {
  const userId = req.user?.id || req.headers['x-user-id']
  if (!userId) return res.status(401).json({ error: 'No autorizado' })
  const deposits = await Deposit.findAll({ where: { user_id: userId }, order: [['createdAt', 'DESC']] })
  res.json(deposits)
}


