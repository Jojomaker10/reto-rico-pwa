import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/db.js'
import User from './User.js'

class Deposit extends Model {}

Deposit.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    amount_usdt: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
    amount_usd: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    tx_hash: { type: DataTypes.STRING, allowNull: false, unique: true },
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'failed'), defaultValue: 'pending' },
    confirmations: { type: DataTypes.INTEGER, defaultValue: 0 },
    confirmed_at: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'deposit', timestamps: true }
)

User.hasMany(Deposit, { foreignKey: 'user_id' })
Deposit.belongsTo(User, { foreignKey: 'user_id' })

export default Deposit


