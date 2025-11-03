import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/db.js'
import User from './User.js'

class Withdrawal extends Model {}

Withdrawal.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    wallet_address_destination: { type: DataTypes.STRING, allowNull: false },
    amount_usdt: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
    amount_usd: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    fee: { type: DataTypes.DECIMAL(18, 6), defaultValue: 0 },
    tx_hash: { type: DataTypes.STRING, allowNull: true, unique: true },
    status: { type: DataTypes.ENUM('requested', 'approved', 'processing', 'completed', 'rejected'), defaultValue: 'requested' },
    admin_notes: { type: DataTypes.TEXT, allowNull: true },
    approved_at: { type: DataTypes.DATE, allowNull: true },
    completed_at: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'withdrawal', timestamps: true }
)

User.hasMany(Withdrawal, { foreignKey: 'user_id' })
Withdrawal.belongsTo(User, { foreignKey: 'user_id' })

export default Withdrawal


