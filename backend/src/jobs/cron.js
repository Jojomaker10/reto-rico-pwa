import 'dotenv/config'
import { sequelize } from '../config/db.js'
import { scanDeposits, updateConfirmations } from '../services/blockchain/monitor.service.js'

async function main() {
  await sequelize.authenticate()
  await scanDeposits()
  await updateConfirmations()
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


