import Deposit from '../../models/Deposit.js'
import User from '../../models/User.js'
import TransactionLog from '../../models/TransactionLog.js'
import { getUSDTtoUSD } from '../price.service.js'
import { getUSDTTransfersToAddress } from './tron.service.js'

export async function scanDeposits() {
  const users = await User.findAll({ where: { wallet_address_deposit: { not: null } } })

  for (const user of users) {
    if (!user.wallet_address_deposit) continue
    const transfers = await getUSDTTransfersToAddress(user.wallet_address_deposit)
    for (const t of transfers) {
      const exists = await Deposit.findOne({ where: { tx_hash: t.tx_hash } })
      if (exists) continue

      const rate = await getUSDTtoUSD()
      const dep = await Deposit.create({
        user_id: user.id,
        amount_usdt: t.amount_usdt,
        amount_usd: Number(t.amount_usdt) * rate,
        tx_hash: t.tx_hash,
        status: t.confirmed ? 'confirmed' : 'pending',
        confirmations: t.confirmations || 0,
        confirmed_at: t.confirmed ? new Date() : null,
      })

      await TransactionLog.create({ type: 'deposit', reference_id: dep.id, payload: t })

      if (t.confirmed) {
        user.balance_usd = Number(user.balance_usd) + Number(dep.amount_usd)
        await user.save()
      }
    }
  }
}

export async function updateConfirmations() {
  // Integrar confirmaciones reales vía TronGrid
}


