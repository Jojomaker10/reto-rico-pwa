import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/db.js'

class Setting extends Model {}

Setting.init(
  {
    key: { type: DataTypes.STRING, primaryKey: true },
    value: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: 'setting', timestamps: false }
)

export default Setting


