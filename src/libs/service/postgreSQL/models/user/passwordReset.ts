import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../sequelize'
import { User } from './users'
import { PasswordResetAttributes } from '../../../../utils/types'

type PasswordResetCreationAttributes = Optional<PasswordResetAttributes, 'id' | 'createdAt' | 'expiresAt'>

class PasswordReset extends Model<PasswordResetAttributes, PasswordResetCreationAttributes> implements PasswordResetAttributes {
    public id!: string
    public userId!: string
    public otp!: string
    public isVerified!: boolean
    public isUsed!: boolean
    public expiresAt!: Date
    public createdAt!: Date
    public deletedAt?: Date
}

PasswordReset.init(
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
        otp: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isUsed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        sequelize: sequelize,
        tableName: 'PasswordReset',
        timestamps: true,
        paranoid: true
    }
)

User.hasMany(PasswordReset, { foreignKey: 'userId', as: 'passwordReset' })
PasswordReset.belongsTo(User, { foreignKey: 'userId', as: 'user' })

export { PasswordReset }
