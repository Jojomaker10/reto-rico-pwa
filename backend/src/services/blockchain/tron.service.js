import { tronWeb } from '../../config/tron.js'
import 'dotenv/config'
import axios from 'axios'

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

export async function getUSDTTransfersToAddress(address) {
  // TronGrid TRC20 transfers for an account
  // Example (Nile): https://api.nileex.io/v1/accounts/{address}/transactions/trc20?contract_address={USDT}
  const base = process.env.TRON_EVENT_SERVER || 'https://api.nileex.io'
  const url = `${base.replace(/\/$/, '')}/v1/accounts/${address}/transactions/trc20`
  const headers = {}
  if (process.env.TRONGRID_API_KEY) headers['TRON-PRO-API-KEY'] = process.env.TRONGRID_API_KEY

  try {
    const { data } = await axios.get(url, {
      params: { contract_address: USDT_CONTRACT, limit: 50, order_by: 'block_timestamp,desc' },
      headers
    })

    const list = Array.isArray(data?.data) ? data.data : []
    const required = Number(process.env.REQUIRED_CONFIRMATIONS || 20)
    return list
      .filter((tx) => String(tx?.to) === address)
      .map((tx) => ({
        tx_hash: tx.transaction_id,
        amount_usdt: Number(tx.value || 0) / 1e6,
        confirmations: required,
        confirmed: true,
        block_timestamp: tx.block_timestamp,
      }))
  } catch (e) {
    return []
  }
}


