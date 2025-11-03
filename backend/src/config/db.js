import { Sequelize } from 'sequelize'
import 'dotenv/config'

const databaseUrl = process.env.DATABASE_URL

export const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, { dialect: 'postgres', logging: false })
  : new Sequelize({ dialect: 'sqlite', storage: 'data.sqlite', logging: false })


