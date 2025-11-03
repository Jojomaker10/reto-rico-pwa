import TronWeb from 'tronweb'
import 'dotenv/config'

const fullNode = process.env.TRON_FULL_NODE || 'https://api.trongrid.io'
const solidityNode = process.env.TRON_SOLIDITY_NODE || 'https://api.trongrid.io'
const eventServer = process.env.TRON_EVENT_SERVER || 'https://api.trongrid.io'

export const tronWeb = new TronWeb({
  fullHost: fullNode,
  headers: process.env.TRONGRID_API_KEY ? { 'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY } : undefined,
  privateKey: process.env.MAIN_WALLET_PRIVATE_KEY || undefined,
})


