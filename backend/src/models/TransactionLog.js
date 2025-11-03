import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/db.js'

class TransactionLog extends Model {}

TransactionLog.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    type: { type: DataTypes.ENUM('deposit', 'withdrawal'), allowNull: false },
    reference_id: { type: DataTypes.UUID, allowNull: false },
    payload: { type: DataTypes.JSONB, allowNull: false },
  },
  { sequelize, modelName: 'transaction_log', timestamps: true }
)

export default TransactionLog


