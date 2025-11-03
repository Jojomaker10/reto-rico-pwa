import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/db.js'

class IncomingTransfer extends Model {}

IncomingTransfer.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tx_hash: { type: DataTypes.STRING, unique: true, allowNull: false },
    amount_usdt: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
    block_timestamp: { type: DataTypes.BIGINT, allowNull: true },
    processed: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, modelName: 'incoming_transfer', timestamps: true }
)

export default IncomingTransfer


