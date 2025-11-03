import User from '../models/User.js'

export const creditLocked = async (req, res) => {
  const userId = req.user?.id || req.headers['x-user-id']
  const { amount_usd } = req.body || {}
  if (!userId || !amount_usd) return res.status(400).json({ error: 'Datos inválidos' })

  let user = await User.findByPk(userId)
  if (!user) {
    user = await User.create({ id: userId, email: `${userId}@placeholder.local`, password_hash: 'external', balance_usd: 0, locked_usd: 0 })
  }

  user.balance_usd = Number(user.balance_usd || 0) + Number(amount_usd)
  user.locked_usd = Number(user.locked_usd || 0) + Number(amount_usd)
  await user.save()

  return res.json({ success: true, balance_usd: user.balance_usd, locked_usd: user.locked_usd })
}


