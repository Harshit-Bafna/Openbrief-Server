import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../sequelize'
import { User } from '../user/users'
import { RefreshTokenAttributes } from '../../../../utils/types'

type RefreshTokenCreationAttributes = Optional<RefreshTokenAttributes, 'id' | 'createdAt' | 'expiresAt'>

class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
    public id!: string
    public userId!: string
    public refreshToken!: string
    public expiresAt!: Date
    public createdAt!: Date
}

RefreshToken.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize: sequelize,
        tableName: 'RefreshTokens',
        timestamps: true
    }
)

User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' })
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' })

export { RefreshToken }
