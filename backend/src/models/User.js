import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/db.js'

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    balance_usd: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0 },
    wallet_address_deposit: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: 'user', timestamps: true }
)

export default User


