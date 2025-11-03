import { tronWeb } from '../../config/tron.js'
import 'dotenv/config'

const USDT_CONTRACT = process.env.USDT_TRON_CONTRACT

export function isValidTronAddress(address) {
  try {
    return tronWeb.isAddress(address)
  } catch {
    return false
  }
}

export async function generateDepositAddressForUser() {
  const account = await tronWeb.createAccount()
  return account.address.base58
}

export async function sendUSDT(toAddress, amountUSDT) {
  const contract = await tronWeb.contract().at(USDT_CONTRACT)
  const amount = tronWeb.toBigNumber(Math.round(Number(amountUSDT) * 1e6))
  const tx = await contract.transfer(toAddress, amount).send()
  return tx
}

export async function getUSDTTransfersToAddress(_address) {
  // Placeholder: integrar TronGrid para producción
  return []
}


